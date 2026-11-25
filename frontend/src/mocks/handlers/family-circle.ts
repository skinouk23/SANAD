/**
 * Family Circle MSW Handlers
 *
 * Intercepts family-circle and related patient dashboard requests during
 * development. Family-circle mutations persist in-memory for the current
 * browser session so refetches stay consistent.
 */

import { http, HttpResponse } from 'msw';

import {
  addFamilyCircleMember,
  getFamilyCircleMembers,
  removeFamilyCircleMember,
} from '@/mocks/handlers/familyCircleStore';
import { apiNotFound, apiOk } from '@/mocks/utils';

import type { AddFamilyMemberRequest } from '@/features/family-circle/schema';

interface PendingValidationMock {
  id: string;
  providerName: string;
  providerImage: string;
  serviceName: string;
  amount: number;
  date: string;
  time: string;
  hoursAgo: number;
  autoValidationIn: string;
}

const mockPendingValidations: PendingValidationMock[] = [
  {
    id: 'apt_123',
    providerName: 'Amira Mansour',
    providerImage: '👩‍⚕️',
    serviceName: 'Soins Infirmiers - Injection',
    amount: 40,
    date: '15 Jan 2025',
    time: '14:30',
    hoursAgo: 2,
    autoValidationIn: '46h',
  },
  {
    id: 'apt_124',
    providerName: 'Dr. Karim Jebali',
    providerImage: '👨‍⚕️',
    serviceName: 'Kinésithérapie',
    amount: 65,
    date: '14 Jan 2025',
    time: '10:00',
    hoursAgo: 26,
    autoValidationIn: '22h',
  },
];

// ============================================
// HANDLERS
// ============================================

export const familyCircleHandlers = [
  // ── GET /api/patients/me/family-circle ─────────────────────
  http.get('*/api/v1/patients/me/family-circle', () => {
    return apiOk(getFamilyCircleMembers());
  }),

  // ── POST /api/patients/me/family-circle ────────────────────
  http.post('*/api/v1/patients/me/family-circle', async ({ request }) => {
    const body = (await request.json()) as AddFamilyMemberRequest;
    return apiOk(addFamilyCircleMember(body));
  }),

  // ── DELETE /api/patients/me/family-circle/:memberId ────────
  http.delete('*/api/v1/patients/me/family-circle/:memberId', ({ params }) => {
    const removed = removeFamilyCircleMember(params.memberId as string);

    if (!removed) {
      return apiNotFound(`Family member ${params.memberId as string} not found`);
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // ── GET /api/v1/patients/me/pending-validations ───────────────
  http.get('*/api/v1/patients/me/pending-validations', () => {
    return apiOk(mockPendingValidations);
  }),

  // ── GET /api/v1/patients/me/stats ──────────────────────────
  http.get('*/api/v1/patients/me/stats', () => {
    return apiOk({
      totalAppointments: 24,
      completedAppointments: 18,
      upcomingAppointments: 3,
      totalSpent: 1250.0,
      careStreakDays: 12,
      longestStreak: 30,
      totalPoints: 450,
      badgesEarned: 5,
      lastAppointmentDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      favoriteProviders: 4,
    });
  }),
];
