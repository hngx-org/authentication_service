const AuthenticationValidator = {};

AuthenticationValidator.signup = require('./signup');
AuthenticationValidator.login = require('./login');

module.exports = AuthenticationValidator;
