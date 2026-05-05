'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { TestLevelCard } from '@/components/test/TestLevelCard';
import { TEST_LEVELS } from '@/lib/test-levels';

export default function TestSelectorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
          <p className="text-sm text-zinc-400">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg outline-none ring-offset-2 ring-offset-zinc-950 focus-visible:ring-2 focus-visible:ring-indigo-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-900/40">
              IQ
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight text-white">Adaptive IQ</span>
              <span className="hidden text-xs text-zinc-500 sm:block">Assessment</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="hidden text-sm text-zinc-400 sm:inline">
              Signed in as <span className="font-medium text-zinc-200">{user.username}</span>
            </span>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-3xl rounded-full bg-indigo-600/20 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center"
        >
          <p className="mb-3 inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-indigo-300">
            Choose starting difficulty
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Select your assessment track
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
            Pick a baseline band that fits you. The engine adapts difficulty live from your answers—this choice only sets the starting point.
          </p>
        </motion.div>

        <div className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {TEST_LEVELS.map((level, index) => (
            <TestLevelCard key={level.slug} level={level} index={index} />
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="relative mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm sm:p-8"
        >
          <h2 className="text-lg font-semibold text-white">How to choose</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Unsure? Start with <strong className="font-medium text-zinc-200">Advanced</strong>. You can exit and restart from another track anytime—each session is independent.
          </p>
          <ul className="mt-6 grid gap-4 text-sm text-zinc-400 sm:grid-cols-3 sm:gap-6">
            <li className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
              <span className="font-medium text-emerald-400">Basic</span>
              <span className="mt-1 block leading-relaxed">Lower cognitive load; great for first-time users.</span>
            </li>
            <li className="rounded-xl border border-indigo-500/25 bg-indigo-950/20 p-4 ring-1 ring-indigo-500/20">
              <span className="font-medium text-indigo-300">Advanced · recommended</span>
              <span className="mt-1 block leading-relaxed">Balanced challenge for most confident solvers.</span>
            </li>
            <li className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
              <span className="font-medium text-violet-400">Elite</span>
              <span className="mt-1 block leading-relaxed">Aggressive pacing and harder ceilings—only if you want peak difficulty.</span>
            </li>
          </ul>
          <p className="mt-6 border-t border-zinc-800 pt-5 text-xs leading-relaxed text-zinc-500">
            Not clinically normed. Results are educational only.
          </p>
        </motion.section>

        <div className="relative mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
