/**
 * Auth Query Options
 *
 * Pre-built queryOptions for auth queries.
 */

import { queryOptions } from '@tanstack/react-query';
import { authKeys } from './keys';
import { getProfile } from './service';
import { getSecurityOverview } from './security-service';

export function authProfileOptions() {
  return queryOptions({
    queryKey: authKeys.profile(),
    queryFn: () => getProfile(),
    staleTime: 5 * 60 * 1000, // profile rarely changes mid-session
  });
}

export function authSecurityOptions() {
  return queryOptions({
    queryKey: authKeys.security(),
    queryFn: getSecurityOverview,
    staleTime: 30_000,
  });
}
