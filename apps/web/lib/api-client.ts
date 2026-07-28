import type { AdminLoginRequest, AdminLoginResponse, ApiResponse, AuthUser } from "@repo/types";
import type { AdminRegisterInput } from "@repo/validation";

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
