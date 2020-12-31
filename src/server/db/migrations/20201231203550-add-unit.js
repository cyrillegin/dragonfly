module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('sensors', 'unit', Sequelize.DataTypes.STRING),

  down: async (queryInterface, Sequelize) =>
    queryInterface.removeColumn('sensors', 'unit', Sequelize.DataTypes.STRING),
};
