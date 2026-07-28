import { joinSessionSchema, reconnectSchema } from "@repo/validation";
import type { Request, Response } from "express";
import { PlayerService, playerService } from "./player.service.js";

export class PlayerController {
  constructor(private readonly service: PlayerService = playerService) {}

  joinSession = async (req: Request, res: Response): Promise<void> => {
    const input = joinSessionSchema.parse(req.body);
    const result = await this.service.joinSession(input);
    res.status(201).json({ success: true, data: result });
  };

  reconnect = async (req: Request, res: Response): Promise<void> => {
    const input = reconnectSchema.parse(req.body);
    const result = await this.service.reconnect(input);
    res.status(200).json({ success: true, data: result });
  };

  getSessionState = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.getSessionState(req.params.sessionId as string);
    res.status(200).json({ success: true, data: result });
  };

}

export const playerController = new PlayerController();
