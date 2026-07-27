import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authController } from "./auth.controller.js";

const authRouter: Router = Router();

authRouter.post("/login", asyncHandler(authController.login));
authRouter.get("/me", authenticate, asyncHandler(authController.me));

export default authRouter;
