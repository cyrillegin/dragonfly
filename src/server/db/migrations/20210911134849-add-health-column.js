module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('stations', 'health', Sequelize.STRING),
      queryInterface.addColumn('sensors', 'health', Sequelize.STRING),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('stations', 'health'),
      queryInterface.removeColumn('sensors', 'health'),
    ]);
  },
};
