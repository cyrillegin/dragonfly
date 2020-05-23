import station from './station';

const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db', 'user', 'pass', {
  host: 'postgres',
  dialect: 'postgres',
});

station.buildSchema(sequelize);

sequelize.sync();
