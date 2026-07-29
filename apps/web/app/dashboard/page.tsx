"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizDetails } from "@repo/types";
import { ProtectedRoute } from "../../components/protected-route";
import { Navbar } from "../../components/navbar";
import { useAuth } from "../../context/auth-context";
import {
  archiveQuizApi,
  deleteQuizApi,
  listQuizzesApi,
  publishQuizApi,
} from "../../lib/api-client";
import { QuizCard } from "../../components/dashboard/quiz-card";
import { CreateQuizModal } from "../../components/dashboard/create-quiz-modal";
import { DeleteQuizDialog } from "../../components/dashboard/delete-quiz-dialog";
import { QuizFilters, type StatusFilter } from "../../components/dashboard/quiz-filters";
import { CreateSessionModal } from "../../components/session/create-session-modal";

export default function DashboardPage() {
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState<QuizDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedQuizForSession, setSelectedQuizForSession] = useState<string | undefined>();
  const [quizToDelete, setQuizToDelete] = useState<QuizDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionQuizId, setActionQuizId] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listQuizzesApi(1, 100);
      setQuizzes(response.quizzes || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load quizzes";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const counts = useMemo(() => {
    const all = quizzes.length;
    const draft = quizzes.filter((q) => q.status === "DRAFT").length;
    const published = quizzes.filter((q) => q.status === "PUBLISHED").length;
    const archived = quizzes.filter((q) => q.status === "ARCHIVED").length;
    return { all, draft, published, archived };
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (statusFilter !== "ALL" && quiz.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = quiz.title.toLowerCase().includes(query);
        const descMatch = quiz.description?.toLowerCase().includes(query);
        return titleMatch || descMatch;
      }
      return true;
    });
  }, [quizzes, statusFilter, searchQuery]);

  const handlePublish = async (quiz: QuizDetails) => {
    setActionQuizId(quiz.id);
    setActionError(null);
    try {
      const updated = await publishQuizApi(quiz.id);
      setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? updated : q)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish quiz";
      setActionError(msg);
    } finally {
      setActionQuizId(null);
    }
  };

  const handleArchive = async (quiz: QuizDetails) => {
    setActionQuizId(quiz.id);
    setActionError(null);
    try {
      const updated = await archiveQuizApi(quiz.id);
      setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? updated : q)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to archive quiz";
      setActionError(msg);
    } finally {
      setActionQuizId(null);
    }
  };

  const handleDeleteConfirm = async (quiz: QuizDetails) => {
    setIsDeleting(true);
    setActionError(null);
    try {
      await deleteQuizApi(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      setQuizToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete quiz";
      setActionError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHostSession = (quiz: QuizDetails) => {
    setSelectedQuizForSession(quiz.id);
    setIsSessionModalOpen(true);
  };

  const handleQuizCreated = (newQuiz: QuizDetails) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                Quiz Management
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage, publish, and host live quiz sessions as <span className="text-zinc-200 font-mono">{user?.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => {
                  setSelectedQuizForSession(undefined);
                  setIsSessionModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-md text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 hover:bg-indigo-900/60 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Host Session</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-md text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Quiz</span>
              </button>
            </div>
          </div>

          {actionError && (
            <div className="mb-6 bg-red-950/40 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-xs flex items-center justify-between gap-3 animate-in fade-in">
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

          {error && (
            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-6 text-center mb-8">
              <p className="text-xs text-red-300 font-medium mb-3">{error}</p>
              <button
                onClick={fetchQuizzes}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <QuizFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              counts={counts}
            />
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 animate-pulse space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-zinc-800 rounded w-2/3" />
                    <div className="h-4 bg-zinc-800 rounded w-16" />
                  </div>
                  <div className="h-3 bg-zinc-800/60 rounded w-full" />
                  <div className="h-3 bg-zinc-800/60 rounded w-4/5" />
                  <div className="pt-3 border-t border-zinc-800/60 flex justify-between">
                    <div className="h-3 bg-zinc-800 rounded w-20" />
                    <div className="h-3 bg-zinc-800 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredQuizzes.length === 0 && (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-12 text-center my-6">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>

              {quizzes.length === 0 ? (
                <>
                  <h3 className="text-sm font-semibold text-zinc-200">No quizzes created yet</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-5">
                    Get started by creating your first quiz to host live sessions and engage your audience.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 rounded-md text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Your First Quiz</span>
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-zinc-200">No matching quizzes found</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-5">
                    No quizzes match your current search query or status filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                    }}
                    className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          )}

          {!isLoading && !error && filteredQuizzes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onPublish={handlePublish}
                  onArchive={handleArchive}
                  onDelete={setQuizToDelete}
                  onHost={handleHostSession}
                  isActionLoading={actionQuizId === quiz.id}
                />
              ))}
            </div>
          )}
        </main>

        <CreateQuizModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleQuizCreated}
        />

        <CreateSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          preselectedQuizId={selectedQuizForSession}
        />

        <DeleteQuizDialog
          quiz={quizToDelete}
          isOpen={!!quizToDelete}
          onClose={() => setQuizToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      </div>
    </ProtectedRoute>
  );
}
