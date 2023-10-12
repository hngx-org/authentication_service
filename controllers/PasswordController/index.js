const send = require('./send');
const verifyPasswwordResetToken = require('./verify');
const reset = require('./reset');

const PasswordController = {
  reset,
  send,
  verifyPasswwordResetToken,
};

module.exports = PasswordController;
