import { Model, DataTypes } from 'sequelize';

class Dashboard extends Model {}

function buildDashboardSchema(sequelize) {
  Dashboard.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'dashboard' },
  );
}

export { buildDashboardSchema, Dashboard };
