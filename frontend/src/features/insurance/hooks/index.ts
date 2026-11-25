/**
 * Insurance Hooks — barrel re-export
 */

export {
  useInsuranceCoverage,
  useInsuranceClaims,
  useInsuranceDocuments,
  useInsuranceStats,
} from './useInsurance';

// Re-export types for consumer convenience
export type {
  CoverageItem,
  CoverageSection,
  InsuranceClaim,
  InsuranceDocument,
  InsuranceStats,
} from '@/features/insurance/schema';
