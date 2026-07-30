"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionDetails } from "@repo/types";
import {
  getPlayerSessionStateApi,
  getSessionApi,
  reconnectPlayerApi,
  submitAnswerApi,
  type SubmitAnswerResponse,
} from "../../lib/api-client";
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
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: unknown) {
        localStorage.removeItem("interactly_player_session");
        router.push("/join");
      } finally {
        setIsLoading(false);
      }
    };

    initPlayerSession();
  }, [router]);

  useEffect(() => {
    if (!storedSession) return;

    const pollSessionState = async () => {
      try {
        const stateRes = await getPlayerSessionStateApi(storedSession.sessionId);
        setSessionState(stateRes.state);

        setQuestionStartedAt(stateRes.questionStartedAt || null);
        setQuestionEndsAt(stateRes.questionEndsAt || null);

        if (stateRes.state === "QUESTION" && stateRes.currentQuestionId) {
          if (currentQuestionIdRef.current !== stateRes.currentQuestionId) {
            currentQuestionIdRef.current = stateRes.currentQuestionId;

            const fullSession = await getSessionApi(storedSession.sessionId);
            const questions = fullSession.quiz?.questions || [];
            setTotalQuestions(questions.length || 1);

            const qIndex = questions.findIndex((q) => q.id === stateRes.currentQuestionId);
            const activeQ = questions[qIndex];
            if (activeQ) {
              setQuestionNumber(qIndex + 1);
              setCurrentQuestion(activeQ);
            }
          }
        }
      } catch {
      }
    };

    pollSessionState();
    const interval = setInterval(pollSessionState, 1500);

    return () => clearInterval(interval);
  }, [storedSession]);

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

  const handleLeaveSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("interactly_player_session");
    }
    router.push("/join");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Connecting to game session...</p>
        </div>
      </div>
    );
  }

  if (error || !storedSession) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center max-w-sm w-full space-y-4">
          <p className="text-xs text-red-400 font-medium">{error || "Session disconnected"}</p>
          <button
            onClick={handleLeaveSession}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
          >
            Return to Join Screen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-zinc-800">
      {sessionState === "LOBBY" && (
        <PlayerLobbyScreen
          nickname={storedSession.nickname}
          quizTitle={quizTitle}
          onLeave={handleLeaveSession}
        />
      )}

      {sessionState === "QUESTION" && currentQuestion && (
        <PlayerQuestionScreen
          question={currentQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          questionStartedAt={questionStartedAt}
          questionEndsAt={questionEndsAt}
          submittedOptionId={submittedAnswersMap[currentQuestion.id] || null}
          onSubmitAnswer={handleSubmitAnswer}
          isSubmitting={isSubmitting}
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
          nickname={storedSession.nickname}
        />
      )}

      {sessionState === "FINISHED" && (
        <PlayerFinalResultsScreen
          sessionId={storedSession.sessionId}
          currentParticipantId={storedSession.participantId}
          nickname={storedSession.nickname}
        />
      )}
    </div>
  );
}
