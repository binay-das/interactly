import type { ID, ISODateString } from "./common.js";

export interface PlayerInfo {
  id: ID;
  nickname: string;
  sessionId: ID;
  score: number;
  streak: number;
  maxStreak: number;
  joinedAt?: ISODateString;
  lastSeenAt?: ISODateString;
}

export interface ParticipantSummary {
  id: ID;
  nickname: string;
  score: number;
  rank?: number;
  isOnline?: boolean;
}

export interface PlayerAnswer {
  id: ID;
  participantId: ID;
  sessionId: ID;
  questionId: ID;
  selectedOptionId: ID;
  isCorrect: boolean;
  pointsAwarded: number;
  responseTimeMs: number;
  answeredAt: ISODateString;
}

export interface ReconnectPayload {
  reconnectToken: string;
  sessionId: ID;
  participantId?: ID;
}
