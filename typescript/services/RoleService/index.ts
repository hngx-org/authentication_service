/* eslint-disable camelcase */
// import IRoleService from "../RoleService/IRoleService";
// import express from "express";
// import Role from "../../models/Role";
// import {
//   roles,
//   guest_permissions,
//   user_permissions,
//   all_permissions,
// } from "./../../utils/users_roles_permission";
// import Permission from "../../models/Permission";
// import User from "../../models/User";

export class RBACService {
  // public async addPermission(req: express.Request, res: express.Response) {
  //   const { userId, permissionId } = req.body;

  //   try {
  //     // Check if the user and permission exist
  //     const user = await User.findByPk(userId);

  //     const permission = await Permission.findByPk(permissionId);

  //     if (!user || !permission) {
  //       return res.status(404).json({ error: "User or permission not found." });
  //     }
  //     // return res.json({user,permission})
  //     // Add the permission to the user
  //     await user.addPermission(permission);
  //     // // Create a new UserPermission record
  //     // await UserPermissions.create({
  //     //   user_id: user.id,
  //     //   permission_id: permission.id,
  //     // });

  //     res.status(200).json({ message: "Permission added successfully." });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ error: "Internal server error.", message: error.message });
  //   }
  // }

  // public async assignPermissionToRole(roleId: number, permissionId: number) {
  //   try {
  //     const role = await Role.findByPk(roleId);
  //     const permission = await Permission.findByPk(permissionId);

  //     if (role && permission) {
  //       await this.addPermission(permission);
  //       console.log("Permission assigned to role successfully.");
  //     } else {
  //       console.error("Role or permission not found.");
  //     }
  //   } catch (error) {
  //     console.error("Error assigning permission to role:", error);
  //   }
  // }

  // public async createRolesAndPermission(): Promise<unknown> {
  //   try {
  //     const allRoles = await Role.findAll();
  //     if (allRoles[0]) return;
  //   } catch (error) {}

  //   const createdPermissions = [];
  //   const createdRoles = [];

  //   let id = 1;

  //   for (const permission of all_permissions) {
  //     const createdPerm = await Permission.create({
  //       name: permission,
  //       id: id++,
  //     });
  //     createdPermissions.push(createdPerm);
  //   }

  //   let id2 = 1;
  //   for (const role of roles) {
  //     const createRole = await Role.create({ name: role, id: id2++ });
  //     createdRoles.push(createRole);
  //   }

  //   for (const permission of all_permissions) {
  //     const createdPerm = createdPermissions.find(
  //       (perm) => perm.name === permission
  //     );
  //     const role = createdRoles.find((rol) => rol.name === "admin");
  //     await this.assignPermissionToRole(role.id, createdPerm.id);
  //   }

  //   for (const permission of user_permissions) {
  //     const createdPerm = createdPermissions.find(
  //       (perm) => perm.name === permission
  //     );
  //     const role = createdRoles.find((rol) => rol.name === "user");
  //     await this.assignPermissionToRole(role.id, createdPerm.id);
  //   }

  //   for (const permission of guest_permissions) {
  //     const createdPerm = createdPermissions.find(
  //       (perm) => perm.name === permission
  //     );
  //     const role = createdRoles.find((rol) => rol.name === "guest");
  //     await this.assignPermissionToRole(role.id, createdPerm.id);
  //   }
  // }
}

const rBACService = new RBACService();
export default rBACService;
