import { Sequelize } from 'sequelize';
import { buildStationSchema, Station } from './Station';
import { buildSensorSchema, Sensor } from './Sensor';
import { buildReadingSchema, Reading } from './Reading';
import { buildActionSchema, Action } from './Action';
import { buildDashboardSchema, Dashboard } from './Dashboard';
import { buildDashboardGraphSchema, DashboardGraph } from './DashboardGraph';
import { buildDashboardSourceSchema, DashboardSource } from './DashboardSource';

const dbType = process.env.DATABASE_TYPE;
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbPort = process.env.DATABASE_PORT;
const dbHost = process.env.DATABASE_HOST;

const connectionString = `${dbType}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const setupDb = () => {
  const sequelize = new Sequelize(connectionString, { logging: false });

  buildStationSchema(sequelize);
  buildSensorSchema(sequelize);
  buildReadingSchema(sequelize);
  buildActionSchema(sequelize);
  buildDashboardSchema(sequelize);
  buildDashboardGraphSchema(sequelize);
  buildDashboardSourceSchema(sequelize);

  Station.hasMany(Sensor, { foreignKey: 'stationId', sourceKey: 'id' });
  Sensor.belongsTo(Station, { foreignKey: 'stationId', sourceKey: 'stationId' });

  Sensor.hasMany(Action, { foreignKey: 'sensorId', sourceKey: 'id' });
  Action.belongsTo(Sensor, { foreignKey: 'sensorId', sourceKey: 'sensorId' });

  Sensor.hasMany(Reading, { foreignKey: 'sensorId', sourceKey: 'id' });
  Reading.belongsTo(Sensor, { foreignKey: 'sensorId', sourceKey: 'sensorId' });

  Station.hasMany(Reading, { foreignKey: 'stationId', sourceKey: 'id' });
  Reading.belongsTo(Station, { foreignKey: 'stationId', sourceKey: 'stationId' });

  Station.hasMany(Action, { foreignKey: 'stationId', sourceKey: 'id' });
  Action.belongsTo(Station, { foreignKey: 'stationId', sourceKey: 'stationId' });

  Dashboard.hasMany(DashboardGraph, { foreignKey: 'dashboardId', sourceKey: 'id' });
  DashboardGraph.belongsTo(Dashboard, { foreignKey: 'dashboardId', sourceKey: 'dashboardId' });

  DashboardGraph.hasMany(DashboardSource, { foreignKey: 'dashboardGraphId', sourceKey: 'id' });
  DashboardSource.belongsTo(DashboardGraph, {
    foreignKey: 'dashboardGraphId',
    sourceKey: 'dashboardGraphId',
  });

  DashboardSource.hasOne(Sensor, { foreignKey: 'id', sourceKey: 'sensorId' });
  Sensor.belongsTo(DashboardSource, { foreignKey: 'id', sourceKey: 'id' });

  sequelize.sync();
};

export { Sensor, Action, Reading, Station, Dashboard, DashboardGraph, DashboardSource, setupDb };
