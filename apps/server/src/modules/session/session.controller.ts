import { createSessionSchema } from "@repo/validation";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { SessionService, sessionService } from "./session.service.js";

export class SessionController {
  constructor(private readonly service: SessionService = sessionService) {}

  createSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = createSessionSchema.parse(req.body);
    const session = await this.service.createSession(req.user!.sub, input);
    res.status(201).json({ success: true, data: session });
  };

  getSession = async (req: Request, res: Response): Promise<void> => {
    const session = await this.service.getSession(req.params.id as string);
    res.status(200).json({ success: true, data: session });
  };

  startQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const session = await this.service.startQuiz(req.params.id as string, req.user!.sub);
    res.status(200).json({ success: true, data: session });
  };

  endQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const session = await this.service.endQuiz(req.params.id as string, req.user!.sub);
    res.status(200).json({ success: true, data: session });
  };
}

export const sessionController = new SessionController();
