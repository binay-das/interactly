import { AUTH_COOKIE_NAME, DEFAULT_COOKIE_MAX_AGE_SECONDS } from "./constants.js";
import type { AuthCookieOptions } from "./types.js";

export function getAuthCookieOptions(
  isProduction: boolean = process.env.NODE_ENV === "production",
  maxAgeSeconds: number = DEFAULT_COOKIE_MAX_AGE_SECONDS
): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function getClearAuthCookieOptions(
  isProduction: boolean = process.env.NODE_ENV === "production"
): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}

export function createAuthCookieHeader(
  token: string,
  isProduction?: boolean,
  cookieName: string = AUTH_COOKIE_NAME,
  maxAgeSeconds?: number
): string {
  const options = getAuthCookieOptions(isProduction, maxAgeSeconds);
  const parts = [`${cookieName}=${token}`, `Path=${options.path}`, `HttpOnly`];

  if (options.maxAge) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  if (options.secure) {
    parts.push("Secure");
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`);
  }

  return parts.join("; ");
}
