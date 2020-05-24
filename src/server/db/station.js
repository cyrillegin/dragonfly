const { Model, DataTypes } = require('sequelize');

function buildStationSchema(sequelize) {
  class Station extends Model {}
  Station.init(
    {
      name: DataTypes.STRING,
    },
    { sequelize, modelName: 'station' },
  );
}

export default { buildStationSchema };
