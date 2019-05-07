import { createReading, getReadings } from './api/reading';
import { getSensor } from './api/sensor';
import { getStations } from './api/station';

export default function withRoutes(app) {
  console.log('setting up routes');
  app.post('/api/reading', createReading);
  app.get('/api/reading/?*', getReadings);

  app.get('/api/sensor', getSensor);

  app.get('/api/station', getStations);
}
