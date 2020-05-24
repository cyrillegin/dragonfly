const { Model, DataTypes } = require('sequelize');

function buildStationSchema(sequelize) {
  class Station extends Model {}
  Station.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      ip: { type: DataTypes.INET, allowNull: false },
    },
    { sequelize, modelName: 'station' },
  );
}

export default { buildStationSchema };
