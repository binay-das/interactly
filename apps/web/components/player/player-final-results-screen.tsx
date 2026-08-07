"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFinalResultsApi, type LeaderboardEntry } from "../../lib/api-client";

interface PlayerFinalResultsScreenProps {
  sessionId: string;
  currentParticipantId?: string;
  nickname: string;
}

export function PlayerFinalResultsScreen({
  sessionId,
  currentParticipantId,
  nickname,
}: PlayerFinalResultsScreenProps) {
  const router = useRouter();
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await getFinalResultsApi(sessionId);
        setRankings(res.rankings || []);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const playerRank = rankings.find((p) => p.id === currentParticipantId || p.nickname === nickname);

  const handlePlayAgain = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("interactly_player_session");
    }
    router.push("/join");
  };

  const top1 = rankings[0];
  const top2 = rankings[1];
  const top3 = rankings[2];

  return (
    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6 relative overflow-hidden">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
          Game Completed
        </span>
        <h2 className="text-3xl font-extrabold text-zinc-100">
          Final Results 🏆
        </h2>
      </div>

      {/* Podium Display */}
      {!isLoading && (
        <div className="grid grid-cols-3 gap-2 items-end pt-4 pb-2">
          {/* 2nd Place */}
          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl text-center space-y-1">
            <span className="text-xl">🥈</span>
            <p className="text-xs font-bold text-zinc-200 truncate">{top2?.nickname || "—"}</p>
            <p className="text-[10px] font-mono text-zinc-400">{top2?.score ?? 0} pts</p>
          </div>

          {/* 1st Place */}
          <div className="bg-linear-to-t from-amber-950/80 to-zinc-950 border border-amber-600/80 p-4 rounded-2xl text-center space-y-1.5 ring-2 ring-amber-500/50">
            <span className="text-3xl">👑</span>
            <p className="text-sm font-extrabold text-amber-300 truncate">{top1?.nickname || "—"}</p>
            <p className="text-xs font-mono font-bold text-amber-400">{top1?.score ?? 0} pts</p>
          </div>

          {/* 3rd Place */}
          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl text-center space-y-1">
            <span className="text-xl">🥉</span>
            <p className="text-xs font-bold text-zinc-200 truncate">{top3?.nickname || "—"}</p>
            <p className="text-[10px] font-mono text-zinc-400">{top3?.score ?? 0} pts</p>
          </div>
        </div>
      )}

      {/* Player's Final Summary Card */}
      {playerRank && (
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between text-left">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Your Final Rank</p>
            <p className="text-lg font-bold text-zinc-100">
              #{playerRank.rank} Place ({playerRank.nickname})
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Score</p>
            <p className="text-lg font-extrabold font-mono text-indigo-400">{playerRank.score} pts</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePlayAgain}
        className="w-full py-3.5 rounded-xl font-bold text-sm text-zinc-950 bg-indigo-400 hover:bg-indigo-300 transition-all shadow-lg cursor-pointer"
      >
        Play Another Quiz
      </button>
    </div>
  );
}
