import {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  reorderQuestionsSchema,
  createOptionSchema,
  updateOptionSchema,
  paginationSchema,
} from "@repo/validation";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { QuizService, quizService } from "./quiz.service.js";

export class QuizController {
  constructor(private readonly service: QuizService = quizService) {}

  createQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = createQuizSchema.parse(req.body);
    const quiz = await this.service.createQuiz(req.user!.sub, input);
    res.status(201).json({ success: true, data: quiz });
  };

  listQuizzes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { page, limit } = paginationSchema.parse({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    const result = await this.service.listQuizzes(req.user!.sub, page, limit);
    res.status(200).json({ success: true, data: result });
  };

  getQuiz = async (req: Request, res: Response): Promise<void> => {
    const quiz = await this.service.getQuiz(req.params.id as string);
    res.status(200).json({ success: true, data: quiz });
  };

  updateQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = updateQuizSchema.parse(req.body);
    const quiz = await this.service.updateQuiz(req.params.id as string, req.user!.sub, input);
    res.status(200).json({ success: true, data: quiz });
  };

  deleteQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.service.deleteQuiz(req.params.id as string, req.user!.sub);
    res.status(200).json({ success: true, message: "Quiz deleted successfully" });
  };

  publishQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const quiz = await this.service.publishQuiz(req.params.id as string, req.user!.sub);
    res.status(200).json({ success: true, data: quiz });
  };

  archiveQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const quiz = await this.service.archiveQuiz(req.params.id as string, req.user!.sub);
    res.status(200).json({ success: true, data: quiz });
  };

  addQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = createQuestionSchema.parse(req.body);
    const question = await this.service.addQuestion(req.params.quizId as string, req.user!.sub, input);
    res.status(201).json({ success: true, data: question });
  };

  editQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = updateQuestionSchema.parse(req.body);
    const question = await this.service.editQuestion(req.params.questionId as string, req.user!.sub, input);
    res.status(200).json({ success: true, data: question });
  };

  deleteQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.service.deleteQuestion(req.params.questionId as string, req.user!.sub);
    res.status(200).json({ success: true, message: "Question deleted successfully" });
  };

  reorderQuestions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = reorderQuestionsSchema.parse({
      quizId: req.params.quizId,
      orders: req.body.orders,
    });
    const quiz = await this.service.reorderQuestions(req.user!.sub, input);
    res.status(200).json({ success: true, data: quiz });
  };

  createOption = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = createOptionSchema.parse(req.body);
    const option = await this.service.createOption(req.params.questionId as string, req.user!.sub, input);
    res.status(201).json({ success: true, data: option });
  };

  readOptions = async (req: Request, res: Response): Promise<void> => {
    const options = await this.service.readOptions(req.params.questionId as string);
    res.status(200).json({ success: true, data: options });
  };

  updateOption = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const input = updateOptionSchema.parse(req.body);
    const option = await this.service.updateOption(req.params.optionId as string, req.user!.sub, input);
    res.status(200).json({ success: true, data: option });
  };

  deleteOption = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.service.deleteOption(req.params.optionId as string, req.user!.sub);
    res.status(200).json({ success: true, message: "Option deleted successfully" });
  };
}

export const quizController = new QuizController();
