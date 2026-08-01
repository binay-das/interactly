"use client";

interface SessionControlsBarProps {
  state: "LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED";
  onStartQuiz: () => Promise<void>;
  onEndQuiz: () => Promise<void>;
  onAdvanceState?: () => Promise<void>;
  isStarting?: boolean;
  isEnding?: boolean;
  isAdvancing?: boolean;
  participantCount?: number;
  questionCount?: number;
}

export function SessionControlsBar({
  state,
  onStartQuiz,
  onEndQuiz,
  onAdvanceState,
  isStarting,
  isEnding,
  isAdvancing,
  participantCount = 0,
  questionCount = 0,
}: SessionControlsBarProps) {
  const isLobby = state === "LOBBY";
  const isFinished = state === "FINISHED";
  const isInProgress = state === "QUESTION" || state === "REVEAL" || state === "LEADERBOARD";

  const canStart = isLobby && !isStarting && questionCount > 0;
  const canEnd = !isFinished && !isEnding;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <StatusBadge state={state} />
        <div className="text-xs text-zinc-400">
          {isLobby && <span>Waiting for participants to join lobby</span>}
          {isInProgress && <span className="text-indigo-400 font-medium animate-pulse">Quiz session in progress ({state})</span>}
          {isFinished && <span className="text-zinc-500">Quiz session completed</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {isLobby && (
          <button
            onClick={onStartQuiz}
            disabled={!canStart}
            title={questionCount === 0 ? "Quiz has no questions" : "Start Live Quiz"}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isStarting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Start Quiz ({participantCount} Joined)</span>
              </>
            )}
          </button>
        )}

        {isInProgress && onAdvanceState && (
          <button
            onClick={onAdvanceState}
            disabled={isAdvancing}
            title="Advance to Next State"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-zinc-950 bg-indigo-400 hover:bg-indigo-300 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isAdvancing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                <span>Advancing...</span>
              </>
            ) : (
              <>
                <span>Advance State ({state} → Next)</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        )}

        {!isFinished && (
          <button
            onClick={onEndQuiz}
            disabled={!canEnd}
            title="End Quiz Session"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-red-300 bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 hover:text-red-200 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isEnding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin" />
                <span>Ending...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                <span>End Quiz</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ state }: { state: string }) {
  switch (state) {
    case "LOBBY":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/50 text-amber-300 border border-amber-800/50">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          LOBBY
        </span>
      );
    case "QUESTION":
    case "REVEAL":
    case "LEADERBOARD":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-800/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {state}
        </span>
      );
    case "FINISHED":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-950 text-zinc-400 border border-zinc-800">
          FINISHED
        </span>
      );
  }
}
