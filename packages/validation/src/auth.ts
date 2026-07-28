import { z } from "zod";
import { emailSchema } from "./common.js";

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const adminRegisterSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
