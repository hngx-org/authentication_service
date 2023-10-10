const Role = require('../models/Roles');
const User = require('../models/Users');

/**
 * Controller set up for changing user roles
 */
const roleNames = ['Registered User', 'Super Admin'];
const roleIds = [2, 3];

module.exports.setRole = async (req, res) => {
  const { id, roleId, roleName } = req.body;

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
  if (roleId) {
    user.role_id = roleId;
    await user.save();
    return res
      .status(200)
      .json({ msg: "user's role was changed successfully" });
  }
  if (roleName) {
    const role = await Role.findOne({ where: { name: roleName } });
    user.role_id = role.id;
    await user.save();
    return res
      .status(200)
      .json({ msg: "user's role was changed successfully" });
  }
};
