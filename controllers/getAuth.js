const { response } = require('express');
const {
  getUserPermissions,
  getRoleByUserId,
  getUserRoles,
  getUserRole,
} = require('./helpers/rolesandpermissions');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { log } = require('console');
const { permissions, roles } = require('../helpers/users_roles_permissions');
const User = require('../models/Users');

require('dotenv').config();

module.exports.getAuth = async (req, res) => {
  const { token, role, permission } = req.body;

  let response = { status: 401, msg: 'Unauthorized' };
  let id;
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      id = decode.id;
    } catch (error) {
      console.log(error);
      return res.json(response);
    }
    const user = await User.findByPk(id);
    if (user && !user.is_verified)
      return res.json({
        status: 401,
        msg: 'Unauthorized',
        unverifiedUser: true,
      });
    if (permission) {
      const userPermissions = await getUserPermissions(id);
      if (userPermissions.includes(permission))
        response = {
          status: 200,
          msg: 'authorized',
          id,
        };
    } else if (role) {
      const userRole = await getUserRole(id);
      if (userRole && userRole === role)
        response = {
          status: 200,
          msg: 'authorized',
          id,
        };
    } else response = { status: 200, id };
  }

  res.json(response);
};

module.exports.getAuthPermissions = async (req, res) => {
  const { token } = req.body;
  let response = { status: 401, msg: 'Unauthorized' };
  let id;
  if (token) {
    // validate token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      id = decode.id;
    } catch (error) {
      return res.json(response);
    }
    const user = await User.findByPk(id);
    if (user && !user.is_verified)
      return res.json({
        status: 401,
        msg: 'Unauthorized',
        unverifiedUser: true,
      });
    const userPermissions = await getUserPermissions(id);
    if (userPermissions && userPermissions[0])
      response = { status: 200, permissions: userPermissions };
  }
  res.json(response);
};

module.exports.sendPermissionsAndRows = (req, res) => {
  res.json({ availableRoles: roles, availablePermissions: permissions });
};
