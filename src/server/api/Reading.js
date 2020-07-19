import { Router } from 'express';
import { Op } from 'sequelize';
import { Reading } from '../db';
import { validateReadingParams } from '../utilities/Validators';

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
  let { sensorId, start, end } = req.query;
  if (!sensorId) {
    res.status(400).send({ error: 'You must provide a sensor id' });
    return;
  }

  const currentDate = new Date();
  const tempDate = new Date();

  if (!start) {
    tempDate.setDate(currentDate.getDate() - 7);
    start = tempDate;
  }

  if (!end) {
    end = currentDate;
  }

  if (end < start) {
    tempDate.setDate(new Date(end).getDate() - 7);
    start = tempDate;
  }

  const readings = await Reading.findAll({
    where: {
      sensorId,
      timestamp: {
        [Op.lt]: end,
        [Op.gt]: start,
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
  console.log(req.body)
  const { value, timestamp, sensorId, stationId } = req.body;


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

export default router;
