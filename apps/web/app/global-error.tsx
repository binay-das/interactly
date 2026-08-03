"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/80 text-red-400 mx-auto flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-100">Something went wrong!</h2>
            <p className="text-xs text-zinc-400">{error.message || "An unexpected system error occurred."}</p>
          </div>
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-indigo-400 hover:bg-indigo-300 transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
