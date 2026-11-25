/**
 * Tunisian geographic zones for service area filtering.
 * Used by listing pages and filter dropdowns.
 */
export const ZONES_TN = [
  'Tunis',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous',
  'Sousse',
  'Sfax',
] as const;

export type ZoneTN = (typeof ZONES_TN)[number];
