const { Sequelize } = require('sequelize');
require('dotenv').config();

module.exports.sequelize = new Sequelize(
  'postgres://postgres:iamme123@127.0.0.1:5432/hng_dev'
);
