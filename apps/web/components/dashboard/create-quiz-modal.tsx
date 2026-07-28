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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-6 relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
            Create new quiz
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded-md hover:bg-zinc-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 bg-red-950/40 border border-red-800/50 text-red-300 px-3.5 py-2.5 rounded-md text-xs font-medium">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Quiz Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., General Knowledge Trivia"
              className={`w-full px-3 py-2 rounded-md bg-zinc-950 border text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500"
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400 font-medium">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description <span className="text-zinc-500">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the quiz topics..."
              className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md text-xs font-medium text-zinc-300 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
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
