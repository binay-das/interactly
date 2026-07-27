import { z } from "zod";
import { emailSchema } from "./common.js";

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
