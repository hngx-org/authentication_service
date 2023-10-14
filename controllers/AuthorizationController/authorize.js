const jwt = require('jsonwebtoken');
const sequelize = require('../../config/db');

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

    const [users] = await sequelize.query(
      `SELECT * FROM "user" WHERE id='${id}';`,
    );

    if (!users.length) {
      return res.status(404).json({
        status: 404,
        authorized: false,
        message: 'No user found',
      });
    }

    const user = users[0];

    const [roles] = await sequelize.query(
      `SELECT * FROM "role" WHERE id='${user.role_id}';`,
    );

    const role = roles[0];

    const [userPermissions] = await sequelize.query(
      `SELECT permission.name FROM "user_permission"
		INNER JOIN "permission" ON user_permission.permission_id = permission.id
		WHERE user_permission.user_id = '${id}';`,
    );

    const [rolePermissions] = await sequelize.query(
      `SELECT permission.name FROM "roles_permissions"
	 INNER JOIN "permission" ON roles_permissions.permission_id = permission.id 
	 WHERE roles_permissions.role_id = '${user.role_id}';`,
    );

    if (user && !user.is_verified) {
      return res.status(401).json({
        status: 401,
        authorized: false,
        message: 'user is not verified',
      });
    }

    const permissions = [
      ...new Set([
        ...userPermissions.map((permission) => permission.name),
        ...rolePermissions.map((permission) => permission.name),
      ]),
    ];

    console.log(permissions);

    if (user && !permission) {
      response = {
        status: 200,
        authorized: true,
        message: 'user is authenticated',
        user: {
          id,
          role: role.name,
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
          role: role.name,
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
