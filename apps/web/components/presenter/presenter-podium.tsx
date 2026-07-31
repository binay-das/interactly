"use client";

import { useEffect, useState } from "react";
import { getFinalResultsApi, type LeaderboardEntry } from "../../lib/api-client";

interface PresenterPodiumProps {
  sessionId: string;
}

export function PresenterPodium({ sessionId }: PresenterPodiumProps) {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await getFinalResultsApi(sessionId);
        setRankings(res.rankings || []);
        setTotalParticipants(res.totalParticipants || 0);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const top1 = rankings[0];
  const top2 = rankings[1];
  const top3 = rankings[2];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 text-center">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-800">
          Game Completed
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-100 tracking-tight">
          Tournament Champions 🏆
        </h1>
        <p className="text-sm text-zinc-400 font-mono">
          Out of {totalParticipants} total participant{totalParticipants === 1 ? "" : "s"}
        </p>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-3 gap-4 items-end pt-8 max-w-3xl mx-auto">
          <div className="bg-zinc-900/90 border border-zinc-400/50 p-6 rounded-3xl text-center space-y-2 shadow-2xl h-64 flex flex-col justify-end">
            <span className="text-4xl">🥈</span>
            <h3 className="text-xl font-bold text-zinc-200 truncate">{top2?.nickname || "—"}</h3>
            <p className="text-sm font-mono font-bold text-zinc-400">{top2?.score ?? 0} pts</p>
            <div className="w-full bg-zinc-800 h-16 rounded-xl flex items-center justify-center font-mono font-extrabold text-zinc-400 text-lg">
              2nd
            </div>
          </div>

          <div className="bg-gradient-to-t from-amber-950 via-zinc-900 to-zinc-900 border-2 border-amber-500 p-8 rounded-3xl text-center space-y-3 shadow-2xl h-80 flex flex-col justify-end ring-4 ring-amber-500/30 scale-105">
            <span className="text-6xl animate-bounce">👑</span>
            <h3 className="text-2xl font-extrabold text-amber-300 truncate">{top1?.nickname || "—"}</h3>
            <p className="text-lg font-mono font-extrabold text-amber-400">{top1?.score ?? 0} pts</p>
            <div className="w-full bg-amber-500 text-zinc-950 h-24 rounded-xl flex items-center justify-center font-mono font-black text-2xl shadow-lg">
              1st Champion
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-800/50 p-6 rounded-3xl text-center space-y-2 shadow-2xl h-56 flex flex-col justify-end">
            <span className="text-4xl">🥉</span>
            <h3 className="text-xl font-bold text-zinc-200 truncate">{top3?.nickname || "—"}</h3>
            <p className="text-sm font-mono font-bold text-zinc-400">{top3?.score ?? 0} pts</p>
            <div className="w-full bg-zinc-800/80 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-zinc-400 text-lg">
              3rd
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
