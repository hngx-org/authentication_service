const { response } = require('express');
const {
  getUserPermissions,
  getRoleByUserId,
  getUserRoles,
} = require('./helpers/rolesandpermissions');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { log } = require('console');

require('dotenv').config();

module.exports.getAuth = async (req, res) => {
  const { token } = req.body;
  const { role, permission } = req.query;

  let response = { status: 401, msg: 'Unauthorized' };
  let id;
  if (token) {
    const verify = promisify(jwt.verify);
    try {
      const decode = await verify(token, process.env.JWT_SECRET);
      log(decode);
      id = decode.id;
    } catch (error) {
      return res.json(response);
    }

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
    }
  } else response = { status: 200, id };

  res.json(response);
};

module.exports.getAuthPermissions = async () => {
  const { token } = req.body;
  let response = { status: 401, msg: 'Unauthorized' };
  let id;
  if (token) {
    // validate token
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (!err) {
        return res.json(response);
      }
      id = decoded.id;
    });
    const userPermissions = await getUserPermissions(id);
    if (userPermissions && userPermissions[0])
      response = { status: 200, userPermissions };
  }
  res.json(response);
};
