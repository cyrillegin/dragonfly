import 'regenerator-runtime/runtime';
import fetch from 'node-fetch';
import { Station, Sensor, Action } from './db';

const testSensor = (ip, sensorId, stationId) => {
  fetch(
    `http://${ip}/sensorHealth?sensorId=${sensorId}&type=temperature&stationId=${stationId}`,
  ).then(res => {
    console.info('test complete');
  });
};

const runHealthCheck = async () => {
  const stations = await Station.findAll({
    include: [
      {
        model: Sensor,
        include: [Action],
      },
    ],
  });

  stations.forEach(station => {
    if (station.name === 'Main') {
      station.sensors.forEach(sensor => {
        if (sensor.name === 'My Temp') {
          // console.log(station.dataValues)
          testSensor(`${station.ip}:3001`, sensor.id, station.id);
        }
      });
    }
  });
};

setTimeout(() => {
  setInterval(() => {
    runHealthCheck();
  }, process.env.HEALTH_CHECK_INTERVAL * 1000);
}, 1000);
