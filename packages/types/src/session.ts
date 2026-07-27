import type { ID, ISODateString, Nullable } from "./common.js";
import type { QuestionOption } from "./quiz.js";

export enum SessionState {
  LOBBY = "LOBBY",
  QUESTION = "QUESTION",
  REVEAL = "REVEAL",
  LEADERBOARD = "LEADERBOARD",
  FINISHED = "FINISHED",
}

export interface SessionSummary {
  id: ID;
  joinCode: string;
  state: SessionState;
  quizId: ID;
  quizTitle?: string;
  hostId: ID;
  participantCount: number;
  createdAt: ISODateString;
  startedAt: Nullable<ISODateString>;
  finishedAt: Nullable<ISODateString>;
}

export interface CurrentQuestion {
  id: ID;
  text: string;
  order: number;
  totalQuestions: number;
  timeLimit: number;
  points: number;
  options: Omit<QuestionOption, "isCorrect">[];
  startedAt?: ISODateString;
  endsAt?: ISODateString;
}

export interface SessionStatus {
  sessionId: ID;
  state: SessionState;
  currentQuestionId: Nullable<ID>;
  questionStartedAt: Nullable<ISODateString>;
  questionEndsAt: Nullable<ISODateString>;
  participantCount: number;
}

export interface QuestionReveal {
  questionId: ID;
  correctOptionId: ID;
  explanation?: string;
  totalAnswersSubmitted: number;
}

export interface GameProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  percentageCompleted: number;
  state: SessionState;
}
