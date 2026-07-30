"use client";

interface PlayerLobbyScreenProps {
  nickname: string;
  quizTitle?: string;
  onLeave?: () => void;
}

export function PlayerLobbyScreen({ nickname, quizTitle, onLeave }: PlayerLobbyScreenProps) {
  const initial = nickname.charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg className="w-40 h-40 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          In Lobby
        </span>

        {onLeave && (
          <button
            onClick={onLeave}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Leave
          </button>
        )}
      </div>

      <div className="my-4">
        <div className="w-20 h-20 rounded-3xl bg-indigo-950 border-2 border-indigo-700 text-indigo-200 font-extrabold text-3xl flex items-center justify-center mx-auto shadow-xl mb-3">
          {initial}
        </div>
        <h2 className="text-2xl font-bold text-zinc-100">{nickname}</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Quiz: <strong className="text-zinc-200">{quizTitle || "Live Quiz"}</strong>
        </p>
      </div>

      <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2">
        <div className="w-8 h-8 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center mx-auto animate-bounce">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-zinc-200">You&apos;re in!</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          See your nickname on the host&apos;s screen. The game will start shortly!
        </p>
      </div>
    </div>
  );
}
