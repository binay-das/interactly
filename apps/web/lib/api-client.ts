import type {
  AdminLoginRequest,
  AdminLoginResponse,
  ApiResponse,
  AuthUser,
  CreateQuizDTO,
  QuestionDetails,
  QuestionOption,
  QuizDetails,
  UpdateQuizDTO,
} from "@repo/types";
import type {
  AdminRegisterInput,
  CreateOptionInput,
  CreateQuestionInput,
  UpdateOptionInput,
  UpdateQuestionInput,
} from "@repo/validation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string = "API_ERROR", details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  let data: ApiResponse<T>;
  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      `Network response was not valid JSON (${response.status} ${response.statusText})`,
      "NETWORK_ERROR"
    );
  }

  if (!response.ok || !data.success) {
    const errorMsg = data.error?.message || `Request failed with status ${response.status}`;
    const errorCode = data.error?.code || `HTTP_${response.status}`;
    throw new ApiError(errorMsg, errorCode, data.error?.details);
  }

  return data.data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};

export async function loginApi(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
  return apiClient.post<AdminLoginResponse>("/auth/login", credentials);
}

export async function registerApi(data: AdminRegisterInput): Promise<AdminLoginResponse> {
  return apiClient.post<AdminLoginResponse>("/auth/register", data);
}

export async function logoutApi(): Promise<void> {
  await apiClient.post<{ message: string }>("/auth/logout");
}

export async function getMeApi(): Promise<AuthUser> {
  const result = await apiClient.get<{ user: AuthUser }>("/auth/me");
  return result.user;
}

export interface PaginatedQuizzesResponse {
  quizzes: QuizDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function listQuizzesApi(page = 1, limit = 50): Promise<PaginatedQuizzesResponse> {
  return apiClient.get<PaginatedQuizzesResponse>(`/quizzes?page=${page}&limit=${limit}`);
}

export async function createQuizApi(data: CreateQuizDTO): Promise<QuizDetails> {
  return apiClient.post<QuizDetails>("/quizzes", data);
}

export async function getQuizApi(id: string): Promise<QuizDetails> {
  return apiClient.get<QuizDetails>(`/quizzes/${id}`);
}

export async function updateQuizApi(id: string, data: UpdateQuizDTO): Promise<QuizDetails> {
  return apiClient.patch<QuizDetails>(`/quizzes/${id}`, data);
}

export async function deleteQuizApi(id: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/quizzes/${id}`);
}

export async function publishQuizApi(id: string): Promise<QuizDetails> {
  return apiClient.post<QuizDetails>(`/quizzes/${id}/publish`);
}

export async function archiveQuizApi(id: string): Promise<QuizDetails> {
  return apiClient.post<QuizDetails>(`/quizzes/${id}/archive`);
}

export async function addQuestionApi(
  quizId: string,
  input: CreateQuestionInput
): Promise<QuestionDetails> {
  return apiClient.post<QuestionDetails>(`/quizzes/${quizId}/questions`, input);
}

export async function editQuestionApi(
  questionId: string,
  input: UpdateQuestionInput
): Promise<QuestionDetails> {
  return apiClient.patch<QuestionDetails>(`/quizzes/questions/${questionId}`, input);
}

export async function deleteQuestionApi(questionId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/quizzes/questions/${questionId}`);
}

export async function reorderQuestionsApi(
  quizId: string,
  orders: { questionId: string; newOrder: number }[]
): Promise<QuizDetails> {
  return apiClient.post<QuizDetails>(`/quizzes/${quizId}/questions/reorder`, { orders });
}

export async function createOptionApi(
  questionId: string,
  input: CreateOptionInput
): Promise<QuestionOption> {
  return apiClient.post<QuestionOption>(`/quizzes/questions/${questionId}/options`, input);
}

export async function updateOptionApi(
  optionId: string,
  input: UpdateOptionInput
): Promise<QuestionOption> {
  return apiClient.patch<QuestionOption>(`/quizzes/options/${optionId}`, input);
}

export async function deleteOptionApi(optionId: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/quizzes/options/${optionId}`);
}

export interface SessionParticipant {
  id: string;
  nickname: string;
  score: number;
  joinedAt?: string;
}

export interface GameSessionFull {
  id: string;
  quizId: string;
  hostId: string;
  joinCode: string;
  state: "LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED";
  currentQuestionId?: string | null;
  questionStartedAt?: string | null;
  questionEndsAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt: string;
  quiz?: QuizDetails;
  participants?: SessionParticipant[];
  host?: { id: string; email: string };
}

export async function createSessionApi(quizId: string): Promise<GameSessionFull> {
  return apiClient.post<GameSessionFull>("/sessions", { quizId });
}

export async function getSessionApi(id: string): Promise<GameSessionFull> {
  return apiClient.get<GameSessionFull>(`/sessions/${id}`);
}

export async function startQuizSessionApi(id: string): Promise<GameSessionFull> {
  return apiClient.post<GameSessionFull>(`/sessions/${id}/start`);
}

export async function endQuizSessionApi(id: string): Promise<GameSessionFull> {
  return apiClient.post<GameSessionFull>(`/sessions/${id}/end`);
}

export interface JoinPlayerResponse {
  participantId: string;
  nickname: string;
  sessionId: string;
  reconnectToken: string;
  sessionState: "LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED";
}

export interface ReconnectPlayerResponse {
  participant: {
    id: string;
    nickname: string;
    score: number;
    streak: number;
    maxStreak: number;
    reconnectToken: string;
  };
  sessionState: "LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED";
  quizTitle: string;
}

export interface PlayerSessionStateResponse {
  sessionId: string;
  state: "LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED";
  currentQuestionId?: string | null;
  questionStartedAt?: string | null;
  questionEndsAt?: string | null;
}

export interface SubmitAnswerResponse {
  answerId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  currentScore: number;
  streak: number;
  maxStreak: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  nickname: string;
  score: number;
  streak: number;
  maxStreak: number;
}

export interface FinalResultsResponse {
  sessionId: string;
  totalParticipants: number;
  rankings: LeaderboardEntry[];
}

export async function joinPlayerApi(input: { joinCode: string; nickname: string }): Promise<JoinPlayerResponse> {
  return apiClient.post<JoinPlayerResponse>("/players/join", input);
}

export async function reconnectPlayerApi(input: { reconnectToken: string; sessionId: string }): Promise<ReconnectPlayerResponse> {
  return apiClient.post<ReconnectPlayerResponse>("/players/reconnect", input);
}

export async function getPlayerSessionStateApi(sessionId: string): Promise<PlayerSessionStateResponse> {
  return apiClient.get<PlayerSessionStateResponse>(`/players/session/${sessionId}/state`);
}

export async function submitAnswerApi(input: {
  sessionId: string;
  participantId: string;
  questionId: string;
  selectedOptionId: string;
  responseTimeMs: number;
}): Promise<SubmitAnswerResponse> {
  return apiClient.post<SubmitAnswerResponse>("/gameplay/answer", input);
}

export async function getLeaderboardApi(sessionId: string): Promise<LeaderboardEntry[]> {
  return apiClient.get<LeaderboardEntry[]>(`/gameplay/session/${sessionId}/leaderboard`);
}

export async function getFinalResultsApi(sessionId: string): Promise<FinalResultsResponse> {
  return apiClient.get<FinalResultsResponse>(`/gameplay/session/${sessionId}/results`);
}
