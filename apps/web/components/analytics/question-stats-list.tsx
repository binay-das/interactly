

"use client";

import type { OptionDistribution, QuestionAnalytics } from "@repo/types";

interface QuestionStatsListProps {
  questionStats: QuestionAnalytics[];
}

const OPTION_COLORS = [
  "bg-red-500 text-red-200",
  "bg-blue-500 text-blue-200",
  "bg-amber-500 text-amber-200",
  "bg-emerald-500 text-emerald-200",
];

const OPTION_BADGES = [
  "bg-red-950 border-red-700 text-red-300",
  "bg-blue-950 border-blue-700 text-blue-300",
  "bg-amber-950 border-amber-700 text-amber-300",
  "bg-emerald-950 border-emerald-700 text-emerald-300",
];

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function QuestionStatsList({ questionStats }: QuestionStatsListProps) {
  if (!questionStats || questionStats.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-xs">
        No question statistics available for this session.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
        <span>📊</span>
        <span>Question Performance & Answer Distribution</span>
      </h3>

      <div className="space-y-4">
        {questionStats.map((q, idx) => {
          const totalQ = q.totalAnswers || 1;

          return (
            <div
              key={q.questionId}
              className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-zinc-100">{q.questionText}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                      {q.correctAnswers} of {q.totalAnswers} answered correctly • Avg time: {(q.averageResponseTimeMs / 1000).toFixed(1)}s
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-indigo-400">{q.accuracyPercentage}%</span>
                    <span className="text-[10px] text-zinc-500 block">Accuracy</span>
                  </div>

                  <div className="w-16 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full ${q.accuracyPercentage >= 70
                          ? "bg-emerald-400"
                          : q.accuracyPercentage >= 40
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                      style={{ width: `${q.accuracyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Option Selection Breakdown
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.optionDistribution.map((opt: OptionDistribution, optIdx: number) => {
                    const pct = Math.round((opt.count / totalQ) * 100);
                    const letter = OPTION_LETTERS[optIdx % OPTION_LETTERS.length] || "A";
                    const badgeStyle = OPTION_BADGES[optIdx % OPTION_BADGES.length];

                    return (
                      <div
                        key={opt.optionId}
                        className={`p-3 rounded-xl border relative overflow-hidden transition-all ${opt.isCorrect
                            ? "bg-emerald-950/30 border-emerald-700/60 ring-1 ring-emerald-500/30"
                            : "bg-zinc-950/60 border-zinc-800/80"
                          }`}
                      >
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className={`w-6 h-6 rounded-md font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border ${badgeStyle}`}>
                              {letter}
                            </span>
                            <span className="text-xs font-medium text-zinc-200 truncate">
                              {opt.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs font-bold">
                            {opt.isCorrect && <span className="text-emerald-400 text-[10px]">✓ Correct</span>}
                            <span className="text-zinc-300">{opt.count}</span>
                            <span className="text-zinc-500 text-[10px]">({pct}%)</span>
                          </div>
                        </div>

                        <div
                          className={`absolute bottom-0 left-0 top-0 opacity-15 transition-all ${opt.isCorrect ? "bg-emerald-400" : "bg-indigo-400"
                            }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
