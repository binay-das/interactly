import { z } from "zod";
import { cuidSchema, positiveIntegerSchema } from "./common.js";

export const createOptionSchema = z.object({
  text: z.string().trim().min(1, "Option text cannot be empty"),
  order: z.number().int().min(0, "Option order must be a non-negative integer"),
  isCorrect: z.boolean(),
});

export const updateOptionSchema = createOptionSchema.extend({
  id: cuidSchema.optional(),
});

export const createQuestionSchema = z
  .object({
    text: z.string().trim().min(1, "Question text cannot be empty"),
    order: z.number().int().min(0, "Question order must be a non-negative integer"),
    timeLimit: positiveIntegerSchema.default(20),
    points: positiveIntegerSchema.default(1000),
    options: z
      .array(createOptionSchema)
      .min(2, "Question must contain at least two options"),
  })
  .refine(
    (data) => data.options.filter((opt) => opt.isCorrect).length === 1,
    {
      message: "Exactly one option must be marked correct",
      path: ["options"],
    }
  );

export const updateQuestionSchema = z
  .object({
    id: cuidSchema.optional(),
    text: z.string().trim().min(1, "Question text cannot be empty").optional(),
    order: z.number().int().min(0).optional(),
    timeLimit: positiveIntegerSchema.optional(),
    points: positiveIntegerSchema.optional(),
    options: z
      .array(updateOptionSchema)
      .min(2, "Question must contain at least two options")
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.options) return true;
      return data.options.filter((opt) => opt.isCorrect).length === 1;
    },
    {
      message: "Exactly one option must be marked correct",
      path: ["options"],
    }
  );

export const questionReorderSchema = z.object({
  questionId: cuidSchema,
  newOrder: z.number().int().min(0, "Order must be a non-negative integer"),
});

export const reorderQuestionsSchema = z.object({
  quizId: cuidSchema,
  orders: z
    .array(questionReorderSchema)
    .min(1, "At least one question reorder item must be provided"),
});

export type CreateOptionInput = z.infer<typeof createOptionSchema>;
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type QuestionReorderInput = z.infer<typeof questionReorderSchema>;
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>;
