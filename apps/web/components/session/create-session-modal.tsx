"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizStatus, type QuizDetails } from "@repo/types";
import { createSessionApi, listQuizzesApi } from "../../lib/api-client";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedQuizId?: string;
}

export function CreateSessionModal({
  isOpen,
  onClose,
  preselectedQuizId,
}: CreateSessionModalProps) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizDetails[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>(preselectedQuizId || "");
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (preselectedQuizId) {
        setSelectedQuizId(preselectedQuizId);
      }
      fetchPublishedQuizzes();
    }
  }, [isOpen, preselectedQuizId]);

  const fetchPublishedQuizzes = async () => {
    setIsLoadingQuizzes(true);
    try {
      const res = await listQuizzesApi(1, 100);
      const publishedOnly = res.quizzes.filter((q) => q.status === QuizStatus.PUBLISHED);
      setQuizzes(publishedOnly);
      if (!selectedQuizId && publishedOnly[0]) {
        setSelectedQuizId(publishedOnly[0].id);
      }
    } catch {
      setError("Failed to load quizzes");
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizId) {
      setError("Please select a published quiz to host");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const session = await createSessionApi(selectedQuizId);
      onClose();
      router.push(`/dashboard/sessions/${session.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create game session";
      setError(msg);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100">Host Live Quiz Session</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Launch a live lobby for players to join with a code or QR
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-300 p-3 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Select Published Quiz <span className="text-red-400">*</span>
            </label>

            {isLoadingQuizzes ? (
              <div className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
            ) : quizzes.length === 0 ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-center">
                <p className="text-xs text-zinc-400 mb-2">No published quizzes found.</p>
                <p className="text-[11px] text-zinc-500">
                  Publish a quiz from your dashboard before starting a live session.
                </p>
              </div>
            ) : (
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                disabled={isCreating}
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title} ({quiz.totalQuestions || quiz.questions?.length || 0} questions)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || quizzes.length === 0}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-zinc-950 bg-indigo-400 hover:bg-indigo-300 transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isCreating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  <span>Launching Session...</span>
                </>
              ) : (
                <span>Launch Session</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
