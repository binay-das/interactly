"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinSessionSchema } from "@repo/validation";
import { joinPlayerApi } from "../../lib/api-client";

interface JoinFormProps {
  initialCode?: string;
}

export function JoinForm({ initialCode = "" }: JoinFormProps) {
  const router = useRouter();

  const [joinCode, setJoinCode] = useState(initialCode.toUpperCase());
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = joinCode.trim().toUpperCase();
    const cleanNick = nickname.trim();

    const validation = joinSessionSchema.safeParse({
      joinCode: cleanCode,
      nickname: cleanNick,
    });

    if (!validation.success) {
      const firstErr = validation.error.errors[0]?.message || "Invalid input";
      setError(firstErr);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await joinPlayerApi({
        joinCode: cleanCode,
        nickname: cleanNick,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "interactly_player_session",
          JSON.stringify({
            reconnectToken: res.reconnectToken,
            sessionId: res.sessionId,
            participantId: res.participantId,
            nickname: res.nickname,
          })
        );
      }

      router.push("/play");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to join game session";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 text-indigo-400 font-extrabold text-xl flex items-center justify-center mx-auto shadow-inner">
          ⚡
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
          Join Quiz Game
        </h2>
        <p className="text-xs text-zinc-400">
          Enter the 6-character game code and pick your nickname
        </p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-800/50 text-red-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Game Join Code
          </label>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            maxLength={10}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-center text-2xl font-bold tracking-widest text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 uppercase transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Your Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter nickname"
            maxLength={25}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-base font-medium text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !joinCode.trim() || !nickname.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-zinc-950 bg-indigo-400 hover:bg-indigo-300 disabled:opacity-40 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              <span>Joining Lobby...</span>
            </>
          ) : (
            <span>Join Game</span>
          )}
        </button>
      </form>
    </div>
  );
}
