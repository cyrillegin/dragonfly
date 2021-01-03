module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([queryInterface.addColumn('sensors', 'unit', Sequelize.DataTypes.STRING)]),

  down: async (queryInterface, Sequelize) =>
    Promise.all([queryInterface.removeColumn('sensors', 'unit', Sequelize.DataTypes.STRING)]),
};
