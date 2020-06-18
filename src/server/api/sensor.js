import { Router } from 'express';
import SENSOR_TYPES from '../constants';
import { Sensor, Station, Action, Reading } from '../db';

const router = new Router();
/**
 * POST
 * Creates a new Sensor
 *
 * params:  {
 *   stationId: 3,
 *   name: 'sensor name',
 *   description: 'sensor description',
 *   coeffecients: '9/5, 32',
 *   type: 'temperature'
 * }
 *
 * returns: 200 success, 400 if validation fails
 */

router.post('/', async (req, res) => {
  console.info('POST request to sensor');
  // General validation
  const valid = await validateSensorParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }
  // POST specific validation
  const { name, stationId, type, description, coefficients, on } = req.body;
  if (!stationId) {
    res.status(400).send({ error: 'Station id required' });
    return;
  }

  const stationCount = await Station.count({ where: { id: stationId } });
  if (!stationCount) {
    res.status(400).send({ error: 'Station not found' });
    return;
  }

  // Create the new Sensor
  try {
    const result = await Sensor.create({ name, stationId, type, description, coefficients, on });
    console.info('new sensor added');
    res.status(200).send({ message: 'success' });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

/**
 * PUT
 * Updates an existing sensor
 *
 * params: {
 *   id: 3,
 *   name: 'sensor name',
 *   description: 'sensor description',
 *   coeffecients: '9/5, 32',
 *   type: 'temperature'
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.put('/', async (req, res) => {
  console.info('PUT request to sensor');
  // General validation
  const valid = await validateSensorParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  // PUT specific validation
  const { name, stationId, type, description, coefficients, on, id } = req.body;
  if (!id) {
    res.status(400).send({ error: 'Sensor id required' });
    return;
  }

  const sensorCount = await Sensor.count({ where: { id } });
  if (!sensorCount) {
    res.status(400).send({ error: 'Sensor not found' });
    return;
  }

  // Update sensor
  try {
    const result = await Sensor.update(
      { name, type, description, coefficients, on },
      {
        where: { id },
      },
    );

    console.info('sensor updated');
    res.status(200).send({ message: 'success' });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

/**
 * DELETE
 * Deletes an existing sensor and all of its readings and actions
 *
 * kwargs: id=sensorId (int)
 *
 * returns: 200 - success and the number of actions, readings, and sensors deleted
 *          400 if id doesn't exist
 */

router.delete('/', async (req, res) => {
  console.info('DELETE request to sensor');
  if (!req.query.id) {
    res
      .status(400)
      .send({ error: 'You must provide the id of the sensor you would like to delete' });
    return;
  }
  try {
    const actions = await Action.destroy({
      where: { sensorId: req.query.id },
    });

    const readings = await Reading.destroy({
      where: { sensorId: req.query.id },
    });

    const sensors = await Sensor.destroy({
      where: { id: req.query.id },
    });

    res.status(200).send({ message: 'success', actions, sensors, readings });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

router.post('/test', async (req, res) => {
  console.info('TEST request to sensor');
  const { ipaddress } = req.body;
  res.send({ message: 'success' });

  const sensorType = 'DS18B20';

  fetch(`http://${ipaddress}/sensorCheck?sensorType=${sensorType}`)
    .then(result => {
      res.send({ message: 'success' });
    })
    .catch(error => {
      res.send({ error });
    });
});

const validateSensorParams = async params => {
  if (!params.name) {
    return { error: 'Sensor name required' };
  }
  if (!params.stationId) {
    return { error: 'Station id required' };
  }
  if (!params.type) {
    return { error: 'Sensor type required' };
  }
  if (!SENSOR_TYPES.includes(params.type)) {
    return { error: 'Invalid sensor type' };
  }

  return {};
};

export default router;
