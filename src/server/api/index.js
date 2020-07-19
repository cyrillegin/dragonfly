import { Router } from 'express';
import Station from './Station';
import Sensor from './Sensor';
import Reading from './Reading';
import Action from './Action';

const router = new Router();

router.use('/api/station', Station);
router.use('/api/sensor', Sensor);
router.use('/api/reading', Reading);
router.use('/api/action', Action);

module.exports = router;
