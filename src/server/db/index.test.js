import { buildStationSchema, Station } from './Station';
import { buildSensorSchema, Sensor } from './Sensor';
import { buildReadingSchema, Reading } from './Reading';
import { buildActionSchema, Action } from './Action';
import { buildDashboardSchema, Dashboard } from './Dashboard';

jest.mock('sequelize');

describe('database', () => {
  it('should take a snapshot of the schema', () => {
    const takeSnap = schema => {
      expect(Object.keys(schema)).toMatchSnapshot();
    };
    Station.init = takeSnap;
    Sensor.init = takeSnap;
    Reading.init = takeSnap;
    Action.init = takeSnap;
    Dashboard.init = takeSnap;
    buildStationSchema();
    buildSensorSchema();
    buildReadingSchema();
    buildActionSchema();
    buildDashboardSchema();
  });
});
