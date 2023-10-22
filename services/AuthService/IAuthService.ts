import { IAuthorizeResponse } from './index';

export interface IAuthService {
  authorize({ token, permission }:{token: string, permission: string}): Promise<IAuthorizeResponse>;
}
