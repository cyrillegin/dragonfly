import { Model, DataTypes } from 'sequelize';

class Station extends Model {}

function buildStationSchema(sequelize) {
  Station.init(
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      port: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'station' },
  );
}

export { buildStationSchema, Station };
