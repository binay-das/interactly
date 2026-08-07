"use client";

import type { QuestionAnalytics } from "@repo/types";

interface QuestionDifficultyCardProps {
  questionStats: QuestionAnalytics[];
}

export function QuestionDifficultyCard({ questionStats }: QuestionDifficultyCardProps) {
  if (!questionStats || questionStats.length === 0) return null;

  const sortedByAccuracy = [...questionStats].sort((a, b) => a.accuracyPercentage - b.accuracyPercentage);
  const hardest = sortedByAccuracy[0];
  const easiest = sortedByAccuracy[sortedByAccuracy.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hardest && (
        <div className="bg-linear-to-br from-red-950/40 via-zinc-900 to-zinc-900 border border-red-800/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950 px-2.5 py-1 rounded-full border border-red-800">
              🔥 Hardest Question
            </span>
            <span className="text-xs font-mono font-bold text-red-300">
              {hardest.accuracyPercentage}% Correct
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-zinc-100 line-clamp-2">{hardest.questionText}</h4>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 font-mono">
              <span>Correct: {hardest.correctAnswers}/{hardest.totalAnswers}</span>
              <span>Avg Time: {(hardest.averageResponseTimeMs / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      )}

      {easiest && (
        <div className="bg-linear-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-800/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              ✨ Easiest Question
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {easiest.accuracyPercentage}% Correct
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-zinc-100 line-clamp-2">{easiest.questionText}</h4>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 font-mono">
              <span>Correct: {easiest.correctAnswers}/{easiest.totalAnswers}</span>
              <span>Avg Time: {(easiest.averageResponseTimeMs / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
