const Role = require('../models/Roles');
const User = require('../models/Users');
const {
  ResourceNotFound,
  Unauthorized,
  BadRequest,
  Conflict,
  Forbidden,
  ServerError,
} = require('../errors/httpErrors');
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
} = require('../errors/httpErrorCodes');
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
