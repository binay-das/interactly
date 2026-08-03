import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-zinc-800">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/80 text-indigo-400 mx-auto flex items-center justify-center text-3xl font-mono font-bold shadow-inner">
          404
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-zinc-100">Page Not Found</h1>
          <p className="text-xs text-zinc-400">
            The page or game session you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/"
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-indigo-400 hover:bg-indigo-300 transition-all text-center shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Go to Home
          </Link>
          <Link
            href="/join"
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Join Game
          </Link>
        </div>
      </div>
    </div>
  );
}
