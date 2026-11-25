/**
 * Geographic Zones — single source of truth
 *
 * Shared across service listing pages that expose a zone filter.
 * Each code maps to a translation key `t.serviceListing.zone_<code>`.
 */

export const ZONES = [
  'tunis',
  'ariana',
  'la_marsa',
  'carthage',
  'manouba',
  'ben_arous',
  'sousse',
  'sfax',
  'nabeul',
  'monastir',
] as const;

export type Zone = (typeof ZONES)[number];

/** Display label lookup (French fallback — use `t.serviceListing.zone_<code>` for i18n). */
export const ZONE_LABELS: Record<Zone, string> = {
  tunis: 'Tunis',
  ariana: 'Ariana',
  la_marsa: 'La Marsa',
  carthage: 'Carthage',
  manouba: 'Manouba',
  ben_arous: 'Ben Arous',
  sousse: 'Sousse',
  sfax: 'Sfax',
  nabeul: 'Nabeul',
  monastir: 'Monastir',
};
