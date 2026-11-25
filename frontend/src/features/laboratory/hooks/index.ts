/**
 * Laboratory Hooks — barrel re-export
 */

export { useLaboratoryList, usePopularTests } from './useLaboratory';

// Re-export types for consumer convenience
export type { Laboratory, PopularTest } from '@/features/laboratory/schema';
