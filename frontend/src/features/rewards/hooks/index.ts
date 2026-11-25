/**
 * Rewards Hooks — barrel re-export
 */

export {
  useRewardsProfile,
  useRewardLevels,
  useRecentRewardActivity,
  useEarnPointsActions,
} from './useRewards';

// Re-export types for consumer convenience
export type {
  RewardsProfile,
  RewardLevel,
  RewardActivity,
  EarnPointsAction,
} from '@/features/rewards/schema';
