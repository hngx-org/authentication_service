const {
  assignPermissionToRole,
} = require("../controllers/helpers/rolesandpermissions");
const Role = require("../models/Roles");
const Permission = require("../models/Permissions");

const {
  all_permissions,
  user_permissions,
  guest_permissions,
  roles,
} = require("./users_roles_permissions");

const createEntities = async () => {
  try {
    const allRoles = await Role.findAll();
    if (allRoles[0]) return;
  } catch (error) {}

  const createdPermissions = [];
  const createdRoles = [];

  for (const permission of all_permissions) {
    const createdPerm = await Permission.create({ name: permission });
    createdPermissions.push(createdPerm);
  }

  for (const role of roles) {
    const createRole = await Role.create({ name: role });
    createdRoles.push(createRole);
  }

  for (const permission of all_permissions) {
    const createdPerm = createdPermissions.find(
      (perm) => perm.name == permission,
    );
    const role = createdRoles.find((rol) => rol.name === "admin");
    await assignPermissionToRole(role.id, createdPerm.id);
  }

  for (const permission of user_permissions) {
    const createdPerm = createdPermissions.find(
      (perm) => perm.name == permission,
    );
    const role = createdRoles.find((rol) => rol.name === "user");
    await assignPermissionToRole(role.id, createdPerm.id);
  }

  for (const permission of guest_permissions) {
    const createdPerm = createdPermissions.find(
      (perm) => perm.name == permission,
    );
    const role = createdRoles.find((rol) => rol.name === "guest");
    await assignPermissionToRole(role.id, createdPerm.id);
  }
};

module.exports = createEntities;
