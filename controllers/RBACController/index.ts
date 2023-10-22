import { success } from "../../utils/index";
import roleAndPermissionService from "../../services/RoleService/index";
import { Response, Request } from "express";

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const fetchRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleAndPermissionService.fetchRoles();
    return success("Fetched successfully", roles, 200, res);
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
};
/**
 *
 * @param req
 * @param res
 * @param next
 */
export const fetchPermission = async (req: Request, res: Response) => {
  try {
    const permission = await roleAndPermissionService.fetchPermission();
    return success("Fetched successfully", permission, 200, res);
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const fetchRolePermissions = async (req: Request, res: Response) => {
  try {
    const permission = await roleAndPermissionService.fetchRolePermissions();
    success("Fetched successfully", permission, 200, res);
  } catch (error) {
    res.send(error.message);
  }
};
