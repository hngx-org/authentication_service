import Role from '../../models/Role';
import { success } from '../../utils/index';
import {Response} from 'express'
export const fetchRolesService = async (res: Response) => {
  const roles = await Role.findAll();
  return success('Roles retrieved successfully', roles, 201, res);
};
