const { all_permissions } = require("../../helpers/users_roles_permissions");

const authorize = (req, res, next) => {
  const { token, permission } = req.body;

  if (!token) {
    return res.status(400).json({
      status: 400,
      error: "Token is required",
    });
  }

  if (permission && !all_permissions.includes(permission)) {
    return res.status(400).json({ status: 400, message: "invalid permission" });
  }

  next();
};

module.exports = authorize;
