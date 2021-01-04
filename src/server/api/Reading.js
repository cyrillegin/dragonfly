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

  let readings = await Reading.findAll({
    where: {
      sensorId,
      timestamp: {
        [Op.lt]: end,
        [Op.gt]: start,
      },
    },
    order: [['timestamp', 'ASC']],
  });

  // do better
  readings = readings.filter((reading, index) => index % `${readings.length}`.length === 0);
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

  const valid = validateReadingParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    await Reading.create({ value, timestamp, sensorId, stationId });
    console.info(`new reading added for sensor ${sensorId} with value ${value}`);
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

router.post('/bulk', async (req, res) => {
  console.info('POST request to bulk reading');

  try {
    req.body.readings.forEach(async reading => {
      await Reading.create(reading);
    });
  } catch (error) {
    console.error('Error bulk adding entries');
    console.error(error);
    res.statues(400).send({ error });
  }

  res.status(200).send({ message: 'success' });
});

export default router;
