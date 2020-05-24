const { Model, DataTypes } = require('sequelize');

function buildSensorSchema(sequelize) {
  class Sensor extends Model {}
  Sensor.init(
    {
      name: DataTypes.STRING,
    },
    { sequelize, modelName: 'sensor' },
  );
}

export default { buildSensorSchema };
