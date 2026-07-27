import { generateAccessToken, InvalidCredentialsError, UnauthorizedError, verifyPassword } from "@repo/auth";
import type { AdminLoginResponse, AuthUser } from "@repo/types";
import { AuthRepository, authRepository } from "./auth.repository.js";

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) { }

  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const admin = await this.repository.findAdminByEmail(email);
    if (!admin) {
      throw new InvalidCredentialsError("Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Invalid email or password");
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: "ADMIN",
    };

    const token = generateAccessToken(payload);

    const expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate() + 7);

    const user: AuthUser = {
      id: admin.id,
      email: admin.email,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };

    return {
      user,
      token,
      expiresAt: expiresAtDate.toISOString(),
    };
  }

  async getCurrentAdmin(adminId: string): Promise<AuthUser> {
    const admin = await this.repository.findAdminById(adminId);
    if (!admin) {
      throw new UnauthorizedError("Admin user not found");
    }

    return {
      id: admin.id,
      email: admin.email,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
