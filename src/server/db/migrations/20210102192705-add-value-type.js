module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('actions', 'value_type', Sequelize.DataTypes.STRING),

  down: async (queryInterface, Sequelize) =>
    queryInterface.removeColumn('actions', 'value_type', Sequelize.DataTypes.STRING),
};
