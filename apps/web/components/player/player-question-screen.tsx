"use client";

import { useEffect, useState } from "react";
import type { QuestionDetails, QuestionOption } from "@repo/types";

interface PlayerQuestionScreenProps {
  question: QuestionDetails;
  questionNumber: number;
  totalQuestions: number;
  questionStartedAt?: string | null;
  questionEndsAt?: string | null;
  submittedOptionId?: string | null;
  onSubmitAnswer: (optionId: string, responseTimeMs: number) => Promise<void>;
  isSubmitting?: boolean;
}

const OPTION_STYLES = [
  { bg: "bg-red-950/80 hover:bg-red-900/90 border-red-800/80 text-red-200", badge: "bg-red-950 border-red-700 text-red-300", letter: "A" },
  { bg: "bg-blue-950/80 hover:bg-blue-900/90 border-blue-800/80 text-blue-200", badge: "bg-blue-950 border-blue-700 text-blue-300", letter: "B" },
  { bg: "bg-amber-950/80 hover:bg-amber-900/90 border-amber-800/80 text-amber-200", badge: "bg-amber-950 border-amber-700 text-amber-300", letter: "C" },
  { bg: "bg-emerald-950/80 hover:bg-emerald-900/90 border-emerald-800/80 text-emerald-200", badge: "bg-emerald-950 border-emerald-700 text-emerald-300", letter: "D" },
];

export function PlayerQuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  questionStartedAt,
  questionEndsAt,
  submittedOptionId,
  onSubmitAnswer,
  isSubmitting = false,
}: PlayerQuestionScreenProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(submittedOptionId || null);
  const [secondsLeft, setSecondsLeft] = useState<number>(question.timeLimit || 20);

  const startTimeMs = questionStartedAt ? new Date(questionStartedAt).getTime() : Date.now();

  useEffect(() => {
    if (submittedOptionId) {
      setSelectedOptionId(submittedOptionId);
    }
  }, [submittedOptionId]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOptionId || isSubmitting) return;
      const keyIndex = parseInt(e.key, 10) - 1;
      if (!isNaN(keyIndex) && keyIndex >= 0 && keyIndex < question.options.length) {
        const option = question.options[keyIndex];
        if (option) {
          handleSelectOption(option);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question.options, selectedOptionId, isSubmitting]);

  const handleSelectOption = async (option: QuestionOption) => {
    if (selectedOptionId || isSubmitting) return;

    setSelectedOptionId(option.id);
    const responseTimeMs = Math.max(100, Date.now() - startTimeMs);

    await onSubmitAnswer(option.id, responseTimeMs);
  };

  const isLocked = !!selectedOptionId || isSubmitting;
  const progressPercent = Math.min(100, Math.max(0, (secondsLeft / (question.timeLimit || 20)) * 100));

  return (
    <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-zinc-200">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">{question.points} pts</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-sm font-bold bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800 text-indigo-400">
          <svg className="w-4 h-4 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{secondsLeft}s</span>
        </div>
      </div>

      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800/90 text-center my-2 shadow-inner">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 leading-snug">
          {question.text}
        </h2>
      </div>

      {isLocked && (
        <div className="bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 p-3.5 rounded-xl text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Answer Submitted! Waiting for results...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {question.options.map((option, index) => {
          const defaultStyle = OPTION_STYLES[0]!;
          const style = OPTION_STYLES[index % OPTION_STYLES.length] || defaultStyle;
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={isLocked}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer shadow-md relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                isSelected
                  ? "bg-indigo-950 border-indigo-500 ring-2 ring-indigo-500 text-white"
                  : isLocked
                  ? "opacity-50 cursor-not-allowed " + style.bg
                  : style.bg
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                  isSelected ? "bg-indigo-600 text-white border-indigo-400" : style.badge
                }`}
              >
                {style.letter}
              </div>

              <span className="text-sm font-semibold text-zinc-100 flex-1 self-center">
                {option.text}
              </span>

              {isSelected && (
                <span className="text-indigo-400 text-xs font-bold shrink-0 self-center">
                  ✓ Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
