import { z } from "zod";
import { cuidSchema, nonNegativeIntegerSchema } from "./common.js";

export const submitAnswerSchema = z.object({
  sessionId: cuidSchema,
  participantId: cuidSchema,
  questionId: cuidSchema,
  selectedOptionId: cuidSchema,
  responseTimeMs: nonNegativeIntegerSchema,
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
