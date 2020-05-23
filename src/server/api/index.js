const express = require('express');

const {Router} = express;
const router = new Router();

const station = require('./station');
const sensor = require('./sensor');

router.use('/api/stations', station);
router.use('/api/sensors', sensor);

module.exports = router;
