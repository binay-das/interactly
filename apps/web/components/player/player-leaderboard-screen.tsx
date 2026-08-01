"use client";

import { useLeaderboardPolling } from "../../hooks/useSessionPolling";

interface PlayerLeaderboardScreenProps {
  sessionId: string;
  currentParticipantId?: string;
  nickname?: string;
}

export function PlayerLeaderboardScreen({
  sessionId,
  currentParticipantId,
  nickname,
}: PlayerLeaderboardScreenProps) {
  const { data: leaderboard = [], isLoading, error: pollingError } = useLeaderboardPolling(sessionId, {
    intervalMs: 2500,
  });

  const entries = leaderboard || [];
  const error = pollingError ? "Unable to load leaderboard" : null;

  const playerRank = entries.find((p) => p.id === currentParticipantId || p.nickname === nickname);

  return (
    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
          Current Standings
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          Leaderboard 🏆
        </h2>
      </div>

      {playerRank && (
        <div className="bg-gradient-to-r from-indigo-950/80 to-zinc-900 border border-indigo-700/80 p-4 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-mono font-extrabold text-sm flex items-center justify-center">
              #{playerRank.rank}
            </span>
            <div>
              <p className="text-xs text-indigo-300 font-semibold">Your Rank</p>
              <p className="text-sm font-bold text-white">{playerRank.nickname}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold font-mono text-indigo-400">{playerRank.score} pts</p>
            {playerRank.streak > 1 && (
              <p className="text-[10px] text-amber-400 font-medium">🔥 {playerRank.streak} Streak</p>
            )}
          </div>
        </div>
      )}

      {isLoading && entries.length === 0 && (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-zinc-950 rounded-xl border border-zinc-800 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      {!isLoading && !error && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {entries.map((entry) => {
            const isMe = entry.id === currentParticipantId || entry.nickname === nickname;
            return (
              <div
                key={entry.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isMe
                    ? "bg-indigo-950/60 border-indigo-500/80"
                    : "bg-zinc-950 border-zinc-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                      entry.rank === 1
                        ? "bg-amber-400 text-zinc-950"
                        : entry.rank === 2
                        ? "bg-zinc-300 text-zinc-950"
                        : entry.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {entry.rank}
                  </span>

                  <span className={`text-xs font-semibold ${isMe ? "text-indigo-200" : "text-zinc-200"}`}>
                    {entry.nickname} {isMe && "(You)"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-zinc-300">{entry.score} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
