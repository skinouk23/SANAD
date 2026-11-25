/**
 * Rewards Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 *
 * The old useRewardsProfile computed points from appointment data via
 * useAppointments. The new hook fetches pre-computed profile data from
 * the server (MSW returns realistic mock data with the same computation).
 */

import { useQuery } from '@tanstack/react-query';
import {
  rewardsProfileOptions,
  rewardLevelsOptions,
  recentActivityOptions,
  earnActionsOptions,
} from '@/features/rewards/options';
import type {
  RewardsProfile,
  RewardLevel,
  RewardActivity,
  EarnPointsAction,
} from '@/features/rewards/schema';

/**
 * Fetch the user's rewards profile.
 */
export function useRewardsProfile() {
  const query = useQuery(rewardsProfileOptions());

  return {
    data: (query.data as RewardsProfile | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch reward levels with the current user's level marked.
 */
export function useRewardLevels() {
  const query = useQuery(rewardLevelsOptions());

  return {
    data: (query.data as RewardLevel[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch recent reward activity.
 */
export function useRecentRewardActivity() {
  const query = useQuery(recentActivityOptions());

  return {
    data: (query.data as RewardActivity[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch ways to earn points.
 */
export function useEarnPointsActions() {
  const query = useQuery(earnActionsOptions());

  return {
    data: (query.data as EarnPointsAction[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
