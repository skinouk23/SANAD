/**
 * Rewards Query Options
 *
 * Pre-built queryOptions for every rewards query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { rewardsKeys } from './keys';
import { getRewardsProfile, getRewardLevels, getRecentActivity, getEarnActions } from './service';

export function rewardsProfileOptions() {
  return queryOptions({
    queryKey: rewardsKeys.profile(),
    queryFn: getRewardsProfile,
  });
}

export function rewardLevelsOptions() {
  return queryOptions({
    queryKey: rewardsKeys.levels(),
    queryFn: getRewardLevels,
  });
}

export function recentActivityOptions() {
  return queryOptions({
    queryKey: rewardsKeys.activity(),
    queryFn: getRecentActivity,
  });
}

export function earnActionsOptions() {
  return queryOptions({
    queryKey: rewardsKeys.earnActions(),
    queryFn: getEarnActions,
  });
}
