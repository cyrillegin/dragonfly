import { Router } from 'express';
import { Dashboard, DashboardGraph, DashboardSource } from '../db';
import { validateDashboardParams } from '../utilities/Validators';

const router = new Router();

/**
 * GET
 * Gets an array of dashboards
 *
 * returns {
 *   dashboards: [{
 *     id: 123,
 *     name: 'asdf',
 *     dashboardGraph: [{
 *       dashboardId: 123,
 *       id: 123,
 *       width: 123,
 *       position: 123,
 *       type: 'asdf',
 *       title: 'asdf'
 *    }],
 *  }]
 * }
 */
router.get('/', async (req, res) => {
  console.debug('GET request to dashboard');
  const dashboards = await Dashboard.findAll({
    include: [
      {
        model: DashboardGraph,
        include: [DashboardSource],
      },
    ],
  });

  res.send(dashboards);
});

/**
 * POST
 * Creates a new dashboard
 *
 * params: {
 *   name: 'station name'
 * }
 *
 * returns: 200 success, 400 if validation fails
 */
router.post('/', async (req, res) => {
  console.debug('POST request to dashboard');
  const { name } = req.body;

  const valid = validateDashboardParams(req.body);
  if (valid.error) {
    res.status(400).send({ error: valid.error });
    return;
  }

  try {
    Dashboard.create({ name });
    console.debug('new dashboard created.');
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('an error occured!');
    console.error(error);
    res.status(400).send({ error: 'An unknown error has occured' });
  }
});

export default router;
