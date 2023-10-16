import { Request, Response } from "express";
import Role from "../../../models/Role";
import { success } from "../../../utils";

export const createRole = async (req: Request, res: Response) => {
  res.send("to be implemented");
};

export const fetchRoles = async (req: Request, res: Response) => {
  const roles = await Role.findAll();
  return success("Roles retrieved successfully", roles, 200, res);
};
