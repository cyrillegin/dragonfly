module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('sensors', 'poll_rate', Sequelize.dataTypes.STRING),

  down: async (queryInterface, Sequelize) =>
    queryInterface.removeColumn('sensors', 'poll_rate', Sequelize.dataTypes.STRING),
};
