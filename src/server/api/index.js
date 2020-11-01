import { Router } from 'express';
import Station from './Station';
import Sensor from './Sensor';
import Reading from './Reading';
import Action from './Action';
import Dashboard from './Dashboard';

const router = new Router();

router.use('/api/station', Station);
router.use('/api/sensor', Sensor);
router.use('/api/reading', Reading);
router.use('/api/action', Action);
router.use('/api/dashboard', Dashboard);

module.exports = router;
