import { AUTH_COOKIE_NAME, AUTH_HEADER_NAME } from "./constants.js";
import { ForbiddenError, UnauthorizedError } from "./errors.js";
import { verifyToken } from "./jwt.js";
import type { AuthTokenPayload, RequestLike } from "./types.js";
import { extractCookieValue, parseBearerToken } from "./utils.js";

export function extractToken(req: RequestLike): string | null {
  if (!req) return null;

  if ("cookies" in req && req.cookies && typeof req.cookies === "object") {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies[AUTH_COOKIE_NAME];
    if (token) {
      return token;
    }
  }

  let authHeader: string | null = null;
  let cookieHeader: string | null = null;

  if ("headers" in req && req.headers) {
    const headers = req.headers;
    if (typeof (headers as { get?: unknown }).get === "function") {
      const h = headers as { get: (name: string) => string | null };
      authHeader = h.get(AUTH_HEADER_NAME) || h.get("Authorization");
      cookieHeader = h.get("cookie") || h.get("Cookie");
    } else {
      const h = headers as Record<string, string | string[] | undefined>;
      const rawAuth = h[AUTH_HEADER_NAME] || h["Authorization"] || h["authorization"];
      authHeader = Array.isArray(rawAuth) ? rawAuth[0] ?? null : rawAuth ?? null;

      const rawCookie = h["cookie"] || h["Cookie"];
      cookieHeader = Array.isArray(rawCookie) ? rawCookie[0] ?? null : rawCookie ?? null;
    }
  } else if (typeof (req as { get?: unknown }).get === "function") {
    const h = req as { get: (name: string) => string | undefined };
    authHeader = h.get("authorization") || h.get("Authorization") || null;
    cookieHeader = h.get("cookie") || h.get("Cookie") || null;
  }

  if (authHeader) {
    const bearer = parseBearerToken(authHeader);
    if (bearer) return bearer;
  }

  if (cookieHeader) {
    const cookieToken = extractCookieValue(cookieHeader, AUTH_COOKIE_NAME);
    if (cookieToken) return cookieToken;
  }

  return null;
}

export function verifyAuthRequest(req: RequestLike, secret?: string): AuthTokenPayload {
  const token = extractToken(req);
  if (!token) {
    throw new UnauthorizedError("Authentication token is missing");
  }
  return verifyToken(token, secret);
}

export function requireAuthenticatedUser(req: RequestLike, secret?: string): AuthTokenPayload {
  return verifyAuthRequest(req, secret);
}

export function requireAdmin(req: RequestLike, secret?: string): AuthTokenPayload {
  const payload = verifyAuthRequest(req, secret);
  if (payload.role !== "ADMIN" && payload.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }
  return payload;
}
