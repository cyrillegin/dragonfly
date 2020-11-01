import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Dashboard } from '../db';
import { validateDashboardParams } from '../utilities/Validators';

const router = new Router();

/**
 * GET
 * Gets an array of dashboards
 *
 * returns {
 *   dashboards: [{
 *     id: 123
 *     dashboardId: "123-sdfg",
 *     stationId: 123
 *     sensorId: 123,
 *     position: 123
 *   }]
 * }
 */
router.get('/', async (req, res) => {
  console.info('GET request to dashboard');
  const dashboards = await Dashboard.findAll();
  let payload = {};
  dashboards.forEach(dashboard => {
    const id = dashboard.dashboard_id;
    if (!(id in payload)) {
      payload[id] = {
        name: dashboard.name,
        sensors: [],
      };
    }
    payload[id].sensors.push({
      id: dashboard.sensor_id,
      stationId: dashboard.station_id,
      position: dashboard.position,
    });
  });
  payload = Object.entries(payload).map(([key, value]) => ({
    dashboardId: key,
    ...value,
  }));
  res.send(payload);
});

/**
 * POST
 * Creates a new dashboard
 *
 * params: {
 *   name: 'station name',
 *   sensors: [{
 *   sensorId: 123,
 *   stationId: 123,
 *   position: 1
 }]
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.post('/', async (req, res) => {
  console.info('POST request to dashboard');
  const { name, sensors } = req.body;

  const valid = validateDashboardParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    const dashboardId = uuid();

    await Promise.all(
      sensors.map(sensor =>
        Dashboard.create({
          name,
          dashboard_id: dashboardId,
          sensor_id: sensor.id,
          station_id: sensor.stationId,
          position: sensor.position,
        }),
      ),
    );

    console.info(`new dashboard created with guid${dashboardId}.`);
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

export default router;
