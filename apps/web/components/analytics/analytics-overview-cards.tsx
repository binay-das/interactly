"use client";

interface AnalyticsOverviewCardsProps {
  totalParticipants: number;
  totalAnswersSubmitted: number;
  overallAverageResponseTimeMs: number;
  overallAccuracyPercentage: number;
}

export function AnalyticsOverviewCards({
  totalParticipants,
  totalAnswersSubmitted,
  overallAverageResponseTimeMs,
  overallAccuracyPercentage,
}: AnalyticsOverviewCardsProps) {
  const formattedAvgTime = (overallAverageResponseTimeMs / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Participants
          </span>
          <span className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-400">
            👥
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-mono text-zinc-100">{totalParticipants}</p>
          <p className="text-xs text-zinc-500 mt-1">Total players joined</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Answers Submitted
          </span>
          <span className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400">
            📝
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-mono text-zinc-100">{totalAnswersSubmitted}</p>
          <p className="text-xs text-zinc-500 mt-1">Total responses logged</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Avg Response Time
          </span>
          <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400">
            ⚡
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-mono text-zinc-100">{formattedAvgTime}s</p>
          <p className="text-xs text-zinc-500 mt-1">Average per question</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Overall Accuracy
          </span>
          <span className="p-2 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-400">
            🎯
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold font-mono text-zinc-100">{overallAccuracyPercentage}%</p>
          <p className="text-xs text-zinc-500 mt-1">Correct answers ratio</p>
        </div>
      </div>
    </div>
  );
}
