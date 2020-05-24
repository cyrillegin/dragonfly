import { Sequelize } from 'sequelize';
import { buildStationSchema } from './Station';
import { buildSensorSchema } from './Sensor';
import { buildReadingSchema } from './Reading';
import { buildActionSchema } from './Action';

const dbType = process.env.DATABASE_TYPE;
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbPort = process.env.DATABASE_PORT;
const dbHost = process.env.DATABASE_HOST;

const connectionString = `${dbType}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const sequelize = new Sequelize(connectionString);

buildStationSchema(sequelize);
buildSensorSchema(sequelize);
buildReadingSchema(sequelize);
buildActionSchema(sequelize);

sequelize.sync();
