"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UsePollingOptions<T> {
  intervalMs?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

export interface UsePollingReturn<T> {
  data: T | null;
  error: unknown | null;
  isLoading: boolean;
  refetch: () => Promise<T | null>;
}

export function usePolling<T>(
  fetcher: (signal?: AbortSignal) => Promise<T>,
  options: UsePollingOptions<T> = {}
): UsePollingReturn<T> {
  const {
    intervalMs = 2000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isFetchingRef = useRef<boolean>(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const abortControllerRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(async (): Promise<T | null> => {
    if (isFetchingRef.current) {
      return null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    isFetchingRef.current = true;

    try {
      const result = await fetcherRef.current(controller.signal);
      if (!controller.signal.aborted) {
        setData(result);
        setError(null);
        setIsLoading(false);
        onSuccessRef.current?.(result);
      }
      return result;
    } catch (err: unknown) {
      if (!controller.signal.aborted) {
        if (err instanceof Error && err.name === "AbortError") {
          return null;
        }
        setError(err);
        setIsLoading(false);
        onErrorRef.current?.(err);
      }
      return null;
    } finally {
      if (abortControllerRef.current === controller) {
        isFetchingRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isFetchingRef.current = false;
      return;
    }

    let timerId: NodeJS.Timeout | null = null;
    let isMounted = true;

    executeFetch();

    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }
      if (isMounted) {
        await executeFetch();
      }
    };

    timerId = setInterval(tick, intervalMs);

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && !document.hidden && enabled && isMounted) {
        executeFetch();
      }
    };

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
      if (typeof window !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isFetchingRef.current = false;
    };
  }, [enabled, intervalMs, executeFetch]);

  return {
    data,
    error,
    isLoading,
    refetch: executeFetch,
  };
}
