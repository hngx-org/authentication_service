// routes/userPermissions.js
const User = require('../models/Users');
const Permission = require('../models/Permissions');
const UserPermissions = require('../models/UserPermissions');
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

// Endpoint to add a permission to a user
module.exports.addPermission = async (req, res) => {
  const { userId, permissionId } = req.body;

  try {
    // Check if the user and permission exist
    const user = await User.findByPk(userId);

    const permission = await Permission.findByPk(permissionId);

    if (!user || !permission) {
      return res.status(404).json({ error: 'User or permission not found.' });
    }
    // return res.json({user,permission})
    // Add the permission to the user
    await user.addPermission(permission);
    // // Create a new UserPermission record
    // await UserPermissions.create({
    //   user_id: user.id,
    //   permission_id: permission.id,
    // });

    res.status(200).json({ message: 'Permission added successfully.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Internal server error.', message: error.message });
  }
};

// Endpoint to remove a permission from a user
module.exports.removePermission = async (req, res) => {
  const { userId, permissionId } = req.body;

  try {
    // Check if the user and permission exist
    const user = await User.findByPk(userId);
    const permission = await Permission.findByPk(permissionId);

    if (!user || !permission) {
      return res.status(404).json({ error: 'User or permission not found.' });
    }

    // Remove the permission from the user
    await user.removePermission(permission);
    // Remove the UserPermission record
    // await UserPermissions.destroy({
    //   where: {
    //     user_id: user.id,
    //     permission_id: permission.id,
    //   },
    // });

    res.status(200).json({ message: 'Permission removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
