const checkEmail = require('./checkEmail');
const createUser = require('./createUser');

const AuthController = {
  checkEmail,
  createUser,
};

module.exports = AuthController;
