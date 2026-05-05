'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function TestSessionError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Test session error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4">
      <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur-sm">
        <h1 className="text-lg font-semibold text-white">This session hit an error</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {error.message || 'An unexpected problem occurred. You can retry or return to level selection.'}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Try again
          </button>
          <Link
            href="/test"
            className="rounded-xl border border-zinc-700 px-4 py-2.5 text-center text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            Choose level
          </Link>
        </div>
      </div>
    </div>
  );
}
