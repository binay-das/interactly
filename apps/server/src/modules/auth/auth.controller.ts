import { AUTH_COOKIE_NAME, getAuthCookieOptions, getClearAuthCookieOptions, UnauthorizedError } from "@repo/auth";
import { adminLoginSchema, adminRegisterSchema } from "@repo/validation";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { AuthService, authService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const input = adminLoginSchema.parse(req.body);
    const result = await this.service.login(input.email, input.password);

    res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const input = adminRegisterSchema.parse(req.body);
    const result = await this.service.register(input.email, input.password);

    res.cookie(AUTH_COOKIE_NAME, result.token, getAuthCookieOptions());

    res.status(201).json({
      success: true,
      data: result,
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const adminId = req.user?.sub;
    if (!adminId) {
      throw new UnauthorizedError("Authentication required");
    }

    const user = await this.service.getCurrentAdmin(adminId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  };
}

export const authController = new AuthController();
