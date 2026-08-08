"use client";

import Link from "next/link";
import type { QuizDetails } from "@repo/types";

interface QuizCardProps {
  quiz: QuizDetails;
  onPublish: (quiz: QuizDetails) => void;
  onArchive: (quiz: QuizDetails) => void;
  onDelete: (quiz: QuizDetails) => void;
  onHost?: (quiz: QuizDetails) => void;
  isActionLoading?: boolean;
}

export function QuizCard({
  quiz,
  onPublish,
  onArchive,
  onDelete,
  onHost,
  isActionLoading,
}: QuizCardProps) {
  const questionCount = quiz.questions?.length ?? quiz.totalQuestions ?? 0;
  const formattedDate = new Date(quiz.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative group flex flex-col justify-between rounded-2xl bg-zinc-900/70 border border-zinc-800/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${quiz.status === "PUBLISHED"
          ? "bg-linear-to-r from-emerald-500 via-teal-400 to-indigo-500"
          : quiz.status === "DRAFT"
            ? "bg-linear-to-r from-amber-500 via-orange-400 to-amber-500"
            : "bg-linear-to-r from-zinc-600 via-zinc-500 to-zinc-600"
          }`}
      />

      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Link
            href={`/dashboard/quizzes/${quiz.id}`}
            className="group/title flex items-center gap-1.5 font-semibold text-zinc-100 text-base tracking-tight leading-snug line-clamp-1 hover:text-indigo-400 transition-colors"
          >
            <span>{quiz.title}</span>
            <svg
              className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-indigo-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <StatusBadge status={quiz.status} />
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 min-h-10 mb-4 font-normal">
          {quiz.description ? (
            quiz.description
          ) : (
            <span className="italic text-zinc-600">No description provided</span>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-950/80 border border-zinc-800 text-zinc-300">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{questionCount} {questionCount === 1 ? "question" : "questions"}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-950/80 border border-zinc-800 text-zinc-400">
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="pt-3.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {quiz.status === "PUBLISHED" && onHost && (
            <button
              onClick={() => onHost(quiz)}
              disabled={isActionLoading}
              title="Host Live Quiz Session"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Host Session</span>
            </button>
          )}

          {quiz.status === "DRAFT" && (
            <button
              onClick={() => onPublish(quiz)}
              disabled={isActionLoading}
              title="Publish Quiz"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Publish</span>
            </button>
          )}

          {quiz.status === "ARCHIVED" && (
            <span className="text-[11px] font-mono text-zinc-500 px-2 py-1 bg-zinc-950 rounded border border-zinc-900">
              Archived
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/quizzes/${quiz.id}`}
            title="Edit Quiz"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-950/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </Link>

          {quiz.status !== "ARCHIVED" && (
            <button
              onClick={() => onArchive(quiz)}
              disabled={isActionLoading}
              title="Archive Quiz"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete(quiz)}
            disabled={isActionLoading}
            title="Delete Quiz"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all cursor-pointer disabled:opacity-50"
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.12)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          PUBLISHED
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 shrink-0">
          ARCHIVED
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          DRAFT
        </span>
      );
  }
}

