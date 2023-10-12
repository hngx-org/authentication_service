const checkEmail = require("./checkEmail");
const createUser = require("./createUser");
const verifyUser = require("./verifyUser");

const AuthController = {
  checkEmail,
  createUser,
  verifyUser,
};

module.exports = AuthController;
