const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
const Permission = require('../../models/Permissions');
const Role = require('../../models/Roles');

/**
 * @desc Check if user is authorized to perform permission
 */
const authorize = (req, res) => {
  const { token, permission } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid token',
      });
    }
    const { id } = decoded;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['name'],
        },
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
          include: [{ model: Permission, attributes: ['name'] }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        authorized: false,
        message: 'No user found',
      });
    }

    if (user && !user.is_verified) {
      return res.status(401).json({
        status: 401,
        authorized: false,
        message: 'user is not verified',
      });
    }

    const userPermissions = user.permissions.map(
      (permission) => permission.name,
    );
    const rolePermissions = user.role.permissions.map(
      (permission) => permission.name,
    );

    const permissions = [...new Set([...userPermissions, ...rolePermissions])];

    if (user && !permission) {
      response = {
        status: 200,
        authorized: true,
        message: 'user is authenticated',
        user: {
          id,
          role: user.role.name,
          permissions,
        },
      };
      return res.status(200).json(response);
    }

    if (permission && permissions.includes(permission)) {
      response = {
        status: 200,
        authorized: true,
        message: 'user is authorized for this permission',
        user: {
          id,
          permissions,
          role: user.role.name,
        },
      };
      return res.status(200).json(response);
    }

    return res.status(401).json({
      status: 401,
      authorized: false,
      message: 'user is not authorized for this permission',
    });
  });
};

module.exports = authorize;
