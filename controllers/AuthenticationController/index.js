const checkEmail = require('./checkEmail');
const createUser = require('./createUser');
const createGuest = require('./createGuest');
const verifyUser = require('./verifyUser');
const resendVerification = require('./resendVerification');
const login = require('./login');
const enable2fa = require('./enable2fa');
const send2faCode = require('./send2faCode');
const verify2fa = require('./verify2fa');
const authFacebook = require('./authFacebook');
const authGithub = require('./authGithub');
const authGoogle = require('./authGoogle');

const AuthenticationController = {
  checkEmail,
  createUser,
  createGuest,
  enable2fa,
  send2faCode,
  verify2fa,
  verifyUser,
  resendVerification,
  login,
  authFacebook,
  authGithub,
  authGoogle
};

module.exports = AuthenticationController;
