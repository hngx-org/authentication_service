import Role from "../../models/Role";
import Permission from "../../models/Permission";
import RolePermission from "../../models/RolePermission";
import {all_permissions, roles} from "../../utils/usersRolesPermission";
import { IRoleService } from "./IRoleService";
import { HttpError } from "../../middlewares/error";
export class RoleAndPermissionService implements IRoleService {
  public async seedRole(): Promise<void> {
    try {
      await Role.bulkCreate(
        roles.map((role: string) => ({ name: role }))
      );
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }

  public async seedPermission(): Promise<void> {
    try {
      await Permission.bulkCreate(
        all_permissions.map((permission: string) => ({
          name: permission,
        }))
      );
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }

  public async fetchPermission(): Promise<Permission[]> {
    try {
      return await Permission.findAll();
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }

  public async fetchRoles(): Promise<Role[]> {
    try {
      return await Role.findAll();
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }

  public async seedRolePermissions(): Promise<void> {
    try {
      const roles = await Role.findAll();
      const permissions = await Permission.findAll();

      if (roles.length === 0 || permissions.length === 0) {
        console.log("seed Role and Permission table.");
      }

      // Seed RolePermission table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rolePermissionRecords: any[] = [];

      roles.forEach((role) => {
        permissions.forEach((permission) => {
          rolePermissionRecords.push({
            roleId: role.id,
            permissionId: permission.id,
          });
        });
      });
      // Bulk insert role-permission associations into the RolePermission table
      await RolePermission.bulkCreate(rolePermissionRecords);

      console.log("RolePermission table seeded successfully.");
    } catch (error) {
      console.error(
        "Error occurred during seeding RolePermission table:",
        error
      );
    } finally {
      // You can close the database connection here if necessary
    }
  }

  public async fetchRolePermissions(): Promise<RolePermission[]> {
    try {
      return await RolePermission.findAll({include:['roles', 'permissions']});
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }
}

const roleAndPermissionService = new RoleAndPermissionService();
export default roleAndPermissionService;
