import { db, type GameSession, type SessionState, type Quiz, type Question, type QuestionOption, type Participant } from "@repo/db";

export type SessionWithQuizFull = GameSession & {
  quiz: Quiz & {
    questions: (Question & { options: QuestionOption[] })[];
  };
  host?: { id: string; email: string };
  participants?: Participant[];
};

export class SessionRepository {
  async findById(id: string): Promise<SessionWithQuizFull | null> {
    return db.gameSession.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            questions: {
              include: { options: true },
              orderBy: { order: "asc" },
            },
          },
        },
        host: {
          select: { id: true, email: true },
        },
        participants: {
          orderBy: { score: "desc" },
        },
      },
    });
  }

  async findByJoinCode(joinCode: string): Promise<SessionWithQuizFull | null> {
    return db.gameSession.findUnique({
      where: { joinCode },
      include: {
        quiz: {
          include: {
            questions: {
              include: { options: true },
              orderBy: { order: "asc" },
            },
          },
        },
        participants: true,
      },
    });
  }

  async createSession(data: { quizId: string; hostId: string; joinCode: string }): Promise<GameSession> {
    return db.gameSession.create({
      data: {
        quizId: data.quizId,
        hostId: data.hostId,
        joinCode: data.joinCode,
        state: "LOBBY",
      },
      include: {
        quiz: true,
        host: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async updateSessionState(
    id: string,
    data: {
      state: SessionState;
      currentQuestionId?: string | null;
      questionStartedAt?: Date | null;
      questionEndsAt?: Date | null;
      startedAt?: Date | null;
      finishedAt?: Date | null;
    }
  ): Promise<SessionWithQuizFull> {
    return db.gameSession.update({
      where: { id },
      data,
      include: {
        quiz: {
          include: {
            questions: {
              include: { options: true },
              orderBy: { order: "asc" },
            },
          },
        },
        participants: true,
      },
    });
  }
}

export const sessionRepository = new SessionRepository();
