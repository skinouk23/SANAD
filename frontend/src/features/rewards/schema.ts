/**
 * Rewards Schemas
 * Zod schemas for loyalty/rewards types.
 */

import { z } from 'zod';

// ============================================
// REWARD LEVEL
// ============================================

export const RewardLevelSchema = z.object({
  level: z.string(),
  minPoints: z.number(),
  icon: z.string(),
  color: z.string(),
  benefits: z.array(z.string()),
  current: z.boolean().optional(),
});

// ============================================
// REWARD ACTIVITY
// ============================================

export const RewardActivitySchema = z.object({
  id: z.number(),
  action: z.string(),
  points: z.number(),
  date: z.string(),
});

// ============================================
// EARN POINTS ACTION
// ============================================

export const EarnPointsActionSchema = z.object({
  action: z.string(),
  points: z.number(),
  icon: z.string(),
});

// ============================================
// REWARDS PROFILE
// ============================================

export const RewardsProfileSchema = z.object({
  userPoints: z.number(),
  userLevel: z.string(),
  nextLevelPoints: z.number(),
  completedAppointments: z.number(),
  cancelledAppointments: z.number(),
  cancellationRate: z.number(),
  bonusPoints: z.number(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type RewardLevel = z.infer<typeof RewardLevelSchema>;
export type RewardActivity = z.infer<typeof RewardActivitySchema>;
export type EarnPointsAction = z.infer<typeof EarnPointsActionSchema>;
export type RewardsProfile = z.infer<typeof RewardsProfileSchema>;
