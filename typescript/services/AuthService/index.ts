/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "../../models/User";
import Role from "../../models/Role";
import { IAuthService } from "./IAuthService";
import { verifyToken } from "../../utils";
import sequelize from "../../config/db.config";
import {
  HttpError,
  ResourceNotFound,
  Unauthorized,
} from "../../middlewares/error";

interface IRoleUser {
  id: string;
  role?: string;
  permissions?: Array<string>;
}

export interface IAuthorizeResponse {
  status: number;
  authorized: boolean;
  message: string;
  user: IRoleUser;
}

export class AuthService implements IAuthService {
  public async authorize({
    token,
    permission,
  }: {
    token: string;
    permission: string;
  }): Promise<IAuthorizeResponse> {
    try {
      const decoded = await verifyToken(token);
      if (!decoded) {
        throw new Unauthorized("Invalid token");
      }

      const user = await User.findOne({ where: { id: decoded.id } });

      if (!user) {
        throw new ResourceNotFound("No user found");
      }
      let response: IAuthorizeResponse;

      const role = await Role.findOne({ where: { id: user.roleId } });

      const [userPermissions] = await sequelize.query(
        `SELECT permission.name FROM "user_permission"
		INNER JOIN "permission" ON user_permission.permission_id = permission.id
		WHERE user_permission.user_id = '${decoded.id}';`
      );

      const [rolePermissions] = await sequelize.query(
        `SELECT permission.name FROM "roles_permissions"
	 INNER JOIN "permission" ON roles_permissions.permission_id = permission.id 
	 WHERE roles_permissions.role_id = '${user.roleId}';`
      );

      const permissions = [
        ...new Set([
          ...userPermissions.map((permission: any) => permission.name),
          ...rolePermissions.map((permission: any) => permission.name),
        ]),
      ];

      if (user && !permission) {
        response = {
          status: 200,
          authorized: true,
          message: "user is authenticated",
          user: {
            id: user.id,
            role: role?.name,
          },
        };
        return response;
      }

      if (permission && permissions.includes(permission)) {
        response = {
          status: 200,
          authorized: true,
          message: "user is authorized for this permission",
          user: {
            id: user.id,
            permissions,
            role: role?.name,
          },
        };

        return response;
      }
      throw new Unauthorized("user is not authorized for this permission");
    } catch (err) {
      throw new HttpError(err.statusCode, err.message);
    }
  }
}
const authService = new AuthService();
export default authService;
