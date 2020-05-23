const {Router} = require('express');

const router = new Router();

router.post('/', async (req, res) => {
  console.log('post station')
});


module.exports = router;
