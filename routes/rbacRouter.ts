import {
  fetchPermission,
  fetchRolePermissions,
  fetchRoles,
  seedPermission,
  seedRole,
  seedRolePermissions,
} from "../controllers/RBACController/index";
import express from "express";

const rbacRouter = express.Router();

rbacRouter.post("/seed-role", seedRole);
rbacRouter.post("/seed-permission", seedPermission);
rbacRouter.get("/", fetchRoles);
rbacRouter.get("/permissions", fetchPermission);
rbacRouter.post("/seed-role-permission", seedRolePermissions);
rbacRouter.get("/roles-permissions", fetchRolePermissions);

export default rbacRouter;
