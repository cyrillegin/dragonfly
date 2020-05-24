const { Model, DataTypes } = require('sequelize');

function buildActionSchema(sequelize) {
  class Action extends Model {}
  Action.init(
    {
      name: DataTypes.STRING,
    },
    { sequelize, modelName: 'action' },
  );
}

export default { buildActionSchema };
