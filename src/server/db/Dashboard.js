import { Model, DataTypes } from 'sequelize';

class Dashboard extends Model {}

function buildDashboardSchema(sequelize) {
  Dashboard.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'dashboard',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { buildDashboardSchema, Dashboard };
