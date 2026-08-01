"use client";

import { useCallback } from "react";
import { usePolling, type UsePollingOptions } from "./usePolling";
import {
  getPlayerSessionStateApi,
  getSessionApi,
  getLeaderboardApi,
  type PlayerSessionStateResponse,
  type GameSessionFull,
  type LeaderboardEntry,
} from "../lib/api-client";

export function usePlayerSessionStatePolling(
  sessionId: string | null,
  options: UsePollingOptions<PlayerSessionStateResponse> = {}
) {
  const { enabled = true, intervalMs = 1500, ...restOptions } = options;

  const fetcher = useCallback(
    (signal?: AbortSignal) => {
      if (!sessionId) return Promise.reject(new Error("No sessionId provided"));
      return getPlayerSessionStateApi(sessionId, { signal });
    },
    [sessionId]
  );

  return usePolling<PlayerSessionStateResponse>(fetcher, {
    ...restOptions,
    enabled: enabled && !!sessionId,
    intervalMs,
  });
}

export function useHostSessionPolling(
  sessionId: string | null,
  options: UsePollingOptions<GameSessionFull> = {}
) {
  const { enabled = true, intervalMs = 2000, ...restOptions } = options;

  const fetcher = useCallback(
    (signal?: AbortSignal) => {
      if (!sessionId) return Promise.reject(new Error("No sessionId provided"));
      return getSessionApi(sessionId, { signal });
    },
    [sessionId]
  );

  return usePolling<GameSessionFull>(fetcher, {
    ...restOptions,
    enabled: enabled && !!sessionId,
    intervalMs,
  });
}

export function useLeaderboardPolling(
  sessionId: string | null,
  options: UsePollingOptions<LeaderboardEntry[]> = {}
) {
  const { enabled = true, intervalMs = 3000, ...restOptions } = options;

  const fetcher = useCallback(
    (signal?: AbortSignal) => {
      if (!sessionId) return Promise.reject(new Error("No sessionId provided"));
      return getLeaderboardApi(sessionId, { signal });
    },
    [sessionId]
  );

  return usePolling<LeaderboardEntry[]>(fetcher, {
    ...restOptions,
    enabled: enabled && !!sessionId,
    intervalMs,
  });
}
