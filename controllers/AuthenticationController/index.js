const checkEmail = require("./checkEmail");
const createUser = require("./createUser");
const verifyUser = require("./verifyUser");
const resendVerification = require("./resendVerification");
const login = require("./login");

const AuthenticationController = {
  checkEmail,
  createUser,
  verifyUser,
  resendVerification,
  login,
};

module.exports = AuthenticationController;
