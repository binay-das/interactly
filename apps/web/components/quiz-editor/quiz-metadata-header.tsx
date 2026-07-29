"use client";

import { useState } from "react";
import { QuizStatus, type QuizDetails } from "@repo/types";
import { updateQuizSchema } from "@repo/validation";

interface QuizMetadataHeaderProps {
  quiz: QuizDetails;
  onUpdateMetadata: (data: { title: string; description?: string; status?: QuizStatus }) => Promise<void>;
  onPublish: () => Promise<void>;
}

export function QuizMetadataHeader({
  quiz,
  onUpdateMetadata,
  onPublish,
}: QuizMetadataHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description || "");
  const [status, setStatus] = useState<QuizStatus>(quiz.status);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationResult = updateQuizSchema.safeParse({
      title: title.trim(),
      description: description.trim() || null,
      status,
    });

    if (!validationResult.success) {
      setError(validationResult.error.errors[0]?.message || "Invalid quiz data");
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateMetadata({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update quiz settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md mb-8">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100">Edit Quiz Settings</h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-800/50 text-red-300 p-2.5 rounded text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as QuizStatus)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
            >
              <option value={QuizStatus.DRAFT}>DRAFT</option>
              <option value={QuizStatus.PUBLISHED}>PUBLISHED</option>
              <option value={QuizStatus.ARCHIVED}>ARCHIVED</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                  {quiz.title}
                </h1>
                <StatusBadge status={quiz.status} />
              </div>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                {quiz.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Metadata</span>
              </button>

              {quiz.status === QuizStatus.DRAFT && (
                <button
                  onClick={onPublish}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  Publish Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: QuizStatus }) {
  switch (status) {
    case QuizStatus.PUBLISHED:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          PUBLISHED
        </span>
      );
    case QuizStatus.ARCHIVED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-950 text-zinc-400 border border-zinc-800">
          ARCHIVED
        </span>
      );
    case QuizStatus.DRAFT:
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40">
          DRAFT
        </span>
      );
  }
}
