import Role from "../../models/Role";
import Permission from "../../models/Permission";
import usersRolesPermission from "../../utils/usersRolesPermission";
import { IRoleService } from "./IRoleService";
import { HttpError } from "../../middlewares/error";
export class RoleAndPermissionService implements IRoleService {
  public async seedRole(): Promise<void> {
    try {
      await Role.bulkCreate(
        usersRolesPermission.roles.map((role: string) => ({ name: role }))
      );
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }

  public async seedPermission(): Promise<void> {
    try {
      await Permission.bulkCreate(
        usersRolesPermission.all_permissions.map((permission: string) => ({
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
}

const roleAndPermissionService = new RoleAndPermissionService();
export default roleAndPermissionService;
