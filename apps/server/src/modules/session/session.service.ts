import type { SessionState } from "@repo/db";
import type { CreateSessionInput } from "@repo/validation";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { generateJoinCode } from "../../utils/joinCode.js";
import { QuizRepository, quizRepository } from "../quiz/quiz.repository.js";
import { SessionRepository, sessionRepository } from "./session.repository.js";

export class SessionService {
  constructor(
    private readonly repository: SessionRepository = sessionRepository,
    private readonly quizRepo: QuizRepository = quizRepository
  ) {}

  async createSession(hostId: string, input: CreateSessionInput) {
    const quiz = await this.quizRepo.findById(input.quizId);
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }

    if (quiz.status !== "PUBLISHED") {
      throw new BadRequestError("Only published quizzes can be used to create game sessions");
    }

    let joinCode = generateJoinCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await this.repository.findByJoinCode(joinCode);
      if (!existing) break;
      joinCode = generateJoinCode();
      attempts++;
    }

    if (attempts >= 10) {
      throw new BadRequestError("Failed to generate a unique join code. Please try again.");
    }

    return this.repository.createSession({
      quizId: input.quizId,
      hostId,
      joinCode,
    });
  }

  async getSession(id: string) {
    const session = await this.repository.findById(id);
    if (!session) {
      throw new NotFoundError("Game session not found");
    }
    return session;
  }

  async startQuiz(sessionId: string, hostId: string) {
    const session = await this.getSession(sessionId);

    if (session.hostId !== hostId) {
      throw new ForbiddenError("Only the session host can start the quiz");
    }

    if (session.state !== "LOBBY") {
      throw new BadRequestError(`Cannot start quiz from session state: ${session.state}`);
    }

    const firstQuestion = session.quiz.questions[0];
    if (!firstQuestion) {
      throw new BadRequestError("Quiz contains no questions");
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + firstQuestion.timeLimit * 1000);

    return this.repository.updateSessionState(sessionId, {
      state: "QUESTION",
      currentQuestionId: firstQuestion.id,
      questionStartedAt: now,
      questionEndsAt: endsAt,
      startedAt: now,
    });
  }

  async advanceState(sessionId: string, hostId: string, targetState?: string, questionId?: string) {
    const session = await this.getSession(sessionId);

    if (session.hostId !== hostId) {
      throw new ForbiddenError("Only the session host can control session state");
    }

    const questions = session.quiz.questions;
    const currentIndex = questions.findIndex((q) => q.id === session.currentQuestionId);

    let nextState: SessionState = session.state;
    let nextQuestionId: string | null | undefined = session.currentQuestionId;
    let questionStartedAt: Date | null | undefined = session.questionStartedAt;
    let questionEndsAt: Date | null | undefined = session.questionEndsAt;

    if (targetState) {
      nextState = targetState as SessionState;
      if (questionId !== undefined) {
        nextQuestionId = questionId;
      }
      if (nextState === "QUESTION" && nextQuestionId) {
        const q = questions.find((item) => item.id === nextQuestionId);
        const limit = q ? q.timeLimit : 20;
        const now = new Date();
        questionStartedAt = now;
        questionEndsAt = new Date(now.getTime() + limit * 1000);
      }
    } else {
      if (session.state === "LOBBY") {
        nextState = "QUESTION";
        const firstQ = questions[0];
        if (firstQ) {
          nextQuestionId = firstQ.id;
          const now = new Date();
          questionStartedAt = now;
          questionEndsAt = new Date(now.getTime() + firstQ.timeLimit * 1000);
        }
      } else if (session.state === "QUESTION") {
        nextState = "REVEAL";
      } else if (session.state === "REVEAL") {
        nextState = "LEADERBOARD";
      } else if (session.state === "LEADERBOARD") {
        const nextQ = questions[currentIndex + 1];
        if (nextQ) {
          nextState = "QUESTION";
          nextQuestionId = nextQ.id;
          const now = new Date();
          questionStartedAt = now;
          questionEndsAt = new Date(now.getTime() + nextQ.timeLimit * 1000);
        } else {
          nextState = "FINISHED";
        }
      }
    }

    return this.repository.updateSessionState(sessionId, {
      state: nextState,
      currentQuestionId: nextQuestionId,
      questionStartedAt,
      questionEndsAt,
      finishedAt: nextState === "FINISHED" ? new Date() : null,
    });
  }

  async endQuiz(sessionId: string, hostId: string) {
    const session = await this.getSession(sessionId);

    if (session.hostId !== hostId) {
      throw new ForbiddenError("Only the session host can end the quiz");
    }

    if (session.state === "FINISHED") {
      throw new BadRequestError("Quiz session is already finished");
    }

    return this.repository.updateSessionState(sessionId, {
      state: "FINISHED",
      finishedAt: new Date(),
    });
  }
}

export const sessionService = new SessionService();
