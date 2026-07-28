"use client";

import { useAuth } from "../context/auth-context";
import Link from "next/link";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link 
          href="/"
          className="text-base font-bold tracking-tight text-zinc-100 hover:text-zinc-300 transition-colors"
        >
          Interactly
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="text-xs font-medium px-3 py-1.5 rounded-md text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium px-3 py-1.5 rounded-md text-zinc-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium px-3 py-1.5 rounded-md text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}