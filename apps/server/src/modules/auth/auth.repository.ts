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
}

export const authRepository = new AuthRepository();
