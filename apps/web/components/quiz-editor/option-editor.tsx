"use client";

import type { CreateOptionInput } from "@repo/validation";

interface OptionEditorProps {
  options: CreateOptionInput[];
  onChange: (options: CreateOptionInput[]) => void;
  disabled?: boolean;
  error?: string;
}

export function OptionEditor({ options, onChange, disabled, error }: OptionEditorProps) {
  const handleTextChange = (index: number, text: string) => {
    const next = options.map((opt, i) => (i === index ? { ...opt, text } : opt));
    onChange(next);
  };

  const handleSelectCorrect = (selectedIndex: number) => {
    const next = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === selectedIndex,
    }));
    onChange(next);
  };

  const handleAddOption = () => {
    const newOption: CreateOptionInput = {
      text: `Option ${options.length + 1}`,
      order: options.length,
      isCorrect: options.length === 0, // default first option as correct if empty
    };
    onChange([...options, newOption]);
  };

  const handleDeleteOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const isDeletedCorrect = options[index]?.isCorrect;
    const next = options.filter((_, i) => i !== index).map((opt, i) => ({
      ...opt,
      order: i,
    }));
    // If deleted option was correct, mark first remaining option as correct
    if (isDeletedCorrect && next[0]) {
      next[0].isCorrect = true;
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-zinc-300">
          Answer Options <span className="text-zinc-500">(select radio for correct answer)</span>
        </label>
        <span className="text-[11px] font-mono text-zinc-500">{options.length} options</span>
      </div>

      {error && (
        <div className="text-xs text-red-400 font-medium bg-red-950/30 border border-red-900/40 p-2 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {options.map((opt, index) => (
          <div
            key={index}
            className={`flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950 border transition-colors ${
              opt.isCorrect ? "border-emerald-700/60 bg-emerald-950/20" : "border-zinc-800"
            }`}
          >
            {/* Correct Answer Radio */}
            <label className="flex items-center gap-1.5 cursor-pointer shrink-0 px-1" title="Mark as correct answer">
              <input
                type="radio"
                name="correctOption"
                checked={opt.isCorrect}
                onChange={() => handleSelectCorrect(index)}
                disabled={disabled}
                className="w-4 h-4 text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500 focus:ring-offset-zinc-950 cursor-pointer"
              />
              <span className={`text-[10px] font-mono font-medium ${opt.isCorrect ? "text-emerald-400" : "text-zinc-500"}`}>
                {opt.isCorrect ? "CORRECT" : `#${index + 1}`}
              </span>
            </label>

            {/* Option Text Input */}
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              disabled={disabled}
              placeholder={`Option ${index + 1} text...`}
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none px-2 py-1"
            />

            {/* Delete Option Button */}
            <button
              type="button"
              onClick={() => handleDeleteOption(index)}
              disabled={disabled || options.length <= 2}
              title={options.length <= 2 ? "Minimum 2 options required" : "Delete option"}
              className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <button
          type="button"
          onClick={handleAddOption}
          disabled={disabled}
          className="w-full py-2 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Option</span>
        </button>
      )}
    </div>
  );
}
