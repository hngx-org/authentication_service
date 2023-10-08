require("dotenv").config();
const { Sequelize } = require("sequelize");
console.log(process.env.DATABASE_URL);
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

module.exports = sequelize;
