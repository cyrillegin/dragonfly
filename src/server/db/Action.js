const { Model, DataTypes } = require('sequelize');

class Action extends Model {}

function buildActionSchema(sequelize) {
  Action.init(
    {
      stationId: { type: DataTypes.INTEGER, allowNull: false, field: 'station_id' },
      sensorId: { type: DataTypes.INTEGER, allowNull: false, field: 'sensor_id' },
      condition: { type: DataTypes.STRING, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
      metadata: { type: DataTypes.STRING },
      interval: { type: DataTypes.STRING, allowNull: false },
      // Can be one of: 'value', 'timestamp', 'time'
      valueType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'value',
        field: 'value_type',
      },
    },
    {
      sequelize,
      modelName: 'action',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { buildActionSchema, Action };
