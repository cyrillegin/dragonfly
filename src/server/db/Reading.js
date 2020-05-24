const { Model, DataTypes } = require('sequelize');

class Reading extends Model {}

function buildReadingSchema(sequelize) {
  Reading.init(
    {
      sensor_id: { type: DataTypes.UUID, allowNull: false },
      value: { type: DataTypes.DOUBLE, allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: 'reading' },
  );
}

export { buildReadingSchema, Reading };
