import type { LucideIcon } from 'lucide-react';
import { Leaf, Compass, Sparkles } from 'lucide-react';

export type TestLevelSlug = 'basic' | 'advanced' | 'elite';

/** Stored on tests/questions in the API */
export type IqSection = '50-100' | '100-150' | '150+';

export type TestLevelConfig = {
  slug: TestLevelSlug;
  iqSection: IqSection;
  title: string;
  badge: string;
  iqRangeLabel: string;
  description: string;
  duration: string;
  difficulty: string;
  Icon: LucideIcon;
  recommended?: boolean;
  gradient: string;
  accent: string;
  ringHover: string;
  iconBg: string;
};

export const TEST_LEVELS: TestLevelConfig[] = [
  {
    slug: 'basic',
    iqSection: '50-100',
    title: 'Basic',
    badge: 'Beginner',
    iqRangeLabel: '50 – 100',
    description:
      'Foundational patterns and straightforward logic. Ideal if you are new to cognitive assessments or want a calm onboarding.',
    duration: '20–30 min',
    difficulty: 'Easy – moderate',
    Icon: Leaf,
    gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    accent: 'text-emerald-600',
    ringHover: 'hover:ring-emerald-500/40',
    iconBg: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/25'
  },
  {
    slug: 'advanced',
    iqSection: '100-150',
    title: 'Advanced',
    badge: 'Recommended',
    iqRangeLabel: '100 – 150',
    description:
      'Multi-step reasoning, abstraction, and pattern depth. Best starting point for most users who want a fair challenge.',
    duration: '25–40 min',
    difficulty: 'Moderate – hard',
    Icon: Compass,
    recommended: true,
    gradient: 'from-indigo-500/15 via-violet-500/10 to-transparent',
    accent: 'text-indigo-600',
    ringHover: 'hover:ring-indigo-500/45',
    iconBg: 'bg-indigo-500/15 text-indigo-700 ring-indigo-500/30'
  },
  {
    slug: 'elite',
    iqSection: '150+',
    title: 'Elite',
    badge: 'Expert',
    iqRangeLabel: '150+',
    description:
      'High-ceiling items across domains. For experienced problem-solvers; pacing is tighter and items ramp aggressively.',
    duration: '20–35 min',
    difficulty: 'Very hard',
    Icon: Sparkles,
    gradient: 'from-violet-500/18 via-fuchsia-500/12 to-transparent',
    accent: 'text-violet-700',
    ringHover: 'hover:ring-violet-500/45',
    iconBg: 'bg-violet-500/15 text-violet-800 ring-violet-500/30'
  }
];

const SLUG_SET = new Set(TEST_LEVELS.map((l) => l.slug));

export function isTestLevelSlug(value: string): value is TestLevelSlug {
  return SLUG_SET.has(value as TestLevelSlug);
}

export function getLevelBySlug(slug: string): TestLevelConfig | undefined {
  return TEST_LEVELS.find((l) => l.slug === slug);
}

export function slugToIqSection(slug: string): IqSection | null {
  const level = getLevelBySlug(slug.toLowerCase());
  return level ? level.iqSection : null;
}

export function iqSectionDisplayName(section: IqSection): string {
  switch (section) {
    case '50-100':
      return 'Basic (50–100)';
    case '100-150':
      return 'Advanced (100–150)';
    case '150+':
      return 'Elite (150+)';
    default:
      return section;
  }
}
