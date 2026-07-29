"use client";

import { useState } from "react";
import { createQuestionSchema, type CreateOptionInput } from "@repo/validation";
import { OptionEditor } from "./option-editor";

export interface QuestionFormData {
  text: string;
  timeLimit: number;
  points: number;
  options: CreateOptionInput[];
}

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  orderIndex: number;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const TIME_LIMIT_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120];
const POINTS_OPTIONS = [500, 1000, 1500, 2000];

export function QuestionForm({
  initialData,
  orderIndex,
  onSubmit,
  onCancel,
  submitLabel = "Save Question",
}: QuestionFormProps) {
  const [text, setText] = useState(initialData?.text || "");
  const [timeLimit, setTimeLimit] = useState<number>(initialData?.timeLimit ?? 20);
  const [points, setPoints] = useState<number>(initialData?.points ?? 1000);
  const [options, setOptions] = useState<CreateOptionInput[]>(
    initialData?.options || [
      { text: "Option 1", order: 0, isCorrect: true },
      { text: "Option 2", order: 1, isCorrect: false },
    ]
  );

  const [errors, setErrors] = useState<{ text?: string; options?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      text: text.trim(),
      order: orderIndex,
      timeLimit,
      points,
      options,
    };

    const validationResult = createQuestionSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const formError = validationResult.error.errors.find((err) => err.path.includes("options"))?.message;

      setErrors({
        text: fieldErrors.text?.[0],
        options: formError || fieldErrors.options?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        timeLimit,
        points,
        options,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save question";
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
      {errors.form && (
        <div className="bg-red-950/40 border border-red-800/50 text-red-300 px-3 py-2 rounded text-xs">
          {errors.form}
        </div>
      )}

      {/* Question Text */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Question Text <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter question prompt..."
          className={`w-full px-3 py-2 rounded-lg bg-zinc-950 border text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors resize-none ${
            errors.text ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500"
          }`}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.text && <p className="mt-1 text-xs text-red-400 font-medium">{errors.text}</p>}
      </div>

      {/* Question Settings (Time limit & Points) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Time Limit
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          >
            {TIME_LIMIT_OPTIONS.map((seconds) => (
              <option key={seconds} value={seconds}>
                {seconds} seconds
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Points
          </label>
          <select
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            disabled={isSubmitting}
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          >
            {POINTS_OPTIONS.map((pts) => (
              <option key={pts} value={pts}>
                {pts} points
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reusable Option Editor */}
      <OptionEditor
        options={options}
        onChange={setOptions}
        disabled={isSubmitting}
        error={errors.options}
      />

      {/* Form Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1.5 rounded-md text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-3 h-3 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );
}
