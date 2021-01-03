const { Model, DataTypes } = require('sequelize');

class Reading extends Model {}

function buildReadingSchema(sequelize) {
  Reading.init(
    {
      sensorId: { type: DataTypes.INTEGER, allowNull: false, field: 'sensor_id' },
      stationId: { type: DataTypes.INTEGER, allowNull: false, field: 'station_id' },
      value: { type: DataTypes.DOUBLE, allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: 'reading',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { buildReadingSchema, Reading };
