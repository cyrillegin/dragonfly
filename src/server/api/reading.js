import uuidv4 from 'uuid/v4';
import { createStation, getStation } from './station';
import { getSensor, createSensor } from './sensor';

async function createReading(req, res) {
  let station = await getStation(req.context, {
    name: req.body.stationName,
  });
  if (!station) {
    station = await createStation(req.context, { name: req.body.stationName });
  }

  let sensor = await getSensor(req.context, {
    name: req.body.sensorName,
    station: station._id,
  });
  if (!sensor) {
    sensor = await createSensor(req.context, {
      sensorName: req.body.sensorName,
      stationName: req.body.stationName,
    });
  }

  await req.context.Reading.insert({
    _id: uuidv4().replace(/-/g, ''),
    createdAt: new Date(),
    updatedAt: new Date(),
    sensor: sensor._id,
    timestamp: new Date(req.body.timestamp),
    value: req.body.value,
  });
  res.send('success');
}

async function getReadings(req, res) {
  const queryObject = {};
  req.url
    .split('?')[1]
    .split('&')
    .forEach(e => {
      queryObject[e.split('=')[0]] = e.split('=')[1];
    });
  const readings = await req.context.Reading.find(queryObject);
  res.send(readings);
}

export { getReadings, createReading };
