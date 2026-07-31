"use client";

import { useEffect, useState } from "react";

interface PresenterControlsProps {
  sessionState: "LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED";
  currentQuestionIndex: number;
  totalQuestions: number;
  onAdvanceState: () => void;
  onEndSession: () => void;
  isAdvancing?: boolean;
}

export function PresenterControls({
  sessionState,
  currentQuestionIndex,
  totalQuestions,
  onAdvanceState,
  onEndSession,
  isAdvancing = false,
}: PresenterControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const getActionText = () => {
    switch (sessionState) {
      case "LOBBY":
        return "Start Quiz 🚀";
      case "QUESTION":
        return "Reveal Answer 👁️";
      case "REVEAL":
        return "Show Leaderboard 🏆";
      case "LEADERBOARD":
        return currentQuestionIndex + 1 < totalQuestions ? "Next Question ➡️" : "Show Final Results 🥇";
      case "FINISHED":
        return "End Session 🏁";
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 text-zinc-100">
      <div className="flex items-center gap-2 pr-2 border-r border-zinc-800 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="uppercase text-zinc-400 font-bold">Presenter Mode</span>
      </div>

      <button
        onClick={onAdvanceState}
        disabled={isAdvancing || sessionState === "FINISHED"}
        className="px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-zinc-950 font-extrabold text-sm transition-all shadow-lg hover:scale-105 disabled:opacity-40 cursor-pointer flex items-center gap-2"
      >
        {isAdvancing ? (
          <>
            <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <span>{getActionText()}</span>
        )}
      </button>

      <button
        onClick={toggleFullscreen}
        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      <button
        onClick={onEndSession}
        className="px-3.5 py-1.5 rounded-full bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-semibold transition-colors cursor-pointer"
      >
        End
      </button>
    </div>
  );
}
