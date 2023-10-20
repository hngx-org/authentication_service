import { Request, Response } from "express";
import authService from "../../services/AuthService";
import rbac from "../../utils/usersRolesPermission";

export const authorize = async (
  req: Request,
  res: Response,
): Promise<unknown> => {
  try {
    const { token, permission } = req.body;
    if (!token) {
      return res.status(400).json({
        status: 400,
        error: "Token is required",
      });
    }

    if (permission && !rbac.all_permissions.includes(permission)) {
      return res
        .status(400)
        .json({ status: 400, message: "invalid permission" });
    }

    const response = await authService.authorize(req.body);

    if (!response) {
      return res
        .status(400)
        .json({ status: 400, message: "invalid permission" });
    }
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({error: err})
  }
};
