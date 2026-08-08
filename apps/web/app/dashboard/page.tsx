"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizDetails } from "@repo/types";
import { ProtectedRoute } from "../../components/protected-route";
import { Navbar } from "../../components/navbar";
import { useAuth } from "../../context/auth-context";
import { useToast } from "../../context/toast-context";
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
import { EmptyState } from "../../components/ui/empty-state";
import { Skeleton } from "../../components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [quizzes, setQuizzes] = useState<QuizDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      toast.error(msg);
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
    try {
      const updated = await publishQuizApi(quiz.id);
      setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? updated : q)));
      toast.success(`Published "${quiz.title}" successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish quiz";
      toast.error(msg);
    } finally {
      setActionQuizId(null);
    }
  };

  const handleArchive = async (quiz: QuizDetails) => {
    setActionQuizId(quiz.id);
    try {
      const updated = await archiveQuizApi(quiz.id);
      setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? updated : q)));
      toast.info(`Archived "${quiz.title}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to archive quiz";
      toast.error(msg);
    } finally {
      setActionQuizId(null);
    }
  };

  const handleDeleteConfirm = async (quiz: QuizDetails) => {
    setIsDeleting(true);
    try {
      await deleteQuizApi(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      setQuizToDelete(null);
      toast.success(`Deleted "${quiz.title}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete quiz";
      toast.error(msg);
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
    toast.success(`Quiz "${newQuiz.title}" created!`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-(--background) text-(--foreground) flex flex-col transition-colors duration-150">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1f2328] dark:text-[#f0f6fc]">
                Quiz Management
              </h1>
              <p className="text-xs text-[#636c76] dark:text-[#8b949e] mt-1">
                Manage, publish, and host live quiz sessions as <span className="text-[#1f2328] dark:text-[#f0f6fc] font-mono">{user?.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => {
                  setSelectedQuizForSession(undefined);
                  setIsSessionModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-md text-xs font-semibold text-white bg-[#0969da] hover:bg-[#0860ca] dark:bg-[#1f6beb] dark:hover:bg-[#388bfd] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969da]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Host Session</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#1f883d] hover:bg-[#1a7f37] dark:bg-[#238636] dark:hover:bg-[#2ea043] border border-[#1a7f37] dark:border-[#238636] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238636]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Quiz</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-[#ffebe9] dark:bg-[#490202]/40 border border-[#ff8182] dark:border-[#da3633]/50 rounded-xl p-6 text-center mb-8">
              <p className="text-xs text-[#cf222e] dark:text-[#f85149] font-medium mb-3">{error}</p>
              <button
                onClick={fetchQuizzes}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#1f2328] dark:text-[#f0f6fc] bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
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
                <Skeleton key={i} className="h-48 rounded-xl bg-[#f6f8fa] dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d]" />
              ))}
            </div>
          )}

          {!isLoading && !error && filteredQuizzes.length === 0 && (
            <EmptyState
              icon="❓"
              title={quizzes.length === 0 ? "No quizzes created yet" : "No matching quizzes found"}
              description={
                quizzes.length === 0
                  ? "Get started by creating your first quiz to host live sessions and engage your audience."
                  : "No quizzes match your current search query or status filter."
              }
              actionLabel={quizzes.length === 0 ? "Create Your First Quiz" : "Clear Filters"}
              onAction={
                quizzes.length === 0
                  ? () => setIsCreateModalOpen(true)
                  : () => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                    }
              }
            />
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


