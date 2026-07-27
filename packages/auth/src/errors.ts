export class AuthError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = "Invalid email or password") {
    super(message, 401);
    this.name = "InvalidCredentialsError";
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Authentication required") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Access forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = "Invalid authentication token") {
    super(message, 401);
    this.name = "InvalidTokenError";
  }
}

export class ExpiredTokenError extends AuthError {
  constructor(message = "Authentication token has expired") {
    super(message, 401);
    this.name = "ExpiredTokenError";
  }
}
