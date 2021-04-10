import { Model, DataTypes } from 'sequelize';

class Station extends Model {}

function buildStationSchema(sequelize) {
  Station.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      port: { type: DataTypes.STRING, allowNull: false },
      lastHealthTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'last_health_timestamp',
      },
    },
    {
      sequelize,
      modelName: 'station',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { buildStationSchema, Station };
