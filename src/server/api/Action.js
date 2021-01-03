import { Router } from 'express';
import { Action } from '../db';
import { validateActionParams } from '../utilities/Validators';

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

  const { stationId, sensorId, condition, action, interval, value, valueType } = req.body;

  const valid = validateActionParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    await Action.create({
      stationId,
      sensorId,
      condition,
      action,
      interval,
      value,
      value_type: valueType,
    });
    console.info('new action added');
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

/**
 * PUT
 * Updates an exisiting action
 *
 * params: {
 *   id: 1
 *   condition: 'if value > 5',
 *   action: 'send slack',
 *   interval: '5d',
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.put('/', async (req, res) => {
  console.info('PUT request to action');

  const { id, condition, action, interval, value, valueType, metaData } = req.body;

  const valid = validateActionParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    await Action.update(
      { condition, action, interval, value, valueType, metaData },
      { where: { id } },
    );
    console.info('action updated');
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
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
router.delete('/:id', async (req, res) => {
  console.info('DELETE request to action');

  if (!req.params.id) {
    res
      .status(400)
      .send({ error: 'You must provide the id of the action you would like to delete' });
    return;
  }
  try {
    const actions = await Action.destroy({
      where: { id: req.params.id },
    });

    res.status(200).send({ message: 'success', actions });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

export default router;
