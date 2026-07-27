import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { AuthService, authService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({
      success: false,
      message: "Auth login endpoint not implemented yet",
    });
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(501).json({
      success: false,
      message: "Auth me endpoint not implemented yet",
    });
  };
}

export const authController = new AuthController();
