const { user_permissions } = require("../../helpers/users_roles_permissions");
const Role = require("../../models/Roles");
const Permission = require("../../models/Permissions");
const RolePermissions = require("../../models/RolePermissions");
const User = require("../../models/Users");

// help with populating permissions and roles
module.exports.assignPermissionToRole = async (roleId, permissionId) => {
  try {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (role && permission) {
      await role.addPermission(permission);
      console.log("Permission assigned to role successfully.");
    } else {
      console.error("Role or permission not found.");
    }
  } catch (error) {
    console.error("Error assigning permission to role:", error);
  }
};

module.exports.assignPermissionToUser = async (userId, permissionId) => {
  try {
    const user = await User.findByPk(userId);
    const permission = await Permission.findByPk(permissionId);

    if (user && permission) {
      await user.addPermission(permission);
      console.log("Permission assigned to user successfully.");
    } else {
      console.error("User or permission not found.");
    }
  } catch (error) {
    console.error("Error assigning permission to user:", error);
  }
};

module.exports.assignUserToRole = async (userId, roleName) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return;
    }
    const role = await Role.findOne({ where: { name: roleName } });

    if (!role) {
      console.error(`Role ${roleName} not found.`);
      return;
    }

    await user.setRole(role);

    console.log(
      `User ${user.username} assigned to role ${roleName} successfully.`,
    );
  } catch (error) {
    console.error("Error assigning user to role:", error);
  }
};

// help with getting user permissions
module.exports.getPermissionsForRole = async (roleName) => {
  try {
    const role = await Role.findOne({
      where: { name: roleName },
      include: [{ model: Permission, through: RolePermissions }],
    });

    if (role) {
      const permissions = role.Permissions.map((permission) => permission.name);
      return permissions;
    } else {
      console.error(`Role ${roleName} not found.`);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving permissions:", error);
    return [];
  }
};

module.exports.getUserPermissions = async (userId) => {
  try {
    // Find the user by ID
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          include: Permission,
        },
        {
          model: Permission,
          through: user_permissions,
          as: "UserPermissions",
        },
      ],
    });

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return [];
    }

    // Extract permissions from roles and user_permissions
    const rolePermissions = user.Roles.flatMap((role) => role.Permissions);
    const userPermissions = user.UserPermissions;

    console.log(`Permissions of user ${user.username}:`, [
      ...rolePermissions.map((permission) => permission.name),
      ...userPermissions.map((permission) => permission.name),
    ]);

    return [
      ...rolePermissions.map((permission) => permission.name),
      ...userPermissions.map((permission) => permission.name),
    ];
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
};

module.exports.getRoleByUserId = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: Role,
    });

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return null;
    }

    const role = user.Roles[0].name;

    return role;
  } catch (error) {
    console.error("Error getting roles by user ID:", error);
    return null;
  }
};
