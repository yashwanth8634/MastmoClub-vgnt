"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: Log the error to an error reporting service
    console.error("Admin Panel Crash:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-400 text-sm mb-6">
          {error.message || "An unexpected error occurred in the dashboard."}
        </p>
        <button
          onClick={() => reset()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}