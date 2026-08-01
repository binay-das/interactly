"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionDetails } from "@repo/types";
import {
  getSessionApi,
  reconnectPlayerApi,
  submitAnswerApi,
  type PlayerSessionStateResponse,
  type SubmitAnswerResponse,
} from "../../lib/api-client";
import { usePlayerSessionStatePolling } from "../../hooks/useSessionPolling";
import { PlayerLobbyScreen } from "../../components/player/player-lobby-screen";
import { PlayerQuestionScreen } from "../../components/player/player-question-screen";
import { PlayerRevealScreen } from "../../components/player/player-reveal-screen";
import { PlayerLeaderboardScreen } from "../../components/player/player-leaderboard-screen";
import { PlayerFinalResultsScreen } from "../../components/player/player-final-results-screen";

interface StoredSession {
  reconnectToken: string;
  sessionId: string;
  participantId: string;
  nickname: string;
}

export default function PlayPage() {
  const router = useRouter();

  const [storedSession, setStoredSession] = useState<StoredSession | null>(null);
  const [sessionState, setSessionState] = useState<"LOBBY" | "QUESTION" | "REVEAL" | "LEADERBOARD" | "FINISHED">("LOBBY");
  const [quizTitle, setQuizTitle] = useState<string>("Live Quiz");
  const [isLoading, setIsLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionDetails | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [questionStartedAt, setQuestionStartedAt] = useState<string | null>(null);
  const [questionEndsAt, setQuestionEndsAt] = useState<string | null>(null);

  const [lastResult, setLastResult] = useState<SubmitAnswerResponse | null>(null);
  const [submittedAnswersMap, setSubmittedAnswersMap] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const initPlayerSession = async () => {
      if (typeof window === "undefined") return;

      const raw = localStorage.getItem("interactly_player_session");
      if (!raw) {
        router.push("/join");
        return;
      }

      try {
        const parsed: StoredSession = JSON.parse(raw);
        setStoredSession(parsed);

        const res = await reconnectPlayerApi({
          reconnectToken: parsed.reconnectToken,
          sessionId: parsed.sessionId,
        });

        setSessionState(res.sessionState);
        setQuizTitle(res.quizTitle || "Live Quiz");
      } catch {
        localStorage.removeItem("interactly_player_session");
        router.push("/join");
      } finally {
        setIsLoading(false);
      }
    };

    initPlayerSession();
  }, [router]);

  // Reusable polling hook for Player Session state
  usePlayerSessionStatePolling(storedSession?.sessionId || null, {
    enabled: !!storedSession && sessionState !== "FINISHED",
    intervalMs: 1500,
    onSuccess: async (stateRes: PlayerSessionStateResponse) => {
      setSessionState(stateRes.state);
      setQuestionStartedAt(stateRes.questionStartedAt || null);
      setQuestionEndsAt(stateRes.questionEndsAt || null);

      if (stateRes.state === "QUESTION" && stateRes.currentQuestionId) {
        if (currentQuestionIdRef.current !== stateRes.currentQuestionId) {
          currentQuestionIdRef.current = stateRes.currentQuestionId;

          try {
            const fullSession = await getSessionApi(storedSession!.sessionId);
            const questions = fullSession.quiz?.questions || [];
            setTotalQuestions(questions.length || 1);

            const qIndex = questions.findIndex((q) => q.id === stateRes.currentQuestionId);
            const activeQ = questions[qIndex];
            if (activeQ) {
              setQuestionNumber(qIndex + 1);
              setCurrentQuestion(activeQ);
            }
          } catch {
          }
        }
      }
    },
  });

  const handleSubmitAnswer = async (selectedOptionId: string, responseTimeMs: number) => {
    if (!storedSession || !currentQuestion || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitAnswerApi({
        sessionId: storedSession.sessionId,
        participantId: storedSession.participantId,
        questionId: currentQuestion.id,
        selectedOptionId,
        responseTimeMs,
      });

      setLastResult(result);
      setSubmittedAnswersMap((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOptionId,
      }));
    } catch {
      setSubmittedAnswersMap((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOptionId,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !storedSession) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-zinc-400">Connecting to Live Game Session...</p>
        </div>
      </div>
    );
  }

  const selectedOptionForCurrentQ = currentQuestion
    ? submittedAnswersMap[currentQuestion.id] || null
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800">
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-zinc-300 truncate max-w-[180px] sm:max-w-xs">
            {quizTitle}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-zinc-400">Player:</span>
          <span className="font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2.5 py-1 rounded-full">
            {storedSession.nickname}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl w-full mx-auto">
        {sessionState === "LOBBY" && (
          <PlayerLobbyScreen
            nickname={storedSession.nickname}
            quizTitle={quizTitle}
          />
        )}

        {sessionState === "QUESTION" && currentQuestion && (
          <PlayerQuestionScreen
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            questionStartedAt={questionStartedAt}
            questionEndsAt={questionEndsAt}
            submittedOptionId={selectedOptionForCurrentQ}
            isSubmitting={isSubmitting}
            onSubmitAnswer={handleSubmitAnswer}
          />
        )}

        {sessionState === "REVEAL" && (
          <PlayerRevealScreen
            lastResult={lastResult}
            nickname={storedSession.nickname}
          />
        )}

        {sessionState === "LEADERBOARD" && (
          <PlayerLeaderboardScreen
            sessionId={storedSession.sessionId}
            currentParticipantId={storedSession.participantId}
          />
        )}

        {sessionState === "FINISHED" && (
          <PlayerFinalResultsScreen
            sessionId={storedSession.sessionId}
            currentParticipantId={storedSession.participantId}
            nickname={storedSession.nickname}
          />
        )}
      </main>
    </div>
  );
}
