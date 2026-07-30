"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JoinForm } from "../../components/player/join-form";
import { reconnectPlayerApi } from "../../lib/api-client";

interface JoinPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default function JoinPage({ searchParams }: JoinPageProps) {
  const router = useRouter();
  const { code: codeParam } = use(searchParams);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSavedSession = async () => {
      if (typeof window === "undefined") {
        setIsCheckingSession(false);
        return;
      }

      const raw = localStorage.getItem("interactly_player_session");
      if (!raw) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const stored = JSON.parse(raw);
        if (stored.reconnectToken && stored.sessionId) {
          const res = await reconnectPlayerApi({
            reconnectToken: stored.reconnectToken,
            sessionId: stored.sessionId,
          });

          if (res.sessionState && res.sessionState !== "FINISHED") {
            router.push("/play");
            return;
          }
        }
      } catch {
        localStorage.removeItem("interactly_player_session");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSavedSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-zinc-800">
      {isCheckingSession ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Checking active game session...</p>
        </div>
      ) : (
        <JoinForm initialCode={codeParam || ""} />
      )}
    </div>
  );
}
