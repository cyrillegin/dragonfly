module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([queryInterface.addColumn('actions', 'value_type', Sequelize.DataTypes.STRING)]),
  down: async (queryInterface, Sequelize) =>
    Promise.all([queryInterface.removeColumn('actions', 'value_type', Sequelize.DataTypes.STRING)]),
};
