require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: 'postgres',
  password: 'iamme123',
  database: 'hngxdev',
  host: '127.0.0.1',
  dialect: 'postgres',
});

module.exports = sequelize;
