require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

module.exports = sequelize;
