"use client";

import { Navbar } from "../components/navbar";
import { useAuth } from "../context/auth-context";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-zinc-800">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col justify-center">
        <div className="mb-6">
          <span className="inline-flex items-center text-xs font-mono tracking-tight text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
            Real-time quiz engine
          </span>
        </div>

        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.1]">
            Interactive live quizzes, engineered for real-time speed.
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
            Host live quiz sessions, track real-time leaderboards, and process responses instantantly with zero setup overhead. Built for high-concurrency audiences.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {!isLoading && user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-md text-zinc-950 font-medium bg-zinc-100 hover:bg-zinc-200 transition-colors text-sm"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-md text-zinc-950 font-medium bg-zinc-100 hover:bg-zinc-200 transition-colors text-sm"
              >
                Get Started as Admin
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-md text-zinc-300 font-medium border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors text-sm"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-zinc-900 pt-12">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-200">Sub-millisecond Latency</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Synchronized question delivery and score calculations powered by lightweight WebSockets.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-200">Live Leaderboards</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Real-time score recalculation and ranking updates with instant visual feedback for hosts.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-200">Session Management</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Full control over lobby states, user validation, and automated session tear-down.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Interactly</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}