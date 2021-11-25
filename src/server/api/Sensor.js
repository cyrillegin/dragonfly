import { Router } from 'express';
import fetch from 'node-fetch';
import { Sensor, Station, Action, Reading } from '../db';
import { validateSensorParams, validateSensorPollRate } from '../utilities/Validators';

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
 *   hardwareName: 'gpio'
 *   type: 'temperature'
 * }
 *
 * returns: 200 success, 400 if validation fails
 */

router.post('/', async (req, res) => {
  console.debug('POST request to sensor');

  let {
    stationId,
    hardwareName,
    hardwareType,
    readingType,
    name,
    description,
    coefficients,
    pollRate,
    unit,
  } = req.body;

  if (hardwareName === 'self-entry') {
    readingType = 'unknown';
    hardwareType = 'unknown';
  }

  const isValid = validateSensorParams({
    name,
    stationId,
    hardwareName,
    hardwareType,
    readingType,
    pollRate,
    unit,
  });

  if (isValid.error && hardwareName !== 'self-entry') {
    res.status(400).send({ error: isValid.error });
    return;
  }

  // Create the new Sensor
  try {
    await Sensor.create({
      name,
      stationId,
      hardwareName,
      hardwareType,
      readingType,
      description,
      coefficients,
      pollRate,
      unit,
      lastHealthTimestamp: new Date(),
      health: 'healthy',
    });
    console.info('new sensor added');
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
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
  console.debug('PUT request to sensor');

  // PUT specific validation
  const { id, pollRate } = req.body;
  if (!id) {
    res.status(400).send({ error: 'Sensor id required' });
    return;
  }

  const sensorCount = await Sensor.count({ where: { id } });
  if (!sensorCount) {
    res.status(400).send({ error: 'Sensor not found' });
    return;
  }

  if (pollRate) {
    const pollValidation = validateSensorPollRate(pollRate);
    if (pollValidation.error) {
      res.status(400).send({ error: pollValidation.error });
      return;
    }
  }

  const updates = Object.entries(req.body).reduce((acc, [key, value]) => {
    if (['name', 'description', 'coefficients', 'unit'].includes(key)) {
      acc[key] = value;
    }
    if (key === 'pollRate') {
      acc.poll_rate = value;
    }
    return acc;
  }, {});

  // Update sensor
  try {
    await Sensor.update(updates, {
      where: { id },
    });

    console.debug('sensor updated');
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
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
  console.debug('DELETE request to sensor');
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
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

router.post('/test', async (req, res) => {
  console.debug('TEST request to sensor');

  const { stationId, hardwareName, readingType } = req.body;

  const station = await Station.findAll({ where: { id: stationId } });
  const ipaddress = `${station[0].address}:${station[0].port}`;

  fetch(`http://${ipaddress}/sensorCheck?hardwareSensor=${hardwareName}&readingType=${readingType}`)
    .then(result => result.json())
    .then(result => {
      if (result === 'unhealthy') {
        console.debug('Sensor test failed!');
        res.send({ error: 'Sensor failed' });
        return;
      }
      console.debug('Sensor test successful!');
      res.send({ message: result });
    })
    .catch(error => {
      console.error('Sensor test failed!');
      console.error(error);
      res.send({ error });
    });
});

export default router;
