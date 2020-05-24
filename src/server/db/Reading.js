const { Model, DataTypes } = require('sequelize');

function buildReadingSchema(sequelize) {
  class Reading extends Model {}
  Reading.init(
    {
      sensor_id: { type: DataTypes.UUID, allowNull: false },
      value: { type: DataTypes.DOUBLE, allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: 'reading' },
  );
}

export default { buildReadingSchema };
