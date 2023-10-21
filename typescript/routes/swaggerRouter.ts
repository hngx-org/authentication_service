import { Router } from "express";
import SwaggerController from "../controllers/SwaggerController";

const swaggerRouter = Router();

swaggerRouter.get("/", SwaggerController.serve, SwaggerController.setup);

export default swaggerRouter;
