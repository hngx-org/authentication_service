require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    username: "hngx",
    password: "hngx#dev",
    database: "hngxdev",
    host: "104.248.143.148",
    dialect: "postgres",
  });

module.exports = sequelize;
