import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { gameplayController } from "./gameplay.controller.js";

const gameplayRouter: Router = Router();

gameplayRouter.post("/answer", asyncHandler(gameplayController.submitAnswer));
gameplayRouter.get("/session/:sessionId/leaderboard", asyncHandler(gameplayController.getLeaderboard));
gameplayRouter.get("/session/:sessionId/results", asyncHandler(gameplayController.getFinalResults));
gameplayRouter.get("/session/:sessionId/analytics", authenticate, asyncHandler(gameplayController.getAnalytics));

export default gameplayRouter;
