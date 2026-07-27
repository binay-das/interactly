import { AUTH_COOKIE_NAME, BEARER_PREFIX } from "./constants.js";
import type { AuthTokenPayload } from "./types.js";

export function parseBearerToken(headerValue?: string | null): string | null {
  if (!headerValue) return null;
  const trimmed = headerValue.trim();
  if (trimmed.toLowerCase().startsWith(BEARER_PREFIX.toLowerCase())) {
    const token = trimmed.substring(BEARER_PREFIX.length).trim();
    return token || null;
  }
  return null;
}

export function createTokenPayload(user: { id: string; email: string; role?: string }): AuthTokenPayload {
  return {
    sub: user.id,
    email: user.email,
    ...(user.role ? { role: user.role } : {}),
  };
}

export function isTokenExpired(exp?: number): boolean {
  if (!exp) return false;
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return exp <= currentTimeInSeconds;
}

export function extractCookieValue(
  cookieHeader: string | null | undefined,
  cookieName: string = AUTH_COOKIE_NAME
): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === cookieName) {
      return rest.join("=").trim() || null;
    }
  }
  return null;
}
