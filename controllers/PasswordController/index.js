const send = require('./send');
const change = require('./change');
const reset = require('./reset');

const PasswordController = {
  reset,
  send,
  change,
};

module.exports = PasswordController;
