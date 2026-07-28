import { randomUUID } from "node:crypto";
import type { JoinSessionInput, ReconnectInput } from "@repo/validation";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { PlayerRepository, playerRepository } from "./player.repository.js";

export class PlayerService {
  constructor(private readonly repository: PlayerRepository = playerRepository) {}

  async joinSession(input: JoinSessionInput) {
    const session = await this.repository.findSessionByJoinCode(input.joinCode);
    if (!session) {
      throw new NotFoundError("Game session not found with the provided join code");
    }

    if (session.state === "FINISHED") {
      throw new BadRequestError("Cannot join a game session that has already finished");
    }

    const reconnectToken = `rec_${randomUUID()}`;

    const participant = await this.repository.createParticipant({
      nickname: input.nickname,
      sessionId: session.id,
      reconnectToken,
    });

    return {
      participantId: participant.id,
      nickname: participant.nickname,
      sessionId: session.id,
      reconnectToken: participant.reconnectToken,
      sessionState: session.state,
    };
  }

  async reconnect(input: ReconnectInput) {
    const participant = await this.repository.findByReconnectToken(input.reconnectToken, input.sessionId);
    if (!participant) {
      throw new NotFoundError("Participant session not found or reconnect token is invalid");
    }

    await this.repository.updateLastSeen(participant.id);

    const session = await this.repository.findSessionById(input.sessionId);
    if (!session) {
      throw new NotFoundError("Associated game session not found");
    }

    return {
      participant,
      sessionState: session.state,
      quizTitle: session.quiz.title,
    };
  }

  async getSessionState(sessionId: string) {
    const session = await this.repository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError("Game session not found");
    }
    return {
      sessionId: session.id,
      state: session.state,
      currentQuestionId: session.currentQuestionId,
      questionStartedAt: session.questionStartedAt,
      questionEndsAt: session.questionEndsAt,
    };
  }

  async heartbeat(participantId: string, reconnectToken: string) {
    const participant = await this.repository.findById(participantId);
    if (!participant || participant.reconnectToken !== reconnectToken) {
      throw new NotFoundError("Invalid participant session");
    }

    const updated = await this.repository.updateLastSeen(participantId);
    return {
      participantId: updated.id,
      lastSeenAt: updated.lastSeenAt,
    };
  }
}

export const playerService = new PlayerService();
