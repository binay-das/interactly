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
