module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('actions', 'deleted_at', Sequelize.DATE),
      queryInterface.addColumn('dashboards', 'deleted_at', Sequelize.DATE),
      queryInterface.addColumn('readings', 'deleted_at', Sequelize.DATE),
      queryInterface.addColumn('sensors', 'deleted_at', Sequelize.DATE),
      queryInterface.addColumn('stations', 'deleted_at', Sequelize.DATE),
    ]),
  down: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('actions', 'deleted_at'),
      queryInterface.removeColumn('dashboards', 'deleted_at'),
      queryInterface.removeColumn('readings', 'deleted_at'),
      queryInterface.removeColumn('sensors', 'deleted_at'),
      queryInterface.removeColumn('stations', 'deleted_at'),
    ]),
};
