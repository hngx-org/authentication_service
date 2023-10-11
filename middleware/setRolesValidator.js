const Role = require('../models/Roles');
const User = require('../models/Users');

/**
 * Controller set up for changing user roles
 */
const roleNames = ['Registered User', 'Super Admin'];
const roleIds = [2, 3];

module.exports.setRoleValidator = async (req, res, next) => {
  const { roleId, roleName } = req.body;
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      msg: "there must be a 'userId' and either 'roleId' or 'roleName'",
    });
  if (!roleId && !roleName)
    return res.status(400).json({
      msg: "please specify either 'roleId' or 'roleName'",
    });
  if (roleId && !roleIds.includes(roleId))
    return res.status(400).json({
      msg: 'roleId is invalid',
    });
  if (roleName && !roleNames.includes(roleName))
    return res.status(400).json({
      msg: 'roleName is invalid',
    });
  const user = await User.findByPk(id);
  if (!user)
    return res.status(404).json({
      msg: 'user not found',
    });
  req.roleChangeUser = user;
  next();
};
