import 'regenerator-runtime/runtime';
import fetch from 'node-fetch';
import { Station, Sensor, Action } from './db';

const testSensor = (address, sensorId, stationId, hardwareName) => {
  const kwargs = {
    sensorId,
    type: 'temperature',
    stationId,
    ip: process.env.IP,
    pollRate: 300,
    hardwareName,
  };

  const kwargString = Object.entries(kwargs).reduce(
    (acc, [key, value]) => `${acc}&${key}=${value}`,
    '?',
  );

  fetch(`http://${address}/sensorHealth${kwargString}`).then(res => {
    console.info('health check complete');
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
    station.sensors.forEach(sensor => {
      // Skip fixture sensors
      if (sensor.dataValues.name.includes('FIXTURE')) {
        return;
      }
      testSensor(`${station.address}:${station.port}`, sensor.id, station.id, sensor.hardwareName);
    });
  });
};

setTimeout(() => {
  setInterval(() => {
    runHealthCheck();
  }, process.env.HEALTH_CHECK_INTERVAL * 1000);
}, 1000);
