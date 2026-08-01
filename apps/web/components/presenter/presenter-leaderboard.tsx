"use client";

import { useLeaderboardPolling } from "../../hooks/useSessionPolling";

interface PresenterLeaderboardProps {
  sessionId: string;
}

export function PresenterLeaderboard({ sessionId }: PresenterLeaderboardProps) {
  const { data: leaderboard = [], isLoading } = useLeaderboardPolling(sessionId, {
    intervalMs: 2500,
  });

  const entries = leaderboard || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in zoom-in-95">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-950/60 px-3.5 py-1 rounded-full border border-amber-800">
          Leaderboard Standings
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100">
          Current Rankings 🏆
        </h1>
      </div>

      {isLoading && entries.length === 0 ? (
        <div className="space-y-3 max-w-2xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-zinc-900/80 rounded-2xl border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl mx-auto">
          {entries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between shadow-xl ${
                entry.rank === 1
                  ? "bg-gradient-to-r from-amber-950/80 via-zinc-900 to-zinc-900 border-amber-500/80 ring-1 ring-amber-500/50"
                  : entry.rank === 2
                  ? "bg-zinc-900/90 border-zinc-400/50"
                  : entry.rank === 3
                  ? "bg-zinc-900/90 border-amber-800/50"
                  : "bg-zinc-900/70 border-zinc-800/80"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-10 h-10 rounded-xl font-mono font-extrabold text-base flex items-center justify-center shadow-inner ${
                    entry.rank === 1
                      ? "bg-amber-400 text-zinc-950"
                      : entry.rank === 2
                      ? "bg-zinc-300 text-zinc-950"
                      : entry.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  #{entry.rank}
                </span>

                <span className="text-xl font-bold text-zinc-100">
                  {entry.nickname}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {entry.streak > 1 && (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-700/80 px-3 py-1 rounded-full flex items-center gap-1">
                    <span>🔥</span>
                    <span>{entry.streak} Streak</span>
                  </span>
                )}

                <span className="text-xl font-extrabold font-mono text-indigo-400">
                  {entry.score} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
