const { Router } = require('express');

const router = new Router();

router.get('/', async (req, res) => {
  console.info('get station');
  res.sendStatus(200);
});

router.post('/', async (req, res) => {
  console.info('post station');
  res.sendStatus(200);
});

router.put('/', async (req, res) => {
  console.info('put station');
  res.sendStatus(200);
});

router.delete('/', async (req, res) => {
  console.info('delete station');
  res.sendStatus(200);
});

export default router;
