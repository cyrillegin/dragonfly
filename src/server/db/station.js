const { Sequelize, Model, DataTypes } = require('sequelize');

function buildSchema(sequelize) {
  class Station extends Model {}
  Station.init(
    {
      name: DataTypes.STRING,
    },
    { sequelize, modelName: 'station' },
  );
}

export default { buildSchema };
