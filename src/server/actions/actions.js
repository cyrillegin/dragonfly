import 'regenerator-runtime/runtime';
import { Action, Reading } from '../db';

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
  lastReadings.forEach(reading => {
    console.log(reading.value);
  });
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
setInterval(manageProcess, 1000); // 1000 * 60 * 60);
