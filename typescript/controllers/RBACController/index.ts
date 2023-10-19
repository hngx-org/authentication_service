import roleAndPermissionService from "../../services/RoleService/index";
import { Response, Request, NextFunction } from "express";

export const seedRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await roleAndPermissionService.seedRole();
    res.status(200).json({
      status: 200,
      message: "seed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const seedPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await roleAndPermissionService.seedPermission();
    res.status(200).json({
      status: 200,
      message: "seed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const fetchRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await roleAndPermissionService.fetchRoles();
    res.status(200).json({
      status: 200,
      message: "Fetched successfully",
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};
/**
 *
 * @param req
 * @param res
 * @param next
 */
export const fetchPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permission = await roleAndPermissionService.fetchPermission();
    res.status(200).json({
      status: 200,
      message: "Fetched successfully",
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};
