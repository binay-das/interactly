"use client";

import { useState } from "react";

interface JoinCodeDisplayProps {
  joinCode: string;
  joinUrl?: string;
}

export function JoinCodeDisplay({ joinCode, joinUrl }: JoinCodeDisplayProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const defaultJoinUrl =
    joinUrl || (typeof window !== "undefined" ? `${window.location.origin}/join?code=${joinCode}` : `/join?code=${joinCode}`);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(defaultJoinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
    }
  };

  return (
    <div className="bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <svg className="w-32 h-32 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      <p className="text-xs uppercase tracking-widest font-mono text-zinc-400 font-semibold mb-2">
        Game Join Code
      </p>

      <div className="my-3">
        <span className="font-mono text-4xl sm:text-6xl font-extrabold tracking-widest text-zinc-100 bg-clip-text bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 selection:bg-zinc-800">
          {joinCode}
        </span>
      </div>

      <p className="text-xs text-zinc-400 mb-6">
        Players enter this code at <span className="text-indigo-400 font-mono">interactly.app/join</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleCopyCode}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {copiedCode ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Code Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Join Code</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          {copiedLink ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Copy Direct Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
