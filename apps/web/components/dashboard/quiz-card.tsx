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
    <div className="relative group flex flex-col justify-between rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] p-5 shadow-xs hover:border-[#8c959f] dark:hover:border-[#8b949e] transition-all duration-150 overflow-hidden">
      {/* Top GitHub solid status line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
          quiz.status === "PUBLISHED"
            ? "bg-[#1f883d] dark:bg-[#238636]"
            : quiz.status === "DRAFT"
              ? "bg-[#9a6700] dark:bg-[#d29922]"
              : "bg-[#656d76] dark:bg-[#6e7681]"
        }`}
      />

      <div>
        {/* Card Header: Title & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-2.5 pt-1">
          <Link
            href={`/dashboard/quizzes/${quiz.id}`}
            className="group/title flex items-center gap-1.5 font-semibold text-[#1f2328] dark:text-[#f0f6fc] text-base tracking-tight leading-snug line-clamp-1 hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
          >
            <span>{quiz.title}</span>
            <svg
              className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-[#0969da] dark:text-[#58a6ff] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <StatusBadge status={quiz.status} />
        </div>

        {/* Quiz Description */}
        <p className="text-xs text-[#636c76] dark:text-[#8b949e] leading-relaxed line-clamp-2 min-h-10 mb-4 font-normal">
          {quiz.description ? (
            quiz.description
          ) : (
            <span className="italic text-[#8c959f] dark:text-[#6e7681]">No description provided</span>
          )}
        </p>

        {/* Quiz Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#f6f8fa] dark:bg-[#010409] border border-[#d0d7de] dark:border-[#30363d] text-[#1f2328] dark:text-[#c9d1d9]">
            <svg className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{questionCount} {questionCount === 1 ? "question" : "questions"}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#f6f8fa] dark:bg-[#010409] border border-[#d0d7de] dark:border-[#30363d] text-[#636c76] dark:text-[#8b949e]">
            <svg className="w-3.5 h-3.5 text-[#8c959f] dark:text-[#6e7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3.5 border-t border-[#d0d7de] dark:border-[#30363d] flex items-center justify-between gap-2">
        {/* Left Side: Primary Status Action */}
        <div className="flex items-center gap-2">
          {quiz.status === "PUBLISHED" && onHost && (
            <button
              onClick={() => onHost(quiz)}
              disabled={isActionLoading}
              title="Host Live Quiz Session"
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#0969da] hover:bg-[#0860ca] dark:bg-[#1f6beb] dark:hover:bg-[#388bfd] text-white transition-colors duration-150 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
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
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#1f883d] hover:bg-[#1a7f37] dark:bg-[#238636] dark:hover:bg-[#2ea043] text-white transition-colors duration-150 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Publish</span>
            </button>
          )}

          {quiz.status === "ARCHIVED" && (
            <span className="text-[11px] font-mono text-[#656d76] dark:text-[#8b949e] px-2 py-1 bg-[#f6f8fa] dark:bg-[#010409] rounded border border-[#d0d7de] dark:border-[#30363d]">
              Archived
            </span>
          )}
        </div>

        {/* Right Side: Secondary Actions (Edit, Archive, Delete) */}
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/quizzes/${quiz.id}`}
            title="Edit Quiz"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:text-[#1f2328] dark:hover:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-[#656d76] dark:text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </Link>

          {quiz.status !== "ARCHIVED" && (
            <button
              onClick={() => onArchive(quiz)}
              disabled={isActionLoading}
              title="Archive Quiz"
              className="p-1.5 rounded-md text-[#656d76] dark:text-[#8b949e] hover:text-[#9a6700] dark:hover:text-[#d29922] hover:bg-[#fff8c5]/50 dark:hover:bg-[#341a00] border border-transparent transition-colors cursor-pointer disabled:opacity-50"
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
            className="p-1.5 rounded-md text-[#656d76] dark:text-[#8b949e] hover:text-[#cf222e] dark:hover:text-[#f85149] hover:bg-[#ffebe9]/50 dark:hover:bg-[#490202]/50 border border-transparent transition-colors cursor-pointer disabled:opacity-50"
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#dafbe1] dark:bg-[#113e19] text-[#1a7f37] dark:text-[#3fb950] border border-[#4ac26b] dark:border-[#238636] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1f883d] dark:bg-[#3fb950] animate-pulse" />
          PUBLISHED
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#f6f8fa] dark:bg-[#21262d] text-[#656d76] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] shrink-0">
          ARCHIVED
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#fff8c5] dark:bg-[#341a00] text-[#9a6700] dark:text-[#d29922] border border-[#d4a72c] dark:border-[#9e6a03] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9a6700] dark:bg-[#d29922]" />
          DRAFT
        </span>
      );
  }
}



