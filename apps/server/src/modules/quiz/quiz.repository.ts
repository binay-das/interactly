import { db, type Prisma, type Quiz, type Question, type QuestionOption } from "@repo/db";

export type QuizWithQuestions = Quiz & {
  questions: (Question & { options: QuestionOption[] })[];
};

export type OptionWithQuestionQuiz = QuestionOption & {
  question: Question & { quiz: Quiz };
};

export class QuizRepository {
  async create(data: {
    title: string;
    description?: string | null;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdById: string;
    questions?: {
      text: string;
      order: number;
      timeLimit?: number;
      points?: number;
      options: { text: string; order: number; isCorrect: boolean }[];
    }[];
  }): Promise<QuizWithQuestions> {
    return db.quiz.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? "DRAFT",
        createdById: data.createdById,
        questions: data.questions
          ? {
            create: data.questions.map((q) => ({
              text: q.text,
              order: q.order,
              timeLimit: q.timeLimit ?? 20,
              points: q.points ?? 1000,
              options: {
                create: q.options.map((o) => ({
                  text: o.text,
                  order: o.order,
                  isCorrect: o.isCorrect,
                })),
              },
            })),
          }
          : undefined,
      },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  async findAllByAdminId(adminId: string, skip: number, take: number): Promise<[QuizWithQuestions[], number]> {
    const [quizzes, total] = await Promise.all([
      db.quiz.findMany({
        where: { createdById: adminId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          questions: {
            include: { options: true },
            orderBy: { order: "asc" },
          },
        },
      }),
      db.quiz.count({ where: { createdById: adminId } }),
    ]);

    return [quizzes, total];
  }

  async findById(id: string): Promise<QuizWithQuestions | null> {
    return db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  async update(id: string, data: Prisma.QuizUpdateInput): Promise<QuizWithQuestions> {
    return db.quiz.update({
      where: { id },
      data,
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  async delete(id: string): Promise<Quiz> {
    return db.$transaction(async (tx) => {
      await tx.gameSession.deleteMany({
        where: { quizId: id },
      });
      return tx.quiz.delete({
        where: { id },
      });
    });
  }

  async findQuestionById(questionId: string): Promise<(Question & { options: QuestionOption[]; quiz: Quiz }) | null> {
    return db.question.findUnique({
      where: { id: questionId },
      include: { options: true, quiz: true },
    });
  }

  async createQuestion(
    quizId: string,
    data: {
      text: string;
      order: number;
      timeLimit?: number;
      points?: number;
      options: { text: string; order: number; isCorrect: boolean }[];
    }
  ): Promise<Question & { options: QuestionOption[] }> {
    return db.question.create({
      data: {
        quizId,
        text: data.text,
        order: data.order,
        timeLimit: data.timeLimit ?? 20,
        points: data.points ?? 1000,
        options: {
          create: data.options.map((o) => ({
            text: o.text,
            order: o.order,
            isCorrect: o.isCorrect,
          })),
        },
      },
      include: { options: true },
    });
  }

  async updateQuestion(
    questionId: string,
    data: {
      text?: string;
      order?: number;
      timeLimit?: number;
      points?: number;
      options?: { id?: string; text: string; order: number; isCorrect: boolean }[];
    }
  ): Promise<Question & { options: QuestionOption[] }> {
    return db.$transaction(async (tx) => {
      if (data.options) {
        await tx.questionOption.deleteMany({
          where: { questionId },
        });
      }

      return tx.question.update({
        where: { id: questionId },
        data: {
          text: data.text,
          order: data.order,
          timeLimit: data.timeLimit,
          points: data.points,
          options: data.options
            ? {
              create: data.options.map((o) => ({
                text: o.text,
                order: o.order,
                isCorrect: o.isCorrect,
              })),
            }
            : undefined,
        },
        include: { options: true },
      });
    });
  }

  async deleteQuestion(questionId: string): Promise<Question> {
    return db.question.delete({
      where: { id: questionId },
    });
  }

  async reorderQuestions(orders: { questionId: string; newOrder: number }[]): Promise<void> {
    await db.$transaction(
      orders.map((item) =>
        db.question.update({
          where: { id: item.questionId },
          data: { order: item.newOrder },
        })
      )
    );
  }

  async createOption(
    questionId: string,
    data: { text: string; order: number; isCorrect: boolean }
  ): Promise<QuestionOption> {
    return db.questionOption.create({
      data: {
        questionId,
        text: data.text,
        order: data.order,
        isCorrect: data.isCorrect,
      },
    });
  }

  async findOptionById(optionId: string): Promise<OptionWithQuestionQuiz | null> {
    return db.questionOption.findUnique({
      where: { id: optionId },
      include: { question: { include: { quiz: true } } },
    });
  }

  async findOptionsByQuestionId(questionId: string): Promise<QuestionOption[]> {
    return db.questionOption.findMany({
      where: { questionId },
      orderBy: { order: "asc" },
    });
  }

  async updateOption(
    optionId: string,
    data: { text?: string; order?: number; isCorrect?: boolean }
  ): Promise<QuestionOption> {
    return db.questionOption.update({
      where: { id: optionId },
      data,
    });
  }

  async deleteOption(optionId: string): Promise<QuestionOption> {
    return db.questionOption.delete({
      where: { id: optionId },
    });
  }
}

export const quizRepository = new QuizRepository();
