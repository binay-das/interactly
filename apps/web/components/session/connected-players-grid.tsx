"use client";

import type { SessionParticipant } from "../../lib/api-client";

interface ConnectedPlayersGridProps {
  participants: SessionParticipant[];
  sessionState: string;
}

export function ConnectedPlayersGrid({ participants, sessionState }: ConnectedPlayersGridProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-zinc-100">
            Connected Players
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {participants.length}
          </span>
        </div>

        {sessionState === "LOBBY" && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Waiting in Lobby</span>
          </div>
        )}
      </div>

      {participants.length === 0 ? (
        <div className="bg-zinc-950/60 border border-dashed border-zinc-800 rounded-xl p-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-xs text-zinc-400 font-medium">No players joined yet</p>
          <p className="text-[11px] text-zinc-600">
            Players will appear here automatically once they enter the join code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
          {participants.map((player, index) => {
            const initial = player.nickname.charAt(0).toUpperCase();
            return (
              <div
                key={player.id || index}
                className="bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 p-3 rounded-xl flex items-center gap-2.5 transition-all shadow-sm group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {initial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-zinc-100 truncate group-hover:text-white">
                    {player.nickname}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    {player.score} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
