const { user_permissions } = require('../../helpers/users_roles_permissions');
const Role = require('../../models/Roles');
const Permission = require('../../models/Permissions');
const RolePermissions = require('../../models/RolePermissions');
const User = require('../../models/Users');

// help with populating permissions and roles
module.exports.assignPermissionToRole = async (roleId, permissionId) => {
  try {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (role && permission) {
      await role.addPermission(permission);
      console.log('Permission assigned to role successfully.');
    } else {
      console.error('Role or permission not found.');
    }
  } catch (error) {
    console.error('Error assigning permission to role:', error);
  }
};

module.exports.assignPermissionToUser = async (userId, permissionId) => {
  try {
    const user = await User.findByPk(userId);
    const permission = await Permission.findByPk(permissionId);

    if (user && permission) {
      await user.addPermission(permission);
      console.log('Permission assigned to user successfully.');
    } else {
      console.error('User or permission not found.');
    }
  } catch (error) {
    console.error('Error assigning permission to user:', error);
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
      `User ${user.username} assigned to role ${roleName} successfully.`
    );
  } catch (error) {
    console.error('Error assigning user to role:', error);
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
    console.error('Error retrieving permissions:', error);
    return [];
  }
};

module.exports.getUserPermissions = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [{ model: Permission, attributes: ['name'] }],
        },
        { model: Permission },
      ],
    });

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return [];
    }

    const rolePermissions = user.role.permissions.map(
      (permission) => permission.name
    );
    console.log(rolePermissions);

    const directPermissions = user.permissions.map(
      (permission) => permission.name
    );

    const allPermissions = [...rolePermissions, ...directPermissions];
    return allPermissions;
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
};

module.exports.getUserRole = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
    });

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return [];
    }
    return user.role.name;

    // return roles;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};
