import { Model, DataTypes } from 'sequelize';

class DashboardSource extends Model {}

function buildDashboardSourceSchema(sequelize) {
  DashboardSource.init(
    {
      dashboardGraphId: { type: DataTypes.INTEGER, allowNull: false, field: 'dashboard_graph_id' },
      sensorId: { type: DataTypes.INTEGER, allowNull: false, field: 'sensor_id' },
    },
    {
      sequelize,
      modelName: 'dashboard_source',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { buildDashboardSourceSchema, DashboardSource };
