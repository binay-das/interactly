import { AuthError } from "@repo/auth";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AuthError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.name,
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    },
  });
};
