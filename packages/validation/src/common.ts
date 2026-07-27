import { z } from "zod";

export const cuidSchema = z.string().cuid("Invalid CUID format");

export const emailSchema = z.string().trim().email("Invalid email address");

export const nicknameSchema = z
  .string()
  .trim()
  .min(2, "Nickname must be at least 2 characters long")
  .max(30, "Nickname cannot exceed 30 characters");

export const positiveIntegerSchema = z
  .number()
  .int("Must be an integer")
  .positive("Must be a positive number");

export const nonNegativeIntegerSchema = z
  .number()
  .int("Must be an integer")
  .min(0, "Must be zero or a positive number");

export const paginationSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z.number().int().min(1).max(100, "Limit cannot exceed 100").default(10),
});

export const optionalStringSchema = z.string().trim().optional();

export const isoDateSchema = z.string().datetime("Invalid ISO date string");

export const joinCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(6, "Join code must be exactly 6 characters")
  .regex(/^[A-Z0-9]{6}$/, "Join code must contain only uppercase letters and numbers");

export type CuidInput = z.infer<typeof cuidSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type NicknameInput = z.infer<typeof nicknameSchema>;
export type PositiveIntegerInput = z.infer<typeof positiveIntegerSchema>;
export type NonNegativeIntegerInput = z.infer<typeof nonNegativeIntegerSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type OptionalStringInput = z.infer<typeof optionalStringSchema>;
export type IsoDateInput = z.infer<typeof isoDateSchema>;
export type JoinCodeInput = z.infer<typeof joinCodeSchema>;
