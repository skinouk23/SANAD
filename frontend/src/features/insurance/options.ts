/**
 * Insurance Query Options
 *
 * Pre-built queryOptions for every insurance query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { insuranceKeys } from './keys';
import {
  getInsuranceCoverage,
  getInsuranceClaims,
  getInsuranceDocuments,
  getInsuranceStats,
} from './service';

export function insuranceCoverageOptions() {
  return queryOptions({
    queryKey: insuranceKeys.coverage(),
    queryFn: () => getInsuranceCoverage(),
  });
}

export function insuranceClaimsOptions() {
  return queryOptions({
    queryKey: insuranceKeys.claims(),
    queryFn: () => getInsuranceClaims(),
  });
}

export function insuranceDocumentsOptions() {
  return queryOptions({
    queryKey: insuranceKeys.documents(),
    queryFn: () => getInsuranceDocuments(),
  });
}

export function insuranceStatsOptions() {
  return queryOptions({
    queryKey: insuranceKeys.stats(),
    queryFn: () => getInsuranceStats(),
  });
}
