/**
 * Insurance Feature — public API
 *
 * Consumers import from here or from the hooks barrel.
 */

export * from './hooks';
export { insuranceKeys } from './keys';
export { insuranceService } from './service';
export {
  insuranceCoverageOptions,
  insuranceClaimsOptions,
  insuranceDocumentsOptions,
  insuranceStatsOptions,
} from './options';
