/**
 * Canonical IQ tier keys stored in MongoDB and used across services.
 */
export const IQ_SECTIONS = ['50-100', '100-150', '150+'] as const;
export type IqSectionCanonical = (typeof IQ_SECTIONS)[number];

const LEGACY_TO_CANONICAL: Record<string, IqSectionCanonical> = {
  '50-100': '50-100',
  '100-150': '100-150',
  '150+': '150+',
  basic: '50-100',
  advanced: '100-150',
  elite: '150+'
};

/**
 * Normalizes client/path input to a canonical iq_section.
 * Fixes common bug: path "150+" decoded as "150 " (plus → space).
 */
export function normalizeIqSection(raw: unknown): { ok: true; iq_section: IqSectionCanonical } | { ok: false; error: string } {
  if (raw === undefined || raw === null) {
    return { ok: false, error: 'iq_section is required' };
  }

  let s = String(raw).trim();

  // URL decoding often turns "150+" into "150" (plus → space, then trimmed away)
  if (s === '150') {
    s = '150+';
  }

  const lower = s.toLowerCase();
  const canonical = LEGACY_TO_CANONICAL[lower] ?? LEGACY_TO_CANONICAL[s];

  if (canonical) {
    return { ok: true, iq_section: canonical };
  }

  return {
    ok: false,
    error: `Invalid iq_section. Expected one of: ${IQ_SECTIONS.join(', ')}, or aliases: basic, advanced, elite`
  };
}
