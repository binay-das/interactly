"use client";

import type { QuizDetails } from "@repo/types";

interface QuizCardProps {
  quiz: QuizDetails;
  onPublish: (quiz: QuizDetails) => void;
  onArchive: (quiz: QuizDetails) => void;
  onDelete: (quiz: QuizDetails) => void;
  isActionLoading?: boolean;
}

export function QuizCard({
  quiz,
  onPublish,
  onArchive,
  onDelete,
  isActionLoading,
}: QuizCardProps) {
  const questionCount = quiz.questions?.length ?? quiz.totalQuestions ?? 0;
  const formattedDate = new Date(quiz.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="font-semibold text-zinc-100 text-base tracking-tight leading-snug line-clamp-1 group-hover:text-white transition-colors">
            {quiz.title}
          </h3>
          <StatusBadge status={quiz.status} />
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2 min-h-8">
          {quiz.description || "No description provided."}
        </p>
      </div>

      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-mono text-zinc-400">
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {quiz.status === "DRAFT" && (
            <button
              onClick={() => onPublish(quiz)}
              disabled={isActionLoading}
              title="Publish Quiz"
              className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-700 transition-colors disabled:opacity-50"
            >
              Publish
            </button>
          )}

          {quiz.status !== "ARCHIVED" && (
            <button
              onClick={() => onArchive(quiz)}
              disabled={isActionLoading}
              title="Archive Quiz"
              className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Archive
            </button>
          )}

          <button
            onClick={() => onDelete(quiz)}
            disabled={isActionLoading}
            title="Delete Quiz"
            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" | "ARCHIVED" }) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          PUBLISHED
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-950 text-zinc-400 border border-zinc-800 shrink-0">
          ARCHIVED
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40 shrink-0">
          DRAFT
        </span>
      );
  }
}
