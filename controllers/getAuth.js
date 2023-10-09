const { response } = require('express');
const {
  getUserPermissions,
  getRoleByUserId,
} = require('./helpers/rolesandpermissions');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.getAuth = async (req, res) => {
  const { token } = req.body;
  const { role, permission } = req.query;

  let response = { status: 401, msg: 'Unauthorized' };
  let id;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (!err) {
        return res.json(response);
      }
      id = decoded.id;
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
      const userRole = await getRoleByUserId(id);
      if (userRole && userRole === role)
        response = {
          status: 200,
          msg: 'authorized',
          id,
        };
    }
  }
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
