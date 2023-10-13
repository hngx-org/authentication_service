const checkEmail = require('./checkEmail');
const createUser = require('./createUser');
const verifyUser = require('./verifyUser');
const resendVerification = require('./resendVerification');
const login = require('./login');
const enable2fa = require('./enable2fa');
const send2faCode = require('./send2faCode');
const verify2fa = require('./verify2fa');

const AuthenticationController = {
  checkEmail,
  createUser,
  enable2fa,
  send2faCode,
  verify2fa,
  verifyUser,
  resendVerification,
  login,
};

module.exports = AuthenticationController;
