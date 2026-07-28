import { db, type Answer, type GameSession, type Participant, type QuestionOption, type Question } from "@repo/db";

export class GameplayRepository {
  async findSessionById(sessionId: string): Promise<GameSession | null> {
    return db.gameSession.findUnique({
      where: { id: sessionId },
    });
  }

  async findQuestionById(questionId: string): Promise<Question | null> {
    return db.question.findUnique({
      where: { id: questionId },
    });
  }

  async findOptionById(optionId: string): Promise<QuestionOption | null> {
    return db.questionOption.findUnique({
      where: { id: optionId },
    });
  }

  async findExistingAnswer(sessionId: string, participantId: string, questionId: string): Promise<Answer | null> {
    return db.answer.findUnique({
      where: {
        sessionId_participantId_questionId: {
          sessionId,
          participantId,
          questionId,
        },
      },
    });
  }

  async findParticipantById(participantId: string): Promise<Participant | null> {
    return db.participant.findUnique({
      where: { id: participantId },
    });
  }

  async submitAnswerTx(data: {
    sessionId: string;
    participantId: string;
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    pointsAwarded: number;
    responseTimeMs: number;
    newScore: number;
    newStreak: number;
    newMaxStreak: number;
  }): Promise<{ answer: Answer; participant: Participant }> {
    return db.$transaction(async (tx) => {
      const answer = await tx.answer.create({
        data: {
          sessionId: data.sessionId,
          participantId: data.participantId,
          questionId: data.questionId,
          selectedOptionId: data.selectedOptionId,
          isCorrect: data.isCorrect,
          pointsAwarded: data.pointsAwarded,
          responseTimeMs: data.responseTimeMs,
        },
      });

      const participant = await tx.participant.update({
        where: { id: data.participantId },
        data: {
          score: data.newScore,
          streak: data.newStreak,
          maxStreak: data.newMaxStreak,
        },
      });

      return { answer, participant };
    });
  }

  async getLeaderboard(sessionId: string): Promise<Participant[]> {
    return db.participant.findMany({
      where: { sessionId },
      orderBy: [{ score: "desc" }, { lastSeenAt: "asc" }],
      select: {
        id: true,
        nickname: true,
        score: true,
        streak: true,
        maxStreak: true,
        sessionId: true,
        reconnectToken: true,
        joinedAt: true,
        lastSeenAt: true,
      },
    });
  }

  async getSessionWithAnswersAndQuestions(sessionId: string) {
    return db.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                options: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
        participants: {
          orderBy: { score: "desc" },
        },
        answers: {
          include: {
            selectedOption: true,
          },
        },
      },
    });
  }
}

export const gameplayRepository = new GameplayRepository();
