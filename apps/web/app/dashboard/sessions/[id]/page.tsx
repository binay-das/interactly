"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../../../../components/protected-route";
import { Navbar } from "../../../../components/navbar";
import { JoinCodeDisplay } from "../../../../components/session/join-code-display";
import { QRCodeDisplay } from "../../../../components/session/qr-code-display";
import { ConnectedPlayersGrid } from "../../../../components/session/connected-players-grid";
import { SessionControlsBar } from "../../../../components/session/session-controls-bar";
import {
  advanceQuizSessionStateApi,
  endQuizSessionApi,
  startQuizSessionApi,
} from "../../../../lib/api-client";
import { useHostSessionPolling } from "../../../../hooks/useSessionPolling";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { id: sessionId } = use(params);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Reusable host session polling hook
  const { data: session, isLoading, error: pollingError, refetch } = useHostSessionPolling(sessionId, {
    intervalMs: 2500,
  });

  const error = pollingError ? (pollingError as Error).message : null;

  const handleStartQuiz = async () => {
    if (!session) return;
    setActionError(null);
    setIsStarting(true);

    try {
      await startQuizSessionApi(session.id);
      await refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to start quiz session";
      setActionError(msg);
    } finally {
      setIsStarting(false);
    }
  };

  const handleAdvanceState = async () => {
    if (!session) return;
    setActionError(null);
    setIsAdvancing(true);

    try {
      await advanceQuizSessionStateApi(session.id);
      await refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to advance quiz session state";
      setActionError(msg);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleEndQuiz = async () => {
    if (!session) return;
    setActionError(null);
    setIsEnding(true);

    try {
      await endQuizSessionApi(session.id);
      await refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to end quiz session";
      setActionError(msg);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {isLoading && !session && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="lg:col-span-1 space-y-6">
                <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-2xl" />
                <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl" />
                <div className="h-80 bg-zinc-900 border border-zinc-800 rounded-2xl" />
              </div>
            </div>
          )}

          {error && !session && (
            <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8 text-center my-6">
              <p className="text-xs text-red-300 font-medium mb-4">{error}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-100 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          )}

          {session && (
            <>
              {actionError && (
                <div className="bg-red-950/40 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{actionError}</span>
                  </div>
                  <button
                    onClick={() => setActionError(null)}
                    className="text-red-400 hover:text-red-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      SESSION #{session.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 font-medium">
                      Quiz: <strong className="text-zinc-200">{session.quiz?.title || "Live Quiz"}</strong>
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                    Host Session Dashboard
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/sessions/${session.id}/analytics`}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>📊</span>
                    <span>View Analytics</span>
                  </Link>
                  <Link
                    href={`/dashboard/sessions/${session.id}/present`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-950 bg-indigo-400 hover:bg-indigo-300 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>📺</span>
                    <span>Launch Presenter View</span>
                  </Link>
                  <Link
                    href={`/dashboard/quizzes/${session.quizId}`}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                  >
                    View Quiz
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <JoinCodeDisplay joinCode={session.joinCode} />
                  <QRCodeDisplay joinCode={session.joinCode} />
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <SessionControlsBar
                    state={session.state}
                    onStartQuiz={handleStartQuiz}
                    onEndQuiz={handleEndQuiz}
                    onAdvanceState={handleAdvanceState}
                    isStarting={isStarting}
                    isEnding={isEnding}
                    isAdvancing={isAdvancing}
                    participantCount={session.participants?.length || 0}
                    questionCount={session.quiz?.questions?.length || 0}
                  />

                  <ConnectedPlayersGrid
                    participants={session.participants || []}
                    sessionState={session.state}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
