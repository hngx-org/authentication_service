require("dotenv").config();
const { Sequelize } = require("sequelize");
console.log(process.env.DATABASE_URL);
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "hng",
  password: "hngninja",
  database: "hng_auth",
});

module.exports = sequelize;
