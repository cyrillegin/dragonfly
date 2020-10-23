module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('sensors', 'hardwareType', Sequelize.DataTypes.STRING),
      queryInterface.addColumn('sensors', 'readingType', Sequelize.DataTypes.STRING),
    ]),

  down: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('sensors', 'hardwareType'),
      queryInterface.removeColumn('sensors', 'readingType'),
    ]),
};
