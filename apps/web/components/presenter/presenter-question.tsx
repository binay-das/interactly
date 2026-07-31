"use client";

import { useEffect, useState } from "react";
import type { QuestionDetails } from "@repo/types";

interface PresenterQuestionProps {
  question: QuestionDetails;
  questionNumber: number;
  totalQuestions: number;
  questionStartedAt?: string | null;
  questionEndsAt?: string | null;
  participantCount: number;
}

const OPTION_STYLES = [
  { bg: "bg-red-950/60 border-red-800/80 text-red-100", badge: "bg-red-950 border-red-600 text-red-300", letter: "A" },
  { bg: "bg-blue-950/60 border-blue-800/80 text-blue-100", badge: "bg-blue-950 border-blue-600 text-blue-300", letter: "B" },
  { bg: "bg-amber-950/60 border-amber-800/80 text-amber-100", badge: "bg-amber-950 border-amber-600 text-amber-300", letter: "C" },
  { bg: "bg-emerald-950/60 border-emerald-800/80 text-emerald-100", badge: "bg-emerald-950 border-emerald-600 text-emerald-300", letter: "D" },
];

export function PresenterQuestion({
  question,
  questionNumber,
  totalQuestions,
  questionStartedAt,
  questionEndsAt,
  participantCount,
}: PresenterQuestionProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(question.timeLimit || 20);

  useEffect(() => {
    const calculateSeconds = () => {
      if (questionEndsAt) {
        const diff = Math.max(0, Math.ceil((new Date(questionEndsAt).getTime() - Date.now()) / 1000));
        setSecondsLeft(diff);
      } else {
        setSecondsLeft(question.timeLimit || 20);
      }
    };

    calculateSeconds();
    const interval = setInterval(calculateSeconds, 500);
    return () => clearInterval(interval);
  }, [questionEndsAt, question.timeLimit]);

  const progressPercent = Math.min(100, Math.max(0, (secondsLeft / (question.timeLimit || 20)) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in zoom-in-95">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-bold bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-zinc-300">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
            {question.points} Points
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xl font-extrabold bg-zinc-900 px-5 py-2 rounded-full border border-zinc-800 text-indigo-400 shadow-lg">
          <span className="w-3 h-3 rounded-full bg-indigo-400 animate-ping" />
          <span>{secondsLeft}s</span>
        </div>
      </div>

      <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-500 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 leading-tight">
          {question.text}
        </h2>
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          {participantCount} Active Player{participantCount === 1 ? "" : "s"} Answering
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const defaultStyle = OPTION_STYLES[0]!;
          const style = OPTION_STYLES[index % OPTION_STYLES.length] || defaultStyle;

          return (
            <div
              key={option.id}
              className={`p-6 rounded-2xl border ${style.bg} flex items-center gap-4 shadow-xl`}
            >
              <div className={`w-12 h-12 rounded-2xl font-mono font-extrabold text-lg flex items-center justify-center shrink-0 border ${style.badge}`}>
                {style.letter}
              </div>
              <span className="text-lg font-bold text-zinc-100">
                {option.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
