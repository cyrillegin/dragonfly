const { Model, DataTypes } = require('sequelize');

class Action extends Model {}

function buildActionSchema(sequelize) {
  Action.init(
    {
      stationId: { type: DataTypes.INTEGER, allowNull: false },
      sensorId: { type: DataTypes.INTEGER, allowNull: false },
      condition: { type: DataTypes.STRING, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
      metaData: { type: DataTypes.STRING },
      interval: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'action' },
  );
}

export { buildActionSchema, Action };
