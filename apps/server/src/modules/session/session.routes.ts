import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { sessionController } from "./session.controller.js";

const sessionRouter: Router = Router();

sessionRouter.post("/", authenticate, asyncHandler(sessionController.createSession));
sessionRouter.get("/:id", asyncHandler(sessionController.getSession));
sessionRouter.post("/:id/start", authenticate, asyncHandler(sessionController.startQuiz));
sessionRouter.post("/:id/advance", authenticate, asyncHandler(sessionController.advanceState));
sessionRouter.post("/:id/end", authenticate, asyncHandler(sessionController.endQuiz));

export default sessionRouter;
