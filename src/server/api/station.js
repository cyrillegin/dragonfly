import uuidv4 from 'uuid/v4';
import { getSensors } from './sensor';

async function getStations(req, res) {
  const sensors = await getSensors(req);
  const stations = await req.context.Station.all();
  res.send(
    sensors.map(sensor => {
      return {
        ...sensor,
        station: stations.find(station => station._id === sensor.station),
      };
    }),
  );
}

async function getStation(context, name) {
  return (await context.Station.find({ name: name }))[0];
}

async function createStation(context, station) {
  await context.Station.insert({
    _id: uuidv4().replace(/-/g, ''),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: station.name,
  });
  return (await context.Station.find(station))[0];
}

export { getStation, getStations, createStation };
