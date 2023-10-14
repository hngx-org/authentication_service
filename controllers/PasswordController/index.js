const send = require('./send');
const reset = require('./reset');

const PasswordController = {
  reset,
  send,
};

module.exports = PasswordController;
