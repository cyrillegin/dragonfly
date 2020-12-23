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

const makeCheck = async action => {
  const lastReadings = await Reading.findAll({
    limit: 20,
    where: {
      sensorId: action.sensorId,
    },
  });
  let alert = null;
  lastReadings.forEach(reading => {
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
  });
  if (alert) {
    const details = {
      action: { ...action.dataValues },
      reading: alert,
      sensor: (await Sensor.findAll({ where: { id: action.sensorId } }))[0],
    };
    console.log('alert');
    switch (action.action) {
      case 'slack':
        sendSlack(details);
    }
  }
};

const manageProcess = async () => {
  console.log('managing');
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
