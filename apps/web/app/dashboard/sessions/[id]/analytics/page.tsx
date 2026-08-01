"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../../../../../components/protected-route";
import { Navbar } from "../../../../../components/navbar";
import { getSessionAnalyticsApi } from "../../../../../lib/api-client";
import type { SessionAnalytics } from "@repo/types";
import { AnalyticsOverviewCards } from "../../../../../components/analytics/analytics-overview-cards";
import { QuestionDifficultyCard } from "../../../../../components/analytics/question-difficulty-card";
import { QuestionStatsList } from "../../../../../components/analytics/question-stats-list";
import { FinalLeaderboardTable } from "../../../../../components/analytics/final-leaderboard-table";

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionAnalyticsPage({ params }: AnalyticsPageProps) {
  const { id: sessionId } = use(params);

  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSessionAnalyticsApi(sessionId);
        setAnalytics(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load session analytics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [sessionId]);

  const totalCorrect = analytics?.questionStats.reduce((acc: number, q: { correctAnswers: number }) => acc + q.correctAnswers, 0) || 0;
  const totalAnswers = analytics?.totalAnswersSubmitted || 0;
  const overallAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/sessions/${sessionId}`}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Session Host Details</span>
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-2xl" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-zinc-900 border border-zinc-800 rounded-2xl" />
                ))}
              </div>
              <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl" />
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8 text-center my-6 space-y-4">
              <p className="text-xs text-red-300 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-100 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {analytics && !isLoading && (
            <>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      ANALYTICS REPORT
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 font-medium">
                      Status: <strong className="text-emerald-400">{analytics.sessionState}</strong>
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                    {analytics.quizTitle}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>🖨️</span>
                    <span>Print Report</span>
                  </button>
                </div>
              </div>

              <AnalyticsOverviewCards
                totalParticipants={analytics.totalParticipants}
                totalAnswersSubmitted={analytics.totalAnswersSubmitted}
                overallAverageResponseTimeMs={analytics.overallAverageResponseTimeMs}
                overallAccuracyPercentage={overallAccuracy}
              />

              <QuestionDifficultyCard questionStats={analytics.questionStats} />

              <QuestionStatsList questionStats={analytics.questionStats} />

              <FinalLeaderboardTable rankings={analytics.finalRankings} />
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
