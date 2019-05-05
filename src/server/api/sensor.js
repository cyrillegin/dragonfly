import uuidv4 from 'uuid/v4';
import { getStation, createStation } from './station';

async function getSensors(req, res) {
  return await req.context.Sensor.all();
}
async function getSensor(context, sensor) {
  return (await context.Sensor.find(sensor))[0];
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

export { getSensor, createSensor, getSensors };
