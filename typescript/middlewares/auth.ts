import { Request, Response, NextFunction } from "express";

import User from "../models/User";
import { errorResponse, verifyToken } from "../utils/index";

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return errorResponse("You must be logged in", 401, res);
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const decoded = verifyToken(token);
    const { id } = decoded;
    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse("User not found", 404, res);
    }
    req.user = user;
    next();
  } catch (err) {
    return errorResponse("Invalid token", 401, res);
  }
};
