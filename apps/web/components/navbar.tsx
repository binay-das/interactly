"use client";

import { useAuth } from "../context/auth-context";
import Link from "next/link";
import { Logo } from "./ui/logo";
import { ThemeToggle } from "./ui/theme-toggle";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/90 dark:bg-[#161b22]/90 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-[#1f2328] dark:text-[#f0f6fc] hover:text-[#0969da] dark:hover:text-[#2f81f7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969da] dark:focus-visible:ring-[#2f81f7] rounded-md px-1 py-0.5"
        >
          <Logo size={24} className="rounded" />
          <span>Interactly</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#636c76] dark:text-[#8b949e] bg-[#f6f8fa] dark:bg-[#010409] border border-[#d0d7de] dark:border-[#30363d] px-2.5 py-1 rounded-md">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="text-xs font-medium px-3 py-1.5 rounded-md text-[#24292f] dark:text-[#c9d1d9] hover:text-[#1f2328] dark:hover:text-[#f0f6fc] bg-[#f6f8fa] dark:bg-[#21262d] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969da]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium px-3 py-1.5 rounded-md text-[#636c76] dark:text-[#8b949e] hover:text-[#1f2328] dark:hover:text-[#f0f6fc] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0969da]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-3 py-1.5 rounded-md text-white bg-[#1f883d] hover:bg-[#1a7f37] dark:bg-[#238636] dark:hover:bg-[#2ea043] border border-[#1a7f37] dark:border-[#238636] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238636]"
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