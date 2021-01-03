import { Model, DataTypes } from 'sequelize';

class Dashboard extends Model {}

function buildDashboardSchema(sequelize) {
  Dashboard.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      dashboardId: { type: DataTypes.STRING, allowNull: false, field: 'dashboard_id' },
      sensorId: { type: DataTypes.INTEGER, allowNull: false, field: 'sensor_id' },
      station_Id: { type: DataTypes.INTEGER, allowNull: false, field: 'station_id' },
      position: { type: DataTypes.INTEGER, allowNull: false },
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
