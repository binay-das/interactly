"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionDetails } from "@repo/types";
import {
  advanceQuizSessionStateApi,
  endQuizSessionApi,
  type GameSessionFull,
} from "../../../../../lib/api-client";
import { useHostSessionPolling } from "../../../../../hooks/useSessionPolling";
import { PresenterControls } from "../../../../../components/presenter/presenter-controls";
import { PresenterLobby } from "../../../../../components/presenter/presenter-lobby";
import { PresenterQuestion } from "../../../../../components/presenter/presenter-question";
import { PresenterReveal } from "../../../../../components/presenter/presenter-reveal";
import { PresenterLeaderboard } from "../../../../../components/presenter/presenter-leaderboard";
import { PresenterPodium } from "../../../../../components/presenter/presenter-podium";

interface PresenterPageProps {
  params: Promise<{ id: string }>;
}

export default function PresenterPage({ params }: PresenterPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [isAdvancing, setIsAdvancing] = useState(false);
  const [errorOverride, setErrorOverride] = useState<string | null>(null);

  // Reusable polling hook for Presenter View
  const { data: session, isLoading, error: pollingError, refetch } = useHostSessionPolling(id, {
    intervalMs: 1500,
  });

  const error = errorOverride || (pollingError ? (pollingError as Error).message : null);

  const handleAdvanceState = async () => {
    if (!session || isAdvancing) return;

    setIsAdvancing(true);
    setErrorOverride(null);
    try {
      await advanceQuizSessionStateApi(id);
      await refetch();
    } catch (err: unknown) {
      setErrorOverride(err instanceof Error ? err.message : "Failed to advance state");
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;
    if (!confirm("Are you sure you want to end this game session?")) return;

    setErrorOverride(null);
    try {
      await endQuizSessionApi(id);
      await refetch();
    } catch (err: unknown) {
      setErrorOverride(err instanceof Error ? err.message : "Failed to end session");
    }
  };

  if (isLoading && !session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-zinc-400">Loading Presenter Screen...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-red-400">Presenter Error</h3>
          <p className="text-xs text-zinc-400">{error || "Game session not found"}</p>
          <button
            onClick={() => router.push(`/dashboard/sessions/${id}`)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
          >
            Back to Host Dashboard
          </button>
        </div>
      </div>
    );
  }

  const questions = session.quiz?.questions || [];
  const currentQuestionIndex = questions.findIndex((q: QuestionDetails) => q.id === session.currentQuestionId);
  const currentQuestion = questions[currentQuestionIndex >= 0 ? currentQuestionIndex : 0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden selection:bg-zinc-800">
      <div className="absolute inset-0 bg-linear-to-b from-indigo-950/20 via-transparent to-zinc-950 pointer-events-none" />

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-40 text-xs text-zinc-400 font-mono">
        <button
          onClick={() => router.push(`/dashboard/sessions/${id}`)}
          className="flex items-center gap-2 hover:text-zinc-200 transition-colors"
        >
          <span>←</span>
          <span>Back to Host Details</span>
        </button>

        <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-zinc-300">
          State: <strong className="text-indigo-400">{session.state}</strong>
        </span>
      </div>

      <div className="w-full relative z-10 my-auto">
        {session.state === "LOBBY" && <PresenterLobby session={session} />}

        {session.state === "QUESTION" && currentQuestion && (
          <PresenterQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            questionStartedAt={session.questionStartedAt}
            questionEndsAt={session.questionEndsAt}
            participantCount={session.participants?.length || 0}
          />
        )}

        {session.state === "REVEAL" && currentQuestion && (
          <PresenterReveal
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        )}

        {session.state === "LEADERBOARD" && (
          <PresenterLeaderboard sessionId={session.id} />
        )}

        {session.state === "FINISHED" && (
          <PresenterPodium sessionId={session.id} />
        )}
      </div>

      <PresenterControls
        sessionState={session.state}
        currentQuestionIndex={currentQuestionIndex >= 0 ? currentQuestionIndex : 0}
        totalQuestions={questions.length}
        onAdvanceState={handleAdvanceState}
        onEndSession={handleEndSession}
        isAdvancing={isAdvancing}
      />
    </div>
  );
}
