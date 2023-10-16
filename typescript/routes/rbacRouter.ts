import { createRole } from './../controllers/UserController/RBACController/index';
import express from 'express';

const rbacRouter = express.Router();

rbacRouter.post( '/', createRole);

// rbacRouter.get('/permissions', AuthorizationController.permissions);
// rbacRouter.get('/roles', AuthorizationController.roles);


export default rbacRouter;
