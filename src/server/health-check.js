import 'regenerator-runtime/runtime';
import { Station, Sensor, Action, Reading } from './db';
import fetch from 'node-fetch';

const testSensor = (ip) => {


    fetch('http://127.0.0.1:3001/sensorHealth').then(res => {
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
  testSensor()
  // stations.forEach(station => {
  //   station.sensors.forEach(sensor => {
  //     console.log(sensor)
  //   })
  // })
}

setTimeout(() => {
  setInterval(() => {
    console.log('checking')
    runHealthCheck();
  }, process.env.HEALTH_CHECK_INTERVAL * 1000)
}, 1000)
