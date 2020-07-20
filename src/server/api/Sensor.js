import { Router } from 'express';
import { Sensor, Station, Action, Reading } from '../db';
import { validateSensorParams } from '../utilities/Validators';
import fetch from 'node-fetch';

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

  const { stationId, sensorType, name, description, coefficients, on } = req.body;

  const type = sensorType;

  const isValid = validateSensorParams({ name, stationId, type });
  if (isValid.error) {
    res.status(400).send({ error: isValid.error });
    return;
  }

  const station = await Station.findAll({ where: { id: stationId } });
  const ipaddress = station[0].ip === '127.0.0.1' ? '127.0.0.1:3001' : station[0].ip;

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
  const valid = validateSensorParams(req.body);
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

  const { stationId, sensorType, name } = req.body;

  const isValid = validateSensorParams({ name, stationId, type: sensorType });
  if (isValid.error) {
    res.status(400).send({ error: isValid.error });
    return;
  }

  const station = await Station.findAll({ where: { id: stationId } });
  const ipaddress = station[0].ip === '127.0.0.1' ? '127.0.0.1:3001' : station[0].ip + ':3001';

  fetch(`http://${ipaddress}/sensorCheck?sensorType=${sensorType}`)
    .then(result => result.text())
    .then(result => {
      if (result === 'unhealthy') {
        console.info('Sensor test failed!');
        res.send({ error: 'Sensor failed' });
        return;
      }
      console.info('Sensor test successful!');
      res.send({ message: 'success' });
    })
    .catch(error => {
      console.info('Sensor test failed!');
      res.send({ error });
    });
});

export default router;
