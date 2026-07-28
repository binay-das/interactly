import type { SubmitAnswerInput } from "@repo/validation";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { GameplayRepository, gameplayRepository } from "./gameplay.repository.js";

export class GameplayService {
  constructor(private readonly repository: GameplayRepository = gameplayRepository) {}

  async submitAnswer(input: SubmitAnswerInput) {
    const session = await this.repository.findSessionById(input.sessionId);
    if (!session) {
      throw new NotFoundError("Game session not found");
    }

    if (session.state !== "QUESTION") {
      throw new BadRequestError(`Cannot submit answers when session is in state: ${session.state}`);
    }

    if (session.currentQuestionId && session.currentQuestionId !== input.questionId) {
      throw new BadRequestError("Submitted answer does not match the active question");
    }

    if (session.questionEndsAt && new Date() > session.questionEndsAt) {
      throw new BadRequestError("Question deadline has passed");
    }

    const existingAnswer = await this.repository.findExistingAnswer(
      input.sessionId,
      input.participantId,
      input.questionId
    );
    if (existingAnswer) {
      throw new ConflictError("Answer has already been submitted for this question");
    }

    const participant = await this.repository.findParticipantById(input.participantId);
    if (!participant) {
      throw new NotFoundError("Participant not found");
    }

    const question = await this.repository.findQuestionById(input.questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }

    const option = await this.repository.findOptionById(input.selectedOptionId);
    if (!option || option.questionId !== input.questionId) {
      throw new BadRequestError("Invalid option selected for this question");
    }

    const isCorrect = option.isCorrect;
    let pointsAwarded = 0;

    if (isCorrect) {
      const maxPoints = question.points ?? 1000;
      const timeLimitMs = (question.timeLimit ?? 20) * 1000;
      const speedRatio = Math.max(0, 1 - (input.responseTimeMs / timeLimitMs) * 0.5);
      pointsAwarded = Math.round(maxPoints * speedRatio);
    }

    const newStreak = isCorrect ? participant.streak + 1 : 0;
    const newMaxStreak = Math.max(participant.maxStreak, newStreak);
    const newScore = participant.score + pointsAwarded;

    const { answer } = await this.repository.submitAnswerTx({
      sessionId: input.sessionId,
      participantId: input.participantId,
      questionId: input.questionId,
      selectedOptionId: input.selectedOptionId,
      isCorrect,
      pointsAwarded,
      responseTimeMs: input.responseTimeMs,
      newScore,
      newStreak,
      newMaxStreak,
    });

    return {
      answerId: answer.id,
      isCorrect,
      pointsAwarded,
      currentScore: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
    };
  }

  async getLeaderboard(sessionId: string) {
    const session = await this.repository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError("Game session not found");
    }

    const participants = await this.repository.getLeaderboard(sessionId);
    return participants.map((p, index) => ({
      rank: index + 1,
      id: p.id,
      nickname: p.nickname,
      score: p.score,
      streak: p.streak,
      maxStreak: p.maxStreak,
    }));
  }

  async getFinalResults(sessionId: string) {
    const leaderboard = await this.getLeaderboard(sessionId);
    return {
      sessionId,
      totalParticipants: leaderboard.length,
      rankings: leaderboard,
    };
  }

  async getAnalytics(sessionId: string, hostId?: string) {
    const session = await this.repository.getSessionWithAnswersAndQuestions(sessionId);
    if (!session) {
      throw new NotFoundError("Game session not found");
    }

    if (hostId && session.hostId !== hostId) {
      throw new ForbiddenError("Only the host can view detailed game analytics");
    }

    const totalParticipants = session.participants.length;
    const totalAnswers = session.answers.length;
    const overallAverageResponseTime =
      totalAnswers > 0
        ? Math.round(session.answers.reduce((acc, a) => acc + a.responseTimeMs, 0) / totalAnswers)
        : 0;

    const questionStats = session.quiz.questions.map((q) => {
      const questionAnswers = session.answers.filter((a) => a.questionId === q.id);
      const totalQAnswers = questionAnswers.length;
      const correctCount = questionAnswers.filter((a) => a.isCorrect).length;
      const accuracyPercentage = totalQAnswers > 0 ? Math.round((correctCount / totalQAnswers) * 100) : 0;
      const avgResponseTime =
        totalQAnswers > 0
          ? Math.round(questionAnswers.reduce((acc, a) => acc + a.responseTimeMs, 0) / totalQAnswers)
          : 0;

      const optionDistribution = q.options.map((opt) => ({
        optionId: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        count: questionAnswers.filter((a) => a.selectedOptionId === opt.id).length,
      }));

      return {
        questionId: q.id,
        questionText: q.text,
        totalAnswers: totalQAnswers,
        correctAnswers: correctCount,
        accuracyPercentage,
        averageResponseTimeMs: avgResponseTime,
        optionDistribution,
      };
    });

    const finalRankings = session.participants.map((p, idx) => ({
      rank: idx + 1,
      participantId: p.id,
      nickname: p.nickname,
      score: p.score,
      streak: p.streak,
      maxStreak: p.maxStreak,
    }));

    return {
      sessionId: session.id,
      quizTitle: session.quiz.title,
      sessionState: session.state,
      totalParticipants,
      totalAnswersSubmitted: totalAnswers,
      overallAverageResponseTimeMs: overallAverageResponseTime,
      questionStats,
      finalRankings,
    };
  }
}

export const gameplayService = new GameplayService();
