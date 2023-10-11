// routes/userPermissions.js
const User = require("../models/Users");
const Permission = require("../models/Permissions");
const UserPermissions = require("../models/UserPermissions");




// Endpoint to add a permission to a user
module.exports.addPermission = async (req, res) => {
  const { userId, permissionId } = req.body;

  try {
    // Check if the user and permission exist
    const user = await User.findByPk(userId);
   
    const permission = await Permission.findByPk(permissionId);
    
    if (!user || !permission) {
      return res.status(404).json({ error: "User or permission not found." });
    }
    // return res.json({user,permission})
    // Create a new UserPermission record
    await UserPermissions.create({
      user_id: user.id,
      permission_id: permission.id,
    });

    res.status(200).json({ message: "Permission added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error.", message: error.message });
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
      return res.status(404).json({ error: "User or permission not found." });
    }

    // Remove the UserPermission record
    await UserPermissions.destroy({
      where: {
        user_id: user.id,
        permission_id: permission.id,
      },
    });

    res.status(200).json({ message: "Permission removed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
