import { z } from "zod";
import { cuidSchema } from "./common.js";
import { createQuestionSchema, updateQuestionSchema } from "./question.js";

export const quizStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, "Quiz title cannot be empty").max(150, "Quiz title cannot exceed 150 characters"),
  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters").optional(),
  status: quizStatusSchema.optional().default("DRAFT"),
  questions: z.array(createQuestionSchema).optional(),
});

export const updateQuizSchema = z.object({
  title: z.string().trim().min(1, "Quiz title cannot be empty").max(150, "Quiz title cannot exceed 150 characters").optional(),
  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters").nullable().optional(),
  status: quizStatusSchema.optional(),
  questions: z.array(updateQuestionSchema).optional(),
});

export const publishQuizSchema = z.object({
  id: cuidSchema,
});

export type QuizStatusType = z.infer<typeof quizStatusSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type PublishQuizInput = z.infer<typeof publishQuizSchema>;
