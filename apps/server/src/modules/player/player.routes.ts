import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { playerController } from "./player.controller.js";

const playerRouter: Router = Router();

playerRouter.post("/join", asyncHandler(playerController.joinSession));
playerRouter.post("/reconnect", asyncHandler(playerController.reconnect));
playerRouter.get("/session/:sessionId/state", asyncHandler(playerController.getSessionState));

export default playerRouter;
