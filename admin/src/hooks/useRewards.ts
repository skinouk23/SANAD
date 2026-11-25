/**
 * Rewards Hooks
 * Custom React hooks for loyalty/rewards data based on appointments
 */

import { useApi } from './useApi';
import { useAppointments } from './useAppointments';
import { useMemo } from 'react';

// ============================================
// TYPES
// ============================================

export interface RewardLevel {
  level: string;
  minPoints: number;
  icon: string;
  color: string;
  benefits: string[];
  current?: boolean;
}

export interface RewardActivity {
  id: number;
  action: string;
  points: number;
  date: string;
}

export interface EarnPointsAction {
  action: string;
  points: number;
  icon: string;
}

export interface RewardsProfile {
  userPoints: number;
  userLevel: string;
  nextLevelPoints: number;
  completedAppointments: number;
  cancelledAppointments: number;
  cancellationRate: number;
  bonusPoints: number;
}

// ============================================
// POINTS CALCULATION
// ============================================

const POINTS_PER_COMPLETED = 50;
const BONUS_FOR_LOW_CANCELLATION = 100; // Bonus if cancellation rate < 10%
const PENALTY_PER_CANCELLATION = 25;

const calculateLevel = (points: number): string => {
  if (points >= 1000) return 'Platinum';
  if (points >= 500) return 'Gold';
  if (points >= 200) return 'Silver';
  return 'Bronze';
};

const getNextLevelPoints = (currentLevel: string): number => {
  switch (currentLevel) {
    case 'Bronze':
      return 200;
    case 'Silver':
      return 500;
    case 'Gold':
      return 1000;
    case 'Platinum':
      return 1000;
    default:
      return 200;
  }
};

// ============================================
// MOCK DATA
// ============================================

const mockLevels: RewardLevel[] = [
{
  level: 'Bronze',
  minPoints: 0,
  icon: '🥉',
  color: 'from-amber-600 to-orange-600',
  benefits: ['2% de réduction', 'Support standard']
},
{
  level: 'Silver',
  minPoints: 200,
  icon: '🥈',
  color: 'from-gray-400 to-gray-600',
  benefits: [
  '5% de réduction',
  'Support prioritaire',
  'Rappels SMS gratuits']

},
{
  level: 'Gold',
  minPoints: 500,
  icon: '🥇',
  color: 'from-yellow-400 to-yellow-600',
  benefits: [
  '10% de réduction',
  'Support VIP 24/7',
  'Annulation gratuite',
  'Accès prioritaire']

},
{
  level: 'Platinum',
  minPoints: 1000,
  icon: '💎',
  color: 'from-purple-400 to-purple-600',
  benefits: [
  '15% de réduction',
  'Concierge santé',
  'Tous les avantages Gold',
  'Cadeaux exclusifs']

}];


const mockEarnPointsActions: EarnPointsAction[] = [
{ action: 'Réserver un rendez-vous', points: 50, icon: '📅' },
{ action: 'Taux de présence élevé', points: 100, icon: '🎯' },
{ action: 'Parrainer un ami', points: 100, icon: '👥' },
{ action: 'Laisser un avis', points: 20, icon: '⭐' },
{ action: 'Compléter votre profil', points: 30, icon: '✏️' }];


// ============================================
// HOOKS
// ============================================

/**
 * Calculate rewards based on actual appointment data
 */
export function useRewardsProfile() {
  const { data: appointments, loading } = useAppointments({
    patientId: 'current-user'
  });

  const profile = useMemo<RewardsProfile>(() => {
    if (!appointments) {
      return {
        userPoints: 0,
        userLevel: 'Bronze',
        nextLevelPoints: 200,
        completedAppointments: 0,
        cancelledAppointments: 0,
        cancellationRate: 0,
        bonusPoints: 0
      };
    }

    const completed = appointments.filter((a) => a.status === 'completed');
    const cancelled = appointments.filter((a) => a.status === 'cancelled');
    const total = appointments.length;

    const completedCount = completed.length;
    const cancelledCount = cancelled.length;
    const cancellationRate = total > 0 ? cancelledCount / total * 100 : 0;

    // Calculate points
    let points = completedCount * POINTS_PER_COMPLETED;
    points -= cancelledCount * PENALTY_PER_CANCELLATION;

    // Bonus for low cancellation rate
    let bonusPoints = 0;
    if (total >= 5 && cancellationRate < 10) {
      bonusPoints = BONUS_FOR_LOW_CANCELLATION;
      points += bonusPoints;
    }

    // Ensure points don't go negative
    points = Math.max(0, points);

    const level = calculateLevel(points);
    const nextLevelPoints = getNextLevelPoints(level);

    return {
      userPoints: points,
      userLevel: level,
      nextLevelPoints,
      completedAppointments: completedCount,
      cancelledAppointments: cancelledCount,
      cancellationRate,
      bonusPoints
    };
  }, [appointments]);

  return {
    data: profile,
    loading
  };
}

export function useRewardLevels() {
  const { data: profile } = useRewardsProfile();

  const levels = useMemo(() => {
    return mockLevels.map((level) => ({
      ...level,
      current: level.level === profile?.userLevel
    }));
  }, [profile]);

  return {
    data: levels,
    loading: false
  };
}

export function useRecentRewardActivity() {
  const { data: appointments } = useAppointments({
    patientId: 'current-user',
    status: 'completed'
  });

  const activities = useMemo<RewardActivity[]>(() => {
    if (!appointments) return [];

    return appointments.slice(0, 10).map((apt, index) => ({
      id: index + 1,
      action: `Rendez-vous complété - ${apt.serviceName || 'Service'}`,
      points: POINTS_PER_COMPLETED,
      date: new Date(apt.scheduledAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long'
      })
    }));
  }, [appointments]);

  return {
    data: activities,
    loading: false
  };
}

export function useEarnPointsActions() {
  return {
    data: mockEarnPointsActions,
    loading: false
  };
}