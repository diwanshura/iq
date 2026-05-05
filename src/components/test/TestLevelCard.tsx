'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TestLevelConfig } from '@/lib/test-levels';

type Props = {
  level: TestLevelConfig;
  index: number;
};

export function TestLevelCard({ level, index }: Props) {
  const { slug, title, badge, iqRangeLabel, description, duration, difficulty, Icon, recommended, gradient, accent, ringHover, iconBg } =
    level;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={`/test/${slug}`} className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-2xl">
        <article
          className={cn(
            'relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-sm backdrop-blur-sm transition-all duration-300',
            'ring-1 ring-transparent hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-black/40',
            ringHover,
            recommended && 'ring-indigo-500/35 md:border-indigo-500/40'
          )}
        >
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-300 group-hover:opacity-100',
              gradient
            )}
          />

          <div className="relative flex flex-1 flex-col">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl ring-1', iconBg)}>
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1',
                  recommended
                    ? 'bg-indigo-500/20 text-indigo-200 ring-indigo-400/40'
                    : 'bg-zinc-800/90 text-zinc-300 ring-zinc-600/60'
                )}
              >
                {badge}
              </span>
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
            <p className={cn('mt-1 text-sm font-medium', accent)}>IQ range · {iqRangeLabel}</p>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">{description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-800/80 pt-5 text-xs">
              <div>
                <dt className="font-medium text-zinc-500">Duration</dt>
                <dd className="mt-0.5 text-zinc-200">{duration}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Difficulty</dt>
                <dd className="mt-0.5 text-zinc-200">{difficulty}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.06] transition-colors duration-300 group-hover:bg-white/[0.07]">
              <span className="text-sm font-medium text-white">Start test</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-indigo-500">
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
