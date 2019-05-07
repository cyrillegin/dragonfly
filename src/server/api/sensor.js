import uuidv4 from 'uuid/v4';
import { getStation, createStation } from './station';

async function getSensors(req, res) {
  return await req.context.Sensor.all();
}

async function _getSensor(context, sensor) {
  return (await context.Sensor.find(sensor))[0];
}

async function getSensor(req, res) {
  const queryParameters = {};
  req.url
    .split('?')[1]
    .split('&')
    .forEach(e => {
      queryParameters[e.split('=')[0]] = e.split('=')[1];
    });
  const rest = await _getSensor(req.context, { _id: queryParameters.sensor });
  res.send(rest);
}

async function createSensor(context, sensor) {
  let station = await getStation(context, sensor.stationName);

  if (!station) {
    station = await createStation(context, { name: sensor.stationName });
  }

  await context.Sensor.insert({
    _id: uuidv4().replace(/-/g, ''),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: sensor.sensorName,
    station: station._id,
  });

  return (await context.Sensor.find({ name: sensor.sensorName }))[0];
}

export { getSensor, _getSensor, createSensor, getSensors };
