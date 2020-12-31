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
      hardwareType: { type: DataTypes.STRING, allowNull: false },
      readingType: { type: DataTypes.STRING, allowNull: true },
      poll_rate: { type: DataTypes.STRING, allowNull: true },
      unit: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, modelName: 'sensor' },
  );
}

export { Sensor, buildSensorSchema };
