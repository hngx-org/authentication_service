import { createRole, fetchRoles } from '../controllers/RBACController/index';
import express from 'express';

const rbacRouter = express.Router();

rbacRouter.post( '/', createRole);

// rbacRouter.get('/permissions', AuthorizationController.permissions);
rbacRouter.get('/roles', fetchRoles);


export default rbacRouter;
