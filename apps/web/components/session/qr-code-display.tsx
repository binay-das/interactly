"use client";

import { useState } from "react";

interface QRCodeDisplayProps {
  joinCode: string;
  targetUrl?: string;
}

export function QRCodeDisplay({ joinCode, targetUrl }: QRCodeDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const url =
    targetUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/join?code=${joinCode}`
      : `https://interactly.app/join?code=${joinCode}`);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    url
  )}&color=ffffff&bgcolor=18181b`;

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-lg">
        <div className="mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Scan to Join
          </h4>
          <p className="text-[11px] text-zinc-500 mt-0.5">Quick smartphone scan</p>
        </div>

        <div
          onClick={() => setIsFullscreen(true)}
          className="relative bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group my-2"
          title="Click to enlarge QR Code"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt={`QR code to join with code ${joinCode}`}
            className="w-40 h-40 object-contain rounded-lg"
          />
          <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <span className="text-[10px] font-semibold text-zinc-200 bg-zinc-800/90 px-2.5 py-1 rounded-md border border-zinc-700">
              Enlarge QR
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsFullscreen(true)}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors mt-2 flex items-center gap-1 font-medium cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span>Fullscreen QR</span>
        </button>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-lg w-full text-center relative shadow-2xl space-y-6">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Scan with smartphone camera
              </p>
              <h2 className="text-3xl font-extrabold text-zinc-100 mt-1">
                Join Quiz Session
              </h2>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 inline-block shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                  url
                )}&color=ffffff&bgcolor=18181b`}
                alt="Enlarged QR Code"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto"
              />
            </div>

            <div>
              <p className="text-sm text-zinc-400">Join Code:</p>
              <span className="font-mono text-4xl font-extrabold tracking-widest text-indigo-400">
                {joinCode}
              </span>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              Close Fullscreen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
