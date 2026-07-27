import type { ID } from "./common.js";
import type { ParticipantSummary } from "./player.js";

export interface LeaderboardEntry {
  participantId: ID;
  nickname: string;
  score: number;
  rank: number;
  streak: number;
  previousRank?: number;
  scoreGained?: number;
}

export interface LeaderboardResponse {
  sessionId: ID;
  questionId?: ID;
  topParticipants: LeaderboardEntry[];
  totalParticipants: number;
}

export interface FinalResults {
  sessionId: ID;
  quizId: ID;
  quizTitle: string;
  totalParticipants: number;
  totalQuestions: number;
  winners: LeaderboardEntry[];
  fullLeaderboard: LeaderboardEntry[];
}

export interface AnswerDistribution {
  questionId: ID;
  optionCounts: Record<ID, number>;
  totalAnswers: number;
  correctAnswerCount: number;
}

export interface PlayerRanking {
  participant: ParticipantSummary;
  rank: number;
  totalParticipants: number;
  percentile: number;
}
