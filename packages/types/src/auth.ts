import type { ID, ISODateString } from "./common.js";

export interface AuthUser {
  id: ID;
  email: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: ISODateString;
}

export interface JwtPayload {
  sub: ID;
  email: string;
  iat?: number;
  exp?: number;
  iss?: string;
}
