import { db } from "@repo/db";
import type { Admin } from "@repo/db";

export class AuthRepository {
  async findAdminByEmail(email: string): Promise<Admin | null> {
    return db.admin.findUnique({
      where: { email },
    });
  }

  async findAdminById(id: string): Promise<Admin | null> {
    return db.admin.findUnique({
      where: { id },
    });
  }

  async createAdmin(email: string, passwordHash: string): Promise<Admin> {
    return db.admin.create({
      data: {
        email,
        passwordHash,
      },
    });
  }
}

export const authRepository = new AuthRepository();
