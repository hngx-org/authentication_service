import Permission from "../../models/Permission";
import Role from "../../models/Role";

export interface IRoleService {
  seedRole(): Promise<unknown>;

  seedPermission(): Promise<unknown>;

  fetchRoles(): Promise<Role[]>;

  fetchPermission(): Promise<Permission[]>;
}
