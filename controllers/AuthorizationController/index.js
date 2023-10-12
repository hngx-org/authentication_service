const authorize = require('./authorize');
const permissions = require('./permissions');
const roles = require('./roles');

const AuthorizationController = {
	authorize,
	permissions,
	roles
};

module.exports = AuthorizationController
