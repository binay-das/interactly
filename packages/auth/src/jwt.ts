import jwt from "jsonwebtoken";
import { DEFAULT_JWT_EXPIRES_IN } from "./constants.js";
import { ExpiredTokenError, InvalidTokenError } from "./errors.js";
import type { AuthTokenPayload } from "./types.js";

function getSecret(customSecret?: string): string {
  const secret = customSecret || process.env.JWT_SECRET;
  if (!secret) {
    throw new InvalidTokenError("JWT secret is not configured");
  }
  return secret;
}

export function generateAccessToken(
  payload: Omit<AuthTokenPayload, "iat" | "exp">,
  secret?: string,
  expiresIn: string | number = DEFAULT_JWT_EXPIRES_IN
): string {
  const jwtSecret = getSecret(secret);
  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string, secret?: string): AuthTokenPayload {
  const jwtSecret = getSecret(secret);
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded as AuthTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError(error.message || "Invalid token");
    }
    throw new InvalidTokenError("Failed to verify token");
  }
}

export function decodeToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.decode(token);
    return (decoded as AuthTokenPayload) || null;
  } catch {
    return null;
  }
}
