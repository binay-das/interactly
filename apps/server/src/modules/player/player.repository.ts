import { db, type GameSession, type Participant } from "@repo/db";

export type SessionWithQuizTitle = GameSession & {
  quiz: { title: string };
};

export class PlayerRepository {
  async findSessionByJoinCode(joinCode: string): Promise<GameSession | null> {
    return db.gameSession.findUnique({
      where: { joinCode },
    });
  }

  async findSessionById(sessionId: string): Promise<SessionWithQuizTitle | null> {
    return db.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: {
          select: { title: true },
        },
      },
    });
  }

  async createParticipant(data: {
    nickname: string;
    sessionId: string;
    reconnectToken: string;
  }): Promise<Participant> {
    return db.participant.create({
      data: {
        nickname: data.nickname,
        sessionId: data.sessionId,
        reconnectToken: data.reconnectToken,
        score: 0,
        streak: 0,
        maxStreak: 0,
      },
    });
  }

  async findByReconnectToken(reconnectToken: string, sessionId: string): Promise<Participant | null> {
    return db.participant.findFirst({
      where: {
        reconnectToken,
        sessionId,
      },
    });
  }

  async findById(id: string): Promise<Participant | null> {
    return db.participant.findUnique({
      where: { id },
    });
  }

  async updateLastSeen(id: string): Promise<Participant> {
    return db.participant.update({
      where: { id },
      data: {
        lastSeenAt: new Date(),
      },
    });
  }
}

export const playerRepository = new PlayerRepository();
