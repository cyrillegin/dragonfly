const { Model, DataTypes } = require('sequelize');

function buildActionSchema(sequelize) {
  class Action extends Model {}
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

export default { buildActionSchema };
