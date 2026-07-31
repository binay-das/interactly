"use client";

import type { QuestionDetails } from "@repo/types";

interface PresenterRevealProps {
  question: QuestionDetails;
  questionNumber: number;
  totalQuestions: number;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function PresenterReveal({
  question,
  questionNumber,
  totalQuestions,
}: PresenterRevealProps) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in zoom-in-95">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-bold bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-zinc-300">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Answer Revealed
          </span>
        </div>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
          {question.text}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isCorrect = option.isCorrect;
          const letter = OPTION_LETTERS[index % OPTION_LETTERS.length] || "A";

          return (
            <div
              key={option.id}
              className={`p-6 rounded-2xl border transition-all flex items-center justify-between shadow-xl ${
                isCorrect
                  ? "bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50 text-white"
                  : "bg-zinc-900/40 border-zinc-800/60 text-zinc-500 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl font-mono font-extrabold text-lg flex items-center justify-center shrink-0 border ${
                    isCorrect
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}
                >
                  {letter}
                </div>
                <span className={`text-lg font-bold ${isCorrect ? "text-white" : "text-zinc-400"}`}>
                  {option.text}
                </span>
              </div>

              {isCorrect && (
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-900/80 px-3 py-1.5 rounded-full border border-emerald-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Correct Answer</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
