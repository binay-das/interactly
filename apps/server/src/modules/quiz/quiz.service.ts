import type { CreateQuizInput, UpdateQuizInput, CreateQuestionInput, UpdateQuestionInput, CreateOptionInput, UpdateOptionInput, ReorderQuestionsInput } from "@repo/validation";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { QuizRepository, quizRepository } from "./quiz.repository.js";

export class QuizService {
  constructor(private readonly repository: QuizRepository = quizRepository) {}

  async createQuiz(adminId: string, input: CreateQuizInput) {
    return this.repository.create({
      title: input.title,
      description: input.description,
      status: input.status,
      createdById: adminId,
      questions: input.questions,
    });
  }

  async listQuizzes(adminId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [quizzes, total] = await this.repository.findAllByAdminId(adminId, skip, limit);
    return {
      quizzes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getQuiz(id: string, adminId?: string) {
    const quiz = await this.repository.findById(id);
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }
    if (adminId && quiz.createdById !== adminId) {
      throw new ForbiddenError("You do not have permission to access this quiz");
    }
    return quiz;
  }

  async updateQuiz(id: string, adminId: string, input: UpdateQuizInput) {
    await this.getQuiz(id, adminId);
    return this.repository.update(id, {
      title: input.title,
      description: input.description,
      status: input.status,
    });
  }

  async deleteQuiz(id: string, adminId: string) {
    await this.getQuiz(id, adminId);
    return this.repository.delete(id);
  }

  async publishQuiz(id: string, adminId: string) {
    const quiz = await this.getQuiz(id, adminId);

    if (!quiz.questions || quiz.questions.length === 0) {
      throw new BadRequestError("Cannot publish a quiz with no questions");
    }

    for (const question of quiz.questions) {
      const correctCount = question.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        throw new BadRequestError(
          `Question "${question.text}" must have exactly one correct option before publishing (found ${correctCount})`
        );
      }
    }

    return this.repository.update(id, { status: "PUBLISHED" });
  }

  async archiveQuiz(id: string, adminId: string) {
    await this.getQuiz(id, adminId);
    return this.repository.update(id, { status: "ARCHIVED" });
  }

  async addQuestion(quizId: string, adminId: string, input: CreateQuestionInput) {
    await this.getQuiz(quizId, adminId);
    return this.repository.createQuestion(quizId, input);
  }

  async editQuestion(questionId: string, adminId: string, input: UpdateQuestionInput) {
    const question = await this.repository.findQuestionById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }
    await this.getQuiz(question.quizId, adminId);
    return this.repository.updateQuestion(questionId, input);
  }

  async deleteQuestion(questionId: string, adminId: string) {
    const question = await this.repository.findQuestionById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }
    await this.getQuiz(question.quizId, adminId);
    return this.repository.deleteQuestion(questionId);
  }

  async reorderQuestions(adminId: string, input: ReorderQuestionsInput) {
    await this.getQuiz(input.quizId, adminId);
    await this.repository.reorderQuestions(input.orders);
    return this.getQuiz(input.quizId, adminId);
  }

  async createOption(questionId: string, adminId: string, input: CreateOptionInput) {
    const question = await this.repository.findQuestionById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }
    await this.getQuiz(question.quizId, adminId);
    return this.repository.createOption(questionId, input);
  }

  async readOptions(questionId: string) {
    const question = await this.repository.findQuestionById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }
    return this.repository.findOptionsByQuestionId(questionId);
  }

  async updateOption(optionId: string, adminId: string, input: UpdateOptionInput) {
    const option = await this.repository.findOptionById(optionId);
    if (!option) {
      throw new NotFoundError("Option not found");
    }
    await this.getQuiz(option.question.quizId, adminId);
    return this.repository.updateOption(optionId, input);
  }

  async deleteOption(optionId: string, adminId: string) {
    const option = await this.repository.findOptionById(optionId);
    if (!option) {
      throw new NotFoundError("Option not found");
    }
    await this.getQuiz(option.question.quizId, adminId);
    return this.repository.deleteOption(optionId);
  }
}

export const quizService = new QuizService();
