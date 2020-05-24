import { Router } from 'express';

const router = new Router();

router.post('/', async (req, res) => {
  console.info('post action');
  res.sendStatus(200);
});

router.delete('/', async (req, res) => {
  console.info('delete action');
  res.sendStatus(200);
});

export default router;
