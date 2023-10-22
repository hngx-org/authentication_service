
import express from "express";
import { authorize } from "../controllers/AuthController";

const authRouter = express.Router();

authRouter.post('/', authorize)
export default authRouter;
