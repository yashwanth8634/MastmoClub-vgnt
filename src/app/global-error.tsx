"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-[100px] -z-10" />

        <div className="text-center max-w-2xl">
          <div className="flex items-center justify-center gap-3 text-red-400 mb-6 animate-pulse">
            <AlertTriangle size={48} />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/10 tracking-tighter mb-4">
            Critical Error
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Application Error
          </h2>

          <p className="text-gray-400 mb-8 leading-relaxed">
            A critical error has occurred. Please try refreshing the page. If
            the problem persists, contact support.
          </p>

          {process.env.NODE_ENV === "development" && error.message && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
              <p className="text-xs font-mono text-red-400 break-all">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-red-400 mt-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}

          <button
            onClick={reset}
            className="px-8 py-3 bg-math-cyan text-black font-bold rounded-full hover:bg-white transition-all inline-flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
