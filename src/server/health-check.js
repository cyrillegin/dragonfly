import 'regenerator-runtime/runtime';
import { Station, Sensor, Action, Reading } from './db';
import fetch from 'node-fetch';

const testSensor = (ip, sensorId) => {
    fetch(`http://${ip}/sensorHealth?sensorId=${sensorId}`).then(res => {
      console.log('here we are')
      console.log(res)
    })
}


const runHealthCheck = async () => {
  const stations = await Station.findAll({include: [
    {
      model: Sensor,
      include: [Action],
    },
  ]});

  stations.forEach(station => {
    if(station.name === 'Main') {
      console.log(station.dataValues)
    }
    station.sensors.forEach(sensor => {
      console.log(sensor.name)
      if (sensor.name === 'temp'){
        // console.log(station.dataValues)
        // testSensor(station.ip + ':3001', sensor.id)
      }
    })
  })
}

setTimeout(() => {
  setInterval(() => {
    console.log('checking')
    runHealthCheck();
  }, process.env.HEALTH_CHECK_INTERVAL * 1000)
}, 1000)
