module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('station', 'health', Sequelize.STRING),
      queryInterface.addColumn('sensor', 'health', Sequelize.STRING),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('station', 'health'),
      queryInterface.removeColumn('sensor', 'health'),
    ]);
  },
};
