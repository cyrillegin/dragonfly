import { Sequelize } from 'sequelize';
import Station from './Station';
import Sensor from './Sensor';
import Reading from './Reading';
import Action from './Action';

const dbType = process.env.DATABASE_TYPE;
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbPort = process.env.DATABASE_PORT;

const connectionString = `${dbType}://${dbUser}:${dbPassword}@example.com:${dbPort}/${dbName}`;

const sequelize = new Sequelize(connectionString);

Station.buildStationSchema(sequelize);
Sensor.buildSensorSchema(sequelize);
Reading.buildReadingSchema(sequelize);
Action.buildActionSchema(sequelize);

sequelize.sync();
