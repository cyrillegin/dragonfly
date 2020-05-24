import { Router } from 'express';

const router = new Router();

router.get('/', async (req, res) => {
  console.info('get reading');
  res.sendStatus(200);
});

router.post('/', async (req, res) => {
  console.info('post reading');
  res.sendStatus(200);
});

export default router;
