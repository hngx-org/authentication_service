const Role = require('../models/Roles');
const User = require('../models/Users');

/**
 * Controller set up for changing user roles
 */
const roleNames = ['Registered User', 'Super Admin'];
const roleIds = [2, 3];

module.exports.setRole = async (req, res) => {
  const { roleId, roleName } = req.body;
  const user = req.roleChangeUser;
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
