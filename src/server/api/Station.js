import { Router } from 'express';
import fetch from 'node-fetch';
import { Station, Sensor, Action, Reading } from '../db';
import { validateStationParams } from '../utilities/Validators';

const router = new Router();

/**
 * GET
 * Gets an array of all the stations and their sensors
 *
 * kwargs: none
 *
 * returns {
 *   stations: [{
 *     name: 'station name',
 *     address: '123.123.123.123:3000',
 *     sensors: [{
 *       name: 'sensor name',
 *       id: 1,
 *       description: 'A sensor',
 *       health: 'healthy',
 *       state: 'on, off, null',
 *       coefficients: '9/5, 32',
 *       hardwareSensor: 'GPIO',
 *       type: 'temperature'
 *       actions: [{
 *         condition: 'condition',
 *         action: 'action',
 *         interval: '5h'
 *       }],
 *     }]
 *   }]
 * }
 */
router.get('/', async (req, res) => {
  console.info('GET request to station');
  let stations = await Station.findAll({
    include: [
      {
        model: Sensor,
        include: [Action],
      },
    ],
  });
console.log(stations[1].lastHealthTimestamp)
  stations = stations.map(async station => ({
    ...station.dataValues,
    sensors: await Promise.all(
      station.dataValues.sensors.map(async sensor => {
        const lastReading = await Reading.findOne({
          limit: 1,
          where: {
            sensorId: sensor.id,
          },
          order: [['created_at', 'DESC']],
        });
        return {
          ...sensor.dataValues,
          lastReading,
          stationName: station.name,
        };
      }),
    ),
  }));

  res.send(await Promise.all(stations));
});

/**
 * POST
 * Creates a new station
 *
 * params: {
 *   name: 'station name',
 *   ip: 'xxx.xxx.xxx.xxx'
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.post('/', async (req, res) => {
  console.info('POST request to station');
  const { name, address, port, error } = validateStationParams(req.body);
  if (error) {
    console.error('POST Failed - Invalid IP');
    res.status(400).send(JSON.stringify({ error }));
    return;
  }

  try {
    await Station.create({
      name,
      address,
      port,
      lastHealthTimestamp: new Date(),
    });
    console.info('POST Successfull - New station added');
    res.status(200).send(JSON.stringify({ message: 'success' }));
  } catch (err) {
    console.error('POST Failed - An error occured!');
    console.error(err);
    res.status(400).send(JSON.stringify({ error: 'An unknown error has occured' }));
  }
});

/**
 * PUT
 * Updates an existing station
 *
 * params:  {
 *   name: 'station name',
 *   ip: 'xxx.xxx.xxx.xxx'
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.put('/', async (req, res) => {
  console.info('PUT request to station');
  const valid = validateStationParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }
  try {
    await Station.update(
      {
        name: req.body.name,
        address: req.body.ip,
      },
      {
        where: { id: req.body.id },
      },
    );
    console.info('station updated');
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

/**
 * DELETE
 * Deletes an existing station and all of its readings, actions, and sensors
 *
 * kwargs: id=stationId (int)
 *
 * returns: 200 - success and the number of actions, readings, sensors, and stations deleted
 *          400 if id doesn't exist
 */
router.delete('/', async (req, res) => {
  console.info('DELETE request to station');
  if (!req.query.id) {
    res
      .status(400)
      .send({ error: 'You must provide the id of the station you would like to delete' });
    return;
  }
  try {
    const actions = await Action.destroy({
      where: { stationId: req.query.id },
    });

    const readings = await Reading.destroy({
      where: { stationId: req.query.id },
    });

    const sensors = await Sensor.destroy({
      where: { stationId: req.query.id },
    });

    const stations = await Station.destroy({
      where: { id: req.query.id },
    });

    res.status(200).send({ message: 'success', actions, sensors, stations, readings });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

router.post('/test', async (req, res) => {
  console.info('TEST request to station');

  const { address, port, error } = validateStationParams(req.body);

  if (error) {
    res.status(400).send({ error });
    return;
  }

  const fqdn = `http://${address}${port === 80 ? '' : `:${port}`}`;
  const healthEndpoint = `${fqdn}/health`;

  fetch(healthEndpoint)
    .then(result => {
      if (result.status !== 200) {
        res.status(400).send({ error: 'Address not found.' });
        return;
      }
      res.send({ message: 'success' });
    })
    .catch(err => {
      if (err.message) {
        res.status(400).send({ error: err.message });
      } else {
        res.send(err);
      }
    });
});

export default router;
