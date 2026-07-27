export interface AuthTokenPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
  expires?: Date;
}

export type HeaderValue = string | string[] | undefined;

export interface HeadersLike {
  get?: (name: string) => string | null | undefined;
  [key: string]: unknown;
}

export type RequestLike =
  | HeadersLike
  | {
      headers?: Record<string, HeaderValue> | HeadersLike;
      cookies?: Record<string, string | undefined>;
    };
