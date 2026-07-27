import { extractToken, verifyToken } from "@repo/auth";
import type { AuthTokenPayload } from "@repo/auth";
import type { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token is missing",
        },
      });
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
