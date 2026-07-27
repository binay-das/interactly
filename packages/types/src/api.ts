import type { ISODateString } from "./common.js";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | unknown;
  status?: number;
  timestamp?: ISODateString;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: Record<string, unknown>;
  timestamp?: ISODateString;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
