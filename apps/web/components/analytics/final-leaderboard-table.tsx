"use client";

import type { FinalRankingEntry } from "@repo/types";

interface FinalLeaderboardTableProps {
  rankings: FinalRankingEntry[];
}

export function FinalLeaderboardTable({ rankings }: FinalLeaderboardTableProps) {
  if (!rankings || rankings.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-xs">
        No player ranking data recorded for this session.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <span>🏆</span>
          <span>Final Player Rankings</span>
        </h3>
        <span className="text-xs font-mono text-zinc-400">
          {rankings.length} Participants
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
              <th className="py-3 px-3">Rank</th>
              <th className="py-3 px-3">Player Nickname</th>
              <th className="py-3 px-3 text-right">Score</th>
              <th className="py-3 px-3 text-right">Current Streak</th>
              <th className="py-3 px-3 text-right">Best Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-medium">
            {rankings.map((entry) => (
              <tr
                key={entry.participantId}
                className={`hover:bg-zinc-800/40 transition-colors ${
                  entry.rank === 1
                    ? "bg-amber-950/20 text-amber-200"
                    : entry.rank === 2
                    ? "bg-zinc-800/30 text-zinc-200"
                    : entry.rank === 3
                    ? "bg-amber-900/10 text-amber-300"
                    : "text-zinc-300"
                }`}
              >
                <td className="py-3 px-3">
                  <span
                    className={`w-7 h-7 rounded-lg font-mono font-extrabold text-xs inline-flex items-center justify-center ${
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
                </td>
                <td className="py-3 px-3 font-bold text-zinc-100 text-sm">
                  {entry.nickname}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-indigo-400 text-sm">
                  {entry.score} pts
                </td>
                <td className="py-3 px-3 text-right font-mono text-amber-400 font-bold">
                  {entry.streak > 1 ? `🔥 ${entry.streak}` : entry.streak}
                </td>
                <td className="py-3 px-3 text-right font-mono text-zinc-400">
                  ⚡ {entry.maxStreak}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
