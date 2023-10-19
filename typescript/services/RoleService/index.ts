import Role from '../../models/Role';
import { success } from '../../utils/index';
import {Response} from 'express'
import IRoleService from './IRoleService';
 export class RoleAndPermissionService implements IRoleService{
public seedRole(): Promise<unknown> {
    
}

public  seedPermission(): Promise<unknown> {
    
}
}

const roleAndPermissionService = new RoleAndPermissionService();
export default roleAndPermissionService