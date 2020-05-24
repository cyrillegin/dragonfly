const { Model, DataTypes } = require('sequelize');

function buildReadingSchema(sequelize) {
  class Reading extends Model {}
  Reading.init(
    {
      name: DataTypes.STRING,
    },
    { sequelize, modelName: 'reading' },
  );
}

export default { buildReadingSchema };
