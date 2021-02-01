module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([queryInterface.addColumn('sensors', 'poll_rate', Sequelize.DataTypes.STRING)]),

  down: async (queryInterface, Sequelize) =>
    Promise.all([queryInterface.removeColumn('sensors', 'poll_rate', Sequelize.DataTypes.STRING)]),
};
