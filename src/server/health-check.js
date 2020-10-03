import 'regenerator-runtime/runtime';
import fetch from 'node-fetch';
import { Station, Sensor, Action } from './db';

const testSensor = (address, sensorId, stationId, hardwareName) => {
  fetch(
    `http://${address}/sensorHealth?sensorId=${sensorId}&type=temperature&stationId=${stationId}&ip=${process.env.IP}&pollRate=300&hardwareName=${hardwareName}`,
  ).then(res => {
    console.info('test complete');
    // console.log(res);
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
      testSensor(station.address + ':' + station.port, sensor.id, station.id, sensor.hardwareName);
    });
  });
};

setTimeout(() => {
  setInterval(() => {
    console.log('running check');
    runHealthCheck();
  }, process.env.HEALTH_CHECK_INTERVAL * 1000);
}, 1000);
