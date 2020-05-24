import { Router } from 'express';

const router = new Router();

/**
 * POST
 * Creates a new action
 *
 * params: {
 *   condition: 'if value > 5',
 *   action: 'send slack',
 *   interval: '5d',
 *   stationId: 1,
 *   sensorId: 1
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.post('/', async (req, res) => {
  console.info('POST request to action');
  const { stationId, sensorId, condition, action, interval } = req.body;

  const valid = validateActionParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    const result = await Action.create({ stationId, sensorId, condition, action, interval });
    console.info('new action added');
    res.status(200).send({ message: 'success' });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

/**
 * DELETE
 * Deletes an existing action
 *
 * kwargs: id=stationId (int)
 *
 * returns: 200 - success
 *          400 if id isn't given
 */
router.delete('/', async (req, res) => {
  console.info('DELETE request to action');
  if (!req.query.id) {
    res
      .status(400)
      .send({ error: 'You must provide the id of the action you would like to delete' });
    return;
  }
  try {

    const actions = await Action.destroy({
      where: {id: req.query.id}
    })

    res.status(200).send({ message: `success`, actions });
  } catch (e) {
    console.error('an error occured!');
    console.error(e);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

const validateActionParams = params => {
  if(!params.stationId) {
    return { error: 'Station id required };
  }
  if(!params.sensorId) {
    return { error: 'Sensor id required };
  }
  if(!params.condition) {
    return { error: 'Condition required };
  }
  if(!params.action) {
    return { error: 'Action required };
  }
  if(!params.interval) {
    return { error: 'Interval required };
  }
  return {}
}

export default router;
