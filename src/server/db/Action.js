const { Model, DataTypes } = require('sequelize');

class Action extends Model {}

function buildActionSchema(sequelize) {
  Action.init(
    {
      sensorId: { type: DataTypes.UUID, allowNull: false },
      condition: { type: DataTypes.STRING, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      interval: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'action' },
  );
}

export { buildActionSchema, Action };
