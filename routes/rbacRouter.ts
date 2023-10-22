import {
  fetchPermission,
  fetchRolePermissions,
  fetchRoles,
} from "../controllers/RBACController/index";
import express from "express";

const rbacRouter = express.Router();

rbacRouter.get("/", fetchRoles);
rbacRouter.get("/permissions", fetchPermission);
rbacRouter.get("/roles-permissions", fetchRolePermissions);

export default rbacRouter;
