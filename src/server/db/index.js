import { Sequelize } from 'sequelize';
import Station from './Station';
import Sensor from './Sensor';
import Reading from './Reading';
import Action from './Action';

const sequelize = new Sequelize('db', 'user', 'pass', {
  host: 'postgres',
  dialect: 'postgres',
});

Station.buildStationSchema(sequelize);
Sensor.buildSensorSchema(sequelize);
Reading.buildReadingSchema(sequelize);
Action.buildActionSchema(sequelize);

sequelize.sync();
