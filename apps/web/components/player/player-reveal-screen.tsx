"use client";

import type { SubmitAnswerResponse } from "../../lib/api-client";

interface PlayerRevealScreenProps {
  lastResult?: SubmitAnswerResponse | null;
  nickname: string;
}

export function PlayerRevealScreen({ lastResult, nickname }: PlayerRevealScreenProps) {
  const isCorrect = lastResult?.isCorrect ?? false;
  const points = lastResult?.pointsAwarded ?? 0;
  const score = lastResult?.currentScore ?? 0;
  const streak = lastResult?.streak ?? 0;

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95">
      {/* Banner Indicator */}
      <div className="space-y-3">
        {lastResult ? (
          isCorrect ? (
            <div className="space-y-2">
              <div className="w-20 h-20 rounded-3xl bg-emerald-950 border-2 border-emerald-600 text-emerald-400 font-extrabold text-4xl flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                🎉
              </div>
              <h2 className="text-3xl font-extrabold text-emerald-400">Correct!</h2>
              <p className="text-sm text-zinc-300 font-semibold">+{points} Points</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-20 h-20 rounded-3xl bg-red-950 border-2 border-red-700 text-red-400 font-extrabold text-4xl flex items-center justify-center mx-auto shadow-2xl">
                ❌
              </div>
              <h2 className="text-3xl font-extrabold text-red-400">Not Quite!</h2>
              <p className="text-xs text-zinc-400">No points awarded for this question</p>
            </div>
          )
        ) : (
          <div className="space-y-2">
            <div className="w-20 h-20 rounded-3xl bg-zinc-950 border-2 border-zinc-800 text-zinc-500 font-extrabold text-4xl flex items-center justify-center mx-auto shadow-2xl">
              ⌛
            </div>
            <h2 className="text-2xl font-bold text-zinc-300">Time&apos;s Up!</h2>
            <p className="text-xs text-zinc-400">Question time has expired</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Total Score
          </p>
          <p className="text-2xl font-extrabold text-indigo-400 font-mono mt-0.5">
            {score} pts
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Current Streak
          </p>
          <p className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5 flex items-center justify-center gap-1">
            <span>🔥</span>
            <span>{streak}</span>
          </p>
        </div>
      </div>

      <p className="text-xs text-zinc-400 pt-2">
        Playing as <strong className="text-zinc-200">{nickname}</strong>
      </p>
    </div>
  );
}
