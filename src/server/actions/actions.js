import '../env';
import 'regenerator-runtime/runtime';
import { Action, Reading, Sensor, Station, setupDb } from '../db';
import sendSlack from './slack';
import toggleWemo from './wemo';
import requestAndUploadImage from './camera';

setupDb();

const processes = {};

/* eslint-disable id-length */
const units = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
};
/* eslint-enable id-length */

// Makes checks against values - if value is > 50, do something.
const checkAgainstValue = (action, reading) => {
  let alert;
  switch (action.condition) {
    case 'gt':
      if (parseFloat(reading.value) > parseFloat(action.value)) {
        alert = reading;
      }
      break;
    case 'gte':
      if (parseFloat(reading.value) >= parseFloat(action.value)) {
        alert = reading;
      }
      break;
    case 'eq':
      if (parseFloat(reading.value) === parseFloat(action.value)) {
        alert = reading;
      }
      break;
    case 'lt':
      if (parseFloat(reading.value) < parseFloat(action.value)) {
        alert = reading;
      }
      break;
    case 'lte':
      if (parseFloat(reading.value) <= parseFloat(action.value)) {
        alert = reading;
      }
      break;
  }
  return alert;
};

// Makes checks against the time of day - If time is 6:00p.m., do something
const checkAgainstTime = action => {
  const currentTime = new Date();
  const timeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const parts = action.value.split(':');
  const value = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  return checkAgainstValue({ ...action.dataValues, value }, { value: timeInMinutes });
};

// Makes checks against timestamps - if last reading was more than an hour ago, do something
const checkAgainstLastTimestamp = async action => {
  const lastReading = await Reading.findOne({
    where: {
      sensorId: action.sensorId,
    },
    order: [['createdAt', 'DESC']],
  });
  // if last curent time - reading.timestamp > 1 day, alert..
  return true;
};

const checkAgainstLastValue = async action => {
  const lastReading = await Reading.findOne({
    where: {
      sensorId: action.sensorId,
    },
    order: [['created_at', 'DESC']],
  });

  return checkAgainstValue(action, lastReading);
};

const makeCheck = async actionId => {
  const action = await Action.findOne({ where: { id: actionId } });

  let alert;
  switch (action.valueType) {
    case 'time':
      alert = await checkAgainstTime(action);
      break;
    case 'value':
      alert = await checkAgainstLastValue(action);
      break;
    case 'timestamp':
      alert = await checkAgainstLastTimestamp(action);
      break;
    case 'interval':
      alert = true;
      break;
    default:
      console.error('Error: Did not understand action valueType');
  }

  if (alert) {
    console.info(
      `${action.action} action triggered by sensor ${action.sensorId} on station ${action.stationId}`,
    );

    switch (action.action) {
      case 'slack':
        const details = {
          action: { ...action.dataValues },
          reading: alert,
          sensor: await Sensor.findOne({ where: { id: action.sensorId } }),
        };
        sendSlack(details);
        break;
      case 'wemo':
        toggleWemo(action);
        break;
      case 'camera':
        requestAndUploadImage({
          action,
          station: await Station.findOne({ where: { id: action.stationId } }),
        });
        break;
    }
  }
};

const manageProcess = async () => {
  console.info('Checking actions.');
  const actions = await Action.findAll();
  actions.forEach(action => {
    if (!(action.id in processes)) {
      const unit = action.interval[action.interval.length - 1];
      const time = action.interval.slice(0, -1);
      processes[action.id] = setInterval(
        () => makeCheck(action.id),
        parseInt(time, 10) * units[unit],
      );
    }
  });
};

setInterval(manageProcess, 1000 * process.env.ACTION_INTERVAL || 60);

export { checkAgainstValue, checkAgainstLastValue, checkAgainstLastTimestamp, checkAgainstTime };
