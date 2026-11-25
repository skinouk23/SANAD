/**
 * Rewards Service
 *
 * Pure API client for the rewards domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 *
 * The old useRewards hook computed the profile from appointment data.
 * The new service fetches pre-computed profile from the server (or MSW mock).
 */

import { z } from 'zod';
import { api } from '@/api/client';
import {
  RewardsProfileSchema,
  RewardLevelSchema,
  RewardActivitySchema,
  EarnPointsActionSchema,
} from './schema';
import type { RewardsProfile, RewardLevel, RewardActivity, EarnPointsAction } from './schema';

/** Fetch the user's rewards profile (pre-computed by the server). */
export async function getRewardsProfile(): Promise<RewardsProfile> {
  const raw = await api.get<RewardsProfile>('/rewards/profile');
  return RewardsProfileSchema.parse(raw);
}

/** Fetch all reward levels with benefits. */
export async function getRewardLevels(): Promise<RewardLevel[]> {
  const raw = await api.get<RewardLevel[]>('/rewards/levels');
  return z.array(RewardLevelSchema).parse(raw);
}

/** Fetch recent reward activity. */
export async function getRecentActivity(): Promise<RewardActivity[]> {
  const raw = await api.get<RewardActivity[]>('/rewards/activity');
  return z.array(RewardActivitySchema).parse(raw);
}

/** Fetch ways to earn points. */
export async function getEarnActions(): Promise<EarnPointsAction[]> {
  const raw = await api.get<EarnPointsAction[]>('/rewards/earn-actions');
  return z.array(EarnPointsActionSchema).parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const rewardsService = {
  getRewardsProfile,
  getRewardLevels,
  getRecentActivity,
  getEarnActions,
};
