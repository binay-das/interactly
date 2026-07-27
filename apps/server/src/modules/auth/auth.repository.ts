import { db } from "@repo/db";
import type { Admin } from "@repo/db";

export class AuthRepository {
  async findAdminByEmail(email: string): Promise<Admin | null> {
    return null;
  }

  async findAdminById(id: string): Promise<Admin | null> {
    return null;
  }
}

export const authRepository = new AuthRepository();
