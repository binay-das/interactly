import type { ID, Nullable } from "./common.js";
import type { QuizStatus } from "./quiz.js";
import type { AuthUser } from "./auth.js";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface CreateOptionDTO {
  text: string;
  order: number;
  isCorrect: boolean;
}

export interface CreateQuestionDTO {
  text: string;
  order: number;
  timeLimit?: number;
  points?: number;
  options: CreateOptionDTO[];
}

export interface UpdateQuestionDTO {
  id?: ID;
  text?: string;
  order?: number;
  timeLimit?: number;
  points?: number;
  options?: CreateOptionDTO[];
}

export interface CreateQuizDTO {
  title: string;
  description?: string;
  status?: QuizStatus;
  questions?: CreateQuestionDTO[];
}

export interface UpdateQuizDTO {
  title?: string;
  description?: Nullable<string>;
  status?: QuizStatus;
  questions?: UpdateQuestionDTO[];
}

export interface JoinSessionDTO {
  joinCode: string;
  nickname: string;
}

export interface SubmitAnswerDTO {
  sessionId: ID;
  participantId: ID;
  questionId: ID;
  selectedOptionId: ID;
  responseTimeMs: number;
}

export interface CreateSessionDTO {
  quizId: ID;
}
