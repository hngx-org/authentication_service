require("dotenv").config();

const {
  getUserPermissions,
  getRoleByUserId,
  getUserRoles,
  getUserRole,
} = require("./helpers/rolesandpermissions");

const {
  permissions,
  roles,
  all_permissions,
} = require("../helpers/users_roles_permissions");

const {
  ResourceNotFound,
  Unauthorized,
  BadRequest,
  Conflict,
  Forbidden,
  ServerError,
} = require("../errors/httpErrors");

const {
  RESOURCE_NOT_FOUND,
  ACCESS_DENIED,
  INVALID_TOKEN,
  MISSING_REQUIRED_FIELD,
  INVALID_REQUEST_PARAMETERS,
  EXISTING_USER_EMAIL,
  EXPIRED_TOKEN,
  CONFLICT_ERROR_CODE,
  THIRD_PARTY_API_FAILURE,
} = require("../errors/httpErrorCodes");

const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Permission = require("../models/Permissions");
const Role = require("../models/Roles");

/**
 * @desc Check if user is authorized to perform permission
 */
module.exports.authorize = async (req, res) => {
  let id;
  let response = {
    status: 401,
    authorized: false,
    message: "user is not authorized for this permission",
  };

  const { token, permission } = req.body;

  if (!token) {
    return res.status(401).json(response);
  }

  if (permission && !all_permissions.includes(permission)) {
    return res.status(400).json({ status: 400, message: "invalid permission" });
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

  if (user && !permission) {
    response = {
      status: 200,
      authorized: true,
      message: "user is authorized",
      user: {
        id,
      },
    };
    return res.status(200).json(response);
  }

  const userPermissions = user.permissions.map((permission) => permission.name);
  const rolePermissions = user.role.permissions.map(
    (permission) => permission.name,
  );

  const permissions = [...new Set([...userPermissions, ...rolePermissions])];

  if (permission && permissions.includes(permission)) {
    response = {
      status: 200,
      authorized: true,
      message: "user is authorized for this permission",
      data: {
        id,
        permissions,
      },
    };
    return res.status(200).json(response);
  } else if (!permission) {
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
