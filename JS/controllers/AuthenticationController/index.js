const checkEmail = require('./checkEmail');
const changeEmail = require('./changeEmail');
const createUser = require('./createUser');
const createGuest = require('./createGuest');
const verifyUser = require('./verifyUser');
const resendVerification = require('./resendVerification');
const login = require('./login');
const enable2fa = require('./enable2fa');
const send2faCode = require('./send2faCode');
const verify2fa = require('./verify2fa');
const disable2fa = require('./disable2fa');
const loginResponse = require('../../middleware/loginResponse');
const setIsSeller = require('./setIsSeller');

const AuthenticationController = {
  checkEmail,
  changeEmail,
  createUser,
  createGuest,
  loginResponse,
  enable2fa,
  disable2fa,
  send2faCode,
  verify2fa,
  verifyUser,
  resendVerification,
  login,
  setIsSeller,
};

module.exports = AuthenticationController;
