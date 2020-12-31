import { Sequelize } from 'sequelize';
import { buildStationSchema, Station } from './Station';
import { buildSensorSchema, Sensor } from './Sensor';
import { buildReadingSchema, Reading } from './Reading';
import { buildActionSchema, Action } from './Action';
import { buildDashboardSchema, Dashboard } from './Dashboard';

const dbType = process.env.DATABASE_TYPE;
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbPort = process.env.DATABASE_PORT;
const dbHost = process.env.DATABASE_HOST;

const connectionString = `${dbType}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const sequelize = new Sequelize(connectionString, { logging: false });

const addRelationships = async () => {
  await Station.hasMany(Sensor, { foreignKey: 'stationId', sourceKey: 'id' });
  await Sensor.belongsTo(Station, { foreignKey: 'stationId', sourceKey: 'stationId' });

  await Sensor.hasMany(Action, { foreignKey: 'sensorId', sourceKey: 'id' });
  await Action.belongsTo(Sensor, { foreignKey: 'sensorId', sourceKey: 'sensorId' });

  await Sensor.hasMany(Reading, { foreignKey: 'sensorId', sourceKey: 'id' });
  await Reading.belongsTo(Sensor, { foreignKey: 'sensorId', sourceKey: 'sensorId' });

  await Station.hasMany(Reading, { foreignKey: 'stationId', sourceKey: 'id' });
  await Reading.belongsTo(Station, { foreignKey: 'stationId', sourceKey: 'stationId' });

  await Station.hasMany(Action, { foreignKey: 'stationId', sourceKey: 'id' });
  await Action.belongsTo(Station, { foreignKey: 'stationId', sourceKey: 'stationId' });

  await Dashboard.hasMany(Sensor, { foreignKey: 'id', sourceKey: 'sensor_id' });

  sequelize.sync();
};

const buildSchema = async () => {
  await buildStationSchema(sequelize);
  await buildSensorSchema(sequelize);
  await buildReadingSchema(sequelize);
  await buildActionSchema(sequelize);
  await buildDashboardSchema(sequelize);

  sequelize.sync();

  return setTimeout(() => {
    addRelationships();
  });
};

export { Sensor, Action, Reading, Station, Dashboard, buildSchema };
