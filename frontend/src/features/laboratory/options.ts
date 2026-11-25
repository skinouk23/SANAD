/**
 * Laboratory Query Options
 *
 * Pre-built queryOptions for every laboratory query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { laboratoryKeys } from './keys';
import { getLaboratoryList, getPopularTests } from './service';

export function laboratoryListOptions() {
  return queryOptions({
    queryKey: laboratoryKeys.lists(),
    queryFn: () => getLaboratoryList(),
  });
}

export function popularTestsOptions() {
  return queryOptions({
    queryKey: laboratoryKeys.popularTests(),
    queryFn: () => getPopularTests(),
  });
}
