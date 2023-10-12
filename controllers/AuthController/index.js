const checkEmail = require("./checkEmail");
const createUser = require("./createUser");
const verifyUser = require("./verifyUser");
const resendVerification = require("./resendVerification");

const AuthController = {
  checkEmail,
  createUser,
  verifyUser,
  resendVerification,
};

module.exports = AuthController;
