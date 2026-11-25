/**
 * Rewards MSW Handlers
 *
 * Intercepts all /api/rewards requests during development.
 * The profile endpoint returns pre-computed data matching what
 * the old useRewardsProfile computed from appointment history.
 *
 * Sub-routes (/levels, /activity, /earn-actions) are registered before
 * the /profile route to prevent shadowing.
 */

import { http } from 'msw';

import type {
  RewardsProfile,
  RewardLevel,
  RewardActivity,
  EarnPointsAction,
} from '@/features/rewards/schema';
import { apiOk } from '@/mocks/utils';

// ============================================
// MOCK DATA
// ============================================

/** Pre-computed profile: 10 completed × 50pts − 1 cancelled × 25pts + 100 bonus = 575 → Gold */
const mockProfile: RewardsProfile = {
  userPoints: 575,
  userLevel: 'Gold',
  nextLevelPoints: 1000,
  completedAppointments: 10,
  cancelledAppointments: 1,
  cancellationRate: 8.33,
  bonusPoints: 100,
};

const mockLevels: RewardLevel[] = [
  {
    level: 'Bronze',
    minPoints: 0,
    icon: '🥉',
    color: 'from-amber-600 to-orange-600',
    benefits: ['2% de réduction', 'Support standard'],
    current: false,
  },
  {
    level: 'Silver',
    minPoints: 200,
    icon: '🥈',
    color: 'from-gray-400 to-gray-600',
    benefits: ['5% de réduction', 'Support prioritaire', 'Rappels SMS gratuits'],
    current: false,
  },
  {
    level: 'Gold',
    minPoints: 500,
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
    benefits: ['10% de réduction', 'Support VIP 24/7', 'Annulation gratuite', 'Accès prioritaire'],
    current: true,
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
      'Cadeaux exclusifs',
    ],
    current: false,
  },
];

const mockActivity: RewardActivity[] = [
  {
    id: 1,
    action: 'Rendez-vous complété - Soins Infirmiers',
    points: 50,
    date: '15 janvier',
  },
  {
    id: 2,
    action: 'Rendez-vous complété - Kinésithérapie',
    points: 50,
    date: '12 janvier',
  },
  {
    id: 3,
    action: 'Rendez-vous complété - Consultation',
    points: 50,
    date: '8 janvier',
  },
  {
    id: 4,
    action: 'Rendez-vous complété - Soins à domicile',
    points: 50,
    date: '3 janvier',
  },
  {
    id: 5,
    action: 'Rendez-vous complété - Prise de sang',
    points: 50,
    date: '28 décembre',
  },
];

const mockEarnActions: EarnPointsAction[] = [
  { action: 'Réserver un rendez-vous', points: 50, icon: '📅' },
  { action: 'Taux de présence élevé', points: 100, icon: '🎯' },
  { action: 'Parrainer un ami', points: 100, icon: '👥' },
  { action: 'Laisser un avis', points: 20, icon: '⭐' },
  { action: 'Compléter votre profil', points: 30, icon: '✏️' },
];

// ============================================
// ============================================
// HANDLERS
// ============================================

export const rewardsHandlers = [
  // ── GET /api/rewards/levels ────────────────────────────────
  // (registered before /profile to prevent route shadowing)
  http.get('*/api/v1/rewards/levels', () => {
    return apiOk(mockLevels);
  }),

  // ── GET /api/rewards/activity ──────────────────────────────
  http.get('*/api/v1/rewards/activity', () => {
    return apiOk(mockActivity);
  }),

  // ── GET /api/rewards/earn-actions ──────────────────────────
  http.get('*/api/v1/rewards/earn-actions', () => {
    return apiOk(mockEarnActions);
  }),

  // ── GET /api/rewards/profile ───────────────────────────────
  http.get('*/api/v1/rewards/profile', () => {
    return apiOk(mockProfile);
  }),
];
