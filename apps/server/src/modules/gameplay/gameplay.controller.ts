import { submitAnswerSchema } from "@repo/validation";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { GameplayService, gameplayService } from "./gameplay.service.js";

export class GameplayController {
  constructor(private readonly service: GameplayService = gameplayService) {}

  submitAnswer = async (req: Request, res: Response): Promise<void> => {
    const input = submitAnswerSchema.parse(req.body);
    const result = await this.service.submitAnswer(input);
    res.status(200).json({ success: true, data: result });
  };

  getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    const leaderboard = await this.service.getLeaderboard(req.params.sessionId as string);
    res.status(200).json({ success: true, data: leaderboard });
  };

  getFinalResults = async (req: Request, res: Response): Promise<void> => {
    const results = await this.service.getFinalResults(req.params.sessionId as string);
    res.status(200).json({ success: true, data: results });
  };

  getAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const analytics = await this.service.getAnalytics(req.params.sessionId as string, req.user?.sub);
    res.status(200).json({ success: true, data: analytics });
  };
}

export const gameplayController = new GameplayController();
