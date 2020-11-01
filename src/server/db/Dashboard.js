import { Model, DataTypes } from 'sequelize';

class Dashboard extends Model {}

function buildDashboardSchema(sequelize) {
  Dashboard.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      dashboard_id: { type: DataTypes.STRING, allowNull: false },
      sensor_id: { type: DataTypes.INTEGER, allowNull: false },
      station_id: { type: DataTypes.INTEGER, allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'dashboard' },
  );
}

export { buildDashboardSchema, Dashboard };
