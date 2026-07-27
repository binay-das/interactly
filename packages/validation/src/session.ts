import { z } from "zod";
import { cuidSchema, joinCodeSchema, nicknameSchema } from "./common.js";

export const createSessionSchema = z.object({
  quizId: cuidSchema,
});

export const joinSessionSchema = z.object({
  joinCode: joinCodeSchema,
  nickname: nicknameSchema,
});

export const reconnectSchema = z.object({
  reconnectToken: z.string().trim().min(1, "Reconnect token is required"),
  sessionId: cuidSchema,
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type JoinSessionInput = z.infer<typeof joinSessionSchema>;
export type ReconnectInput = z.infer<typeof reconnectSchema>;
