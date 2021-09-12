module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('stations', 'last_health_timestamp', Sequelize.DATE),
      queryInterface.addColumn('sensors', 'last_health_timestamp', Sequelize.DATE),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('stations', 'last_health_timestamp'),
      queryInterface.removeColumn('sensors', 'last_health_timestamp'),
    ]);
  },
};
