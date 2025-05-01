"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-8xl font-bold text-neon-pink animate-pulse">Error</h1>
      <p className="mt-6 text-xl text-gray-300">Something went wrong</p>
      <p className="mt-3 text-gray-400 text-center">
        {error?.message || "An unexpected error occurred"}
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={reset}
          className="px-6 py-2 border border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-all rounded-md"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-all rounded-md"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
