"use client";

import { createQuizSchema } from "@repo/validation";
import { useState } from "react";
import { createQuizApi } from "../../lib/api-client";
import { QuizStatus, type QuizDetails } from "@repo/types";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newQuiz: QuizDetails) => void;
}

export function CreateQuizModal({ isOpen, onClose, onSuccess }: CreateQuizModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = createQuizSchema.safeParse({ title, description });
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newQuiz = await createQuizApi({
        title: title.trim(),
        description: description.trim() || undefined,
        status: QuizStatus.DRAFT,
      });
      setTitle("");
      setDescription("");
      onSuccess(newQuiz);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create quiz";
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Create new quiz
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-3.5 py-2.5 rounded-md text-xs font-medium">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., General Knowledge Trivia"
              className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500"
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the quiz topics..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Quiz</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

