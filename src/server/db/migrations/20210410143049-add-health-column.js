module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('station', 'last_health_timestamp', Sequelize.DATE),
      queryInterface.addColumn('sensor', 'last_health_timestamp', Sequelize.DATE),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('station', 'last_health_timestamp'),
      queryInterface.removeColumn('sensor', 'last_health_timestamp'),
    ]);
  },
};
