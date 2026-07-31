"use client";

import type { GameSessionFull } from "../../lib/api-client";
import { JoinCodeDisplay } from "../session/join-code-display";
import { QRCodeDisplay } from "../session/qr-code-display";
import { ConnectedPlayersGrid } from "../session/connected-players-grid";

interface PresenterLobbyProps {
  session: GameSessionFull;
}

export function PresenterLobby({ session }: PresenterLobbyProps) {
  const participants = session.participants || [];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
          Live Session Lobby
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-100 tracking-tight">
          {session.quiz?.title || "Quiz Presentation"}
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Scan the QR code or enter the join code on your device to enter the game!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center shadow-2xl">
          <JoinCodeDisplay joinCode={session.joinCode} />
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center shadow-2xl">
          <QRCodeDisplay joinCode={session.joinCode} />
        </div>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <ConnectedPlayersGrid participants={participants} sessionState={session.state} />
      </div>
    </div>
  );
}
