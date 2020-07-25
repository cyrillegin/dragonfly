import { Model, DataTypes } from 'sequelize';

class Sensor extends Model {}

function buildSensorSchema(sequelize) {
  Sensor.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false },
      coefficients: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
      hardwareName: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'sensor' },
  );
}

export { Sensor, buildSensorSchema };
