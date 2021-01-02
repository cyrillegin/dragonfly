import 'regenerator-runtime/runtime';
import { Action, Reading, Sensor } from '../db';
import sendSlack from './slack';

const processes = {};

const units = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
};

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
  console.log(timeInMinutes, value);
  return checkAgainstValue({ ...action, value }, { value: timeInMinutes });
};

// Makes checks against timestamps - if last reading was more than an hour ago, do something
const checkAgainstTimestamp = () => {};

const makeCheck = async action => {
  let alert;
  if (action.valueType === 'time') {
    alert = checkAgainstTime(action);
  } else {
    const lastReadings = await Reading.findAll({
      limit: 20,
      where: {
        sensorId: action.sensorId,
      },
    });
    lastReadings.forEach(reading => {
      if (action.valueType === 'value') {
        alert = checkAgainstValue(reading);
      } else if (action.valueType === 'timestamp') {
        alert = checkAgainstTimestamp(reading);
      } else {
        // this should never occur
      }
    });
  }
  if (alert) {
    const details = {
      action: { ...action.dataValues },
      reading: alert,
      sensor: (await Sensor.findAll({ where: { id: action.sensorId } }))[0],
    };
    switch (action.action) {
      case 'slack':
        sendSlack(details);
    }
  }
};

const manageProcess = async () => {
  const actions = await Action.findAll();
  actions.forEach(action => {
    if (!(action.id in processes)) {
      const unit = action.interval[action.interval.length - 1];
      const time = action.interval.slice(0, -1);
      processes[action.id] = setInterval(() => makeCheck(action), parseInt(time, 10) * units[unit]);
    }
  });
};

// Check every hour for any updates
setInterval(manageProcess, 1000 * 60 * 60);
