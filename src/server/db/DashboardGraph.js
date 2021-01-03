import { Model, DataTypes } from 'sequelize';

class DashboardGraph extends Model {}

function buildDashboardGraphSchema(sequelize) {
  DashboardGraph.init(
    {
      dashboardId: { type: DataTypes.INTEGER, allowNull: false, field: 'dashboard_id' },
      width: { type: DataTypes.STRING, allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'dashboard_graph',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { buildDashboardGraphSchema, DashboardGraph };
