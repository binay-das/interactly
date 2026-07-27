import type { AdminLoginRequest, AdminLoginResponse, AuthUser } from "@repo/types";
import { AuthRepository, authRepository } from "./auth.repository.js";

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  async login(dto: AdminLoginRequest): Promise<AdminLoginResponse> {
    throw new Error("Method not implemented.");
  }

  async getProfile(userId: string): Promise<AuthUser> {
    throw new Error("Method not implemented.");
  }
}

export const authService = new AuthService();
