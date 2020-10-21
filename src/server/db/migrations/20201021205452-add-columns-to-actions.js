module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('actions', 'value', Sequelize.DataTypes.STRING),
      queryInterface.addColumn('actions', 'metaData', Sequelize.DataTypes.STRING),
    ]),
  down: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('actions', 'value'),
      queryInterface.removeColumn('actions', 'metaData'),
    ]),
};
