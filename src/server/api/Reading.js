import { Router } from 'express';
import { Reading } from '../db';

const router = new Router();

/**
 * GET
 * Gets an array of all the readings for a particular sensor
 *
 * kwargs: sensorId (int)
 *         startTime (date) - default 7 days ago
 *         endTime (date) - default now
 *
 * returns {
 *   readings: [{
 *     value: 123,
 *     timestamp: '10-4'
 *   }]
 * }
 */
router.get('/', async (req, res) => {
  console.info('GET request to reading');
  let { sensorId, startTime, endTime } = req.query;
  if (!sensorId) {
    res.status(400).send({ error: 'You must provide a sensor id' });
    return;
  }

  const currentDate = new Date();
  const tempDate = new Date();

  if (!startTime) {
    tempDate.setDate(currentDate.getDate() - 7);
    startTime = tempDate;
  }

  if (!endTime) {
    endTime = currentDate;
  }

  if (endTime < startTime) {
    tempDate.setDate(new Date(endTime).getDate() - 7);
    startTime = tempDate;
  }

  const readings = await Reading.findAll({
    where: {
      sensorId,
      from: {
        $between: [startTime, endTime],
      },
    },
  });
  res.send(readings);
});

/**
 * POST
 * Creates a new station
 *
 * params: {
 *   name: 'station name',
 *   ip: 'xxx.xxx.xxx.xxx',
 *   sensorId: 1,
 *   stationId: 1
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.post('/', async (req, res) => {
  console.info('POST request to reading');
  const { value, timestamp, sensorId, stationId } = req.body;
  console.log(value);

  const valid = validateReadingParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    const result = await Reading.create({ value, timestamp, sensorId, stationId });
    console.info('new reading added');
    res.status(200).send({ message: 'success' });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

const validateReadingParams = params => {
  if (!params.stationId) {
    return { error: 'Station id required' };
  }
  if (!params.sensorId) {
    return { error: 'Sensor id required' };
  }
  if (!params.timestamp) {
    return { error: 'Timestamp required' };
  }
  if (params.value === undefined || params.value === null) {
    return { error: 'Value required' };
  }
  return {};
};

export default router;
