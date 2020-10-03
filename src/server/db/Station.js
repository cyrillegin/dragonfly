import { Model, DataTypes } from 'sequelize';

class Station extends Model {}

function buildStationSchema(sequelize) {
  Station.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'station' },
  );
}

export { buildStationSchema, Station };
