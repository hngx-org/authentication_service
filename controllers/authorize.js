const { response } = require("express");
const {
  getUserPermissions,
  getRoleByUserId,
  getUserRoles,
  getUserRole,
} = require("./helpers/rolesandpermissions");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { log } = require("console");
const { permissions, roles } = require("../helpers/users_roles_permissions");
const User = require("../models/Users");
const Permission = require("../models/Permissions");
const Role = require("../models/Roles");

require("dotenv").config();

/**
 * @desc Check if user is authorized to perform action
 */
module.exports.authorize = async (req, res) => {
  let id;
  let response = {
    status: 401,
    authorized: false,
    message: "user is not authorized for this action",
  };

  const { token, action } = req.body;

  if (!token) {
    return res.status(401).json(response);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    id = decode.id;
  } catch (error) {
    return res.status(401).json(response);
  }

  const user = await User.findByPk(id, {
    include: [
      {
        model: Permission,
        as: "permissions",
        attributes: ["name"],
      },
      {
        model: Role,
        as: "role",
        include: [{ model: Permission, attributes: ["name"] }],
      },
    ],
  });

  if (user && !user.is_verified) {
    return res.status(401).json({
      status: 401,
      authorized: false,
      message: "user is not verified",
    });
  }

  const userPermissions = user.permissions.map((permission) => permission.name);
  const rolePermissions = user.role.permissions.map(
    (permission) => permission.name,
  );

  const permissions = [...new Set([...userPermissions, ...rolePermissions])];

  if (permissions.includes(action)) {
    response = {
      status: 200,
      authorized: true,
      message: "user is authorized for this action",
      data: {
        id,
        permissions,
      },
    };
    return res.status(200).json(response);
  }

  return res.status(401).json(response);
};

module.exports.getAuthPermissions = async (req, res) => {
  const { token } = req.body;
  let response = { status: 401, msg: "Unauthorized" };
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
        msg: "Unauthorized",
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
