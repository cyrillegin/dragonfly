module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('dashboards', 'dashboard_id'),
      queryInterface.removeColumn('dashboards', 'sensor_id'),
      queryInterface.removeColumn('dashboards', 'station_id'),
      queryInterface.removeColumn('dashboards', 'position'),
    ]),
  down: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('dashboards', 'dashboard_id', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('dashboards', 'sensor_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn('dashboards', 'station_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn('dashboards', 'position', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]),
};
