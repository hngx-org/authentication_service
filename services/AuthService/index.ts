import User from '../../models/User';
import Role from '../../models/Role';
import { IAuthService } from './IAuthService';
import { verifyToken } from '../../utils';
import {
  HttpError,
  ResourceNotFound,
  Unauthorized,
} from '../../middlewares/error';

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
        throw new Unauthorized('Invalid token');
      }

      const user = await User.findByPk(decoded.id, {
        include: [
          {
            model: Role,
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!user) {
        throw new ResourceNotFound('No user found');
      }
      let response: IAuthorizeResponse;

      if (user && !permission) {
        response = {
          status: 200,
          authorized: true,
          message: 'user is authenticated',
          user: {
            id: user.id,
            role: user.userRole?.name,
          },
        };
        return response;
      }

      const permissions = user.permissions?.map((perm) => perm.name) || [];

      if (permission && permissions.includes(permission)) {
        response = {
          status: 200,
          authorized: true,
          message: 'user is authorized for this permission',
          user: {
            id: user.id,
            permissions,
            role: user.userRole?.name,
          },
        };

        return response;
      }

      throw new Unauthorized('user is not authorized for this permission');
    } catch (err) {
      console.log(err);
      throw new HttpError(err.statusCode || 500, err.message);
    }
  }
}
const authService = new AuthService();
export default authService;
