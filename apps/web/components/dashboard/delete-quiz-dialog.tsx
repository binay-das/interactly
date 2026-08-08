"use client";

import type { QuizDetails } from "@repo/types";

interface DeleteQuizDialogProps {
  quiz: QuizDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quiz: QuizDetails) => Promise<void>;
  isDeleting: boolean;
}

export function DeleteQuizDialog({
  quiz,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteQuizDialogProps) {
  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Delete quiz</h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
          Are you sure you want to delete <strong className="text-slate-900 dark:text-slate-200">{quiz.title}</strong>? This action cannot be undone and will delete all questions and session history associated with it.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(quiz)}
            disabled={isDeleting}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isDeleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

