"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (message: string, duration?: number) => addToast("success", message, duration),
    error: (message: string, duration?: number) => addToast("error", message, duration),
    info: (message: string, duration?: number) => addToast("info", message, duration),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl border text-xs font-medium backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
              t.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-700/80 shadow-emerald-950/40"
                : t.type === "error"
                ? "bg-red-950/90 text-red-200 border-red-700/80 shadow-red-950/40"
                : "bg-indigo-950/90 text-indigo-200 border-indigo-700/80 shadow-indigo-950/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base select-none">
                {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
              </span>
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Close notification"
              className="text-zinc-400 hover:text-zinc-100 p-1 rounded-md transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
