import type { ID, ISODateString, Nullable } from "./common.js";

export enum QuizStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface QuestionOption {
  id: ID;
  text: string;
  order: number;
  isCorrect?: boolean;
}

export interface QuestionDetails {
  id: ID;
  text: string;
  order: number;
  timeLimit: number;
  points: number;
  quizId: ID;
  options: QuestionOption[];
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface QuizSummary {
  id: ID;
  title: string;
  description: Nullable<string>;
  status: QuizStatus;
  createdById: ID;
  totalQuestions: number;
  totalSessions?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface QuizDetails extends QuizSummary {
  questions: QuestionDetails[];
}

export interface QuizStatistics {
  quizId: ID;
  totalPlays: number;
  totalParticipants: number;
  averageScore: number;
  completionRate: number;
  hardestQuestionId?: Nullable<ID>;
  easiestQuestionId?: Nullable<ID>;
}
