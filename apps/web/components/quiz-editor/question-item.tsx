"use client";

import { useState } from "react";
import type { QuestionDetails } from "@repo/types";
import { QuestionForm, type QuestionFormData } from "./question-form";

interface QuestionItemProps {
  question: QuestionDetails;
  index: number;
  totalCount: number;
  onUpdate: (questionId: string, data: QuestionFormData) => Promise<void>;
  onDelete: (questionId: string) => Promise<void>;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isActionLoading?: boolean;
}

export function QuestionItem({
  question,
  index,
  totalCount,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isActionLoading,
}: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = async (data: QuestionFormData) => {
    await onUpdate(question.id, data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <QuestionForm
        initialData={{
          text: question.text,
          timeLimit: question.timeLimit,
          points: question.points,
          options: question.options.map((opt) => ({
            text: opt.text,
            order: opt.order,
            isCorrect: !!opt.isCorrect,
          })),
        }}
        orderIndex={index}
        onSubmit={handleSaveEdit}
        onCancel={() => setIsEditing(false)}
        submitLabel="Update Question"
      />
    );
  }

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all space-y-4">
      {/* Header with question order and actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-xs font-bold flex items-center justify-center border border-zinc-700 shrink-0">
            {index + 1}
          </span>
          <h4 className="font-semibold text-zinc-100 text-sm leading-snug">
            {question.text}
          </h4>
        </div>

        {/* Badges & Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-400">
            <span>⏱ {question.timeLimit}s</span>
            <span>•</span>
            <span>⭐ {question.points} pts</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
            {/* Move Up */}
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0 || isActionLoading}
              title="Move Up"
              className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {/* Move Down */}
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === totalCount - 1 || isActionLoading}
              title="Move Down"
              className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isActionLoading}
              title="Edit Question"
              className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(question.id)}
              disabled={isActionLoading}
              title="Delete Question"
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {question.options.map((opt) => (
          <div
            key={opt.id}
            className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
              opt.isCorrect
                ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-300 font-medium"
                : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400"
            }`}
          >
            <span className="truncate mr-2">{opt.text}</span>
            {opt.isCorrect && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 shrink-0">
                ✓ CORRECT
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
