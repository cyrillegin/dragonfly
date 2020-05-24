import { Model, DataTypes } from 'sequelize';
import SENSOR_TYPES from '../constants';

class Sensor extends Model {}

function buildSensorSchema(sequelize) {
  Sensor.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      station_id: { type: DataTypes.UUID, allowNull: false },
      coefficients: { type: DataTypes.STRING, allowNull: true },
      dexcription: { type: DataTypes.STRING, allowNull: true },
      on: { type: DataTypes.BOOLEAN, allowNull: true },
      type: { type: DataTypes.ENUM, values: SENSOR_TYPES, allowNull: false },
    },
    { sequelize, modelName: 'sensor' },
  );
}

export { Sensor, buildSensorSchema };
