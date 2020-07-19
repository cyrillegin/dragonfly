import { Router } from 'express';
import fetch from 'node-fetch';
import { Station, Sensor, Action, Reading } from '../db';
import {validateStationParams, isIP} from '../utilities/Validators'
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
 *     ipAdress: '123.123.123.123',
 *     sensors: [{
 *       name: 'sensor name',
 *       id: 1,
 *       description: 'A sensor',
 *       health: 'healthy',
 *       state: 'on, off, null',
 *       coefficients: '9/5, 32',
 *       type: 'temperature',
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
  const stations = await Station.findAll({
    include: [
      {
        model: Sensor,
        include: [Action],
      },
    ],
  });
  res.send(stations);
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
  const { name, ipaddress } = req.body;
console.info(ipaddress)
  const valid = ipaddress === 'self' ? true : validateStationParams(req.body);
  if (valid.error) {
    res.status(400).send(JSON.stringify({ error: valid.error }));
    return;
  }



  try {
    const result = await Station.create({ name, ip: ipaddress === 'self' ? '127.0.0.1' : ipaddress });
    console.info('new station added');
    res.status(200).send(JSON.stringify({ message: 'success' }));
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
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
    const result = await Station.update(
      {
        name: req.body.name,
        ip: req.body.ip,
      },
      {
        where: { id: req.body.id },
      },
    );
    console.info('station updated');
    res.status(200).send({ message: 'success' });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
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
  const { ipaddress } = req.body;

  if (!ipaddress) {
    res.status(400).send({ error: 'An IP must be provided' });
    return;
  }

  if (!(isIP(ipaddress) || ipaddress === 'self')) {
    res.status(400).send({ error: 'IP must be valid' });
    return;
  }

  let address = ipaddress
  if(address === 'self') {
    address = '127.0.0.1:3001'
  }

  fetch(`http://${address}/health`)
    .then(result => {
      res.send({ message: 'success' });
    })
    .catch(error => {
      res.send(error);
    });
});

export default router;
