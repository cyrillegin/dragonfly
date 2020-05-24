import { Router } from 'express';
import Station from './Station';
import Sensor from './Sensor';
import Reading from './Reading';
import Action from './Action';

const router = new Router();

router.use('/api/stations', Station);
router.use('/api/sensors', Sensor);
router.use('/api/readings', Reading);
router.use('/api/actions', Action);

module.exports = router;
