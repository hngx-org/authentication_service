import Role from '../../models/Role';
import { success } from '../../utils/index';

export const fetchRolesService = async (res: any) => {
  const roles = await Role.findAll();
  return success('Roles retrieved successfully', roles, 201, res);
};
