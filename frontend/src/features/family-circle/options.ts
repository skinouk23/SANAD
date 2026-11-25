/**
 * Family Circle Query Options
 *
 * Pre-built queryOptions for every family-circle query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { familyCircleKeys } from './keys';
import { getFamilyMembers } from './service';

export function familyMembersOptions() {
  return queryOptions({
    queryKey: familyCircleKeys.members(),
    queryFn: getFamilyMembers,
  });
}
