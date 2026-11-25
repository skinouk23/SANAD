/**
 * Care Plan MSW Handlers
 *
 * Intercepts all /api/care-plan requests during development
 * and returns realistic mock data extracted from the old useCarePlan hook.
 */

import { http } from 'msw';

import type {
  ChronicCondition,
  Medication,
  CarePlanAppointment,
  DailyTask,
} from '@/features/care-plan/schema';
import { apiOk } from '@/mocks/utils';

// ============================================
// MOCK DATA
// ============================================

const mockConditions: ChronicCondition[] = [
  {
    id: 1,
    name: 'Hypertension artérielle',
    since: 'Depuis 2020',
    status: 'controlled',
    icon: '❤️',
  },
  {
    id: 2,
    name: 'Diabète type 2',
    since: 'Depuis 2018',
    status: 'monitored',
    icon: '🩺',
  },
];

const mockMedications: Medication[] = [
  {
    id: 1,
    name: 'Amlodipine 5mg',
    dosage: '1 comprimé le matin',
    frequency: 'Quotidien',
    nextRefill: '25 Jan 2024',
    stock: 15,
    condition: 'Hypertension',
  },
  {
    id: 2,
    name: 'Metformine 850mg',
    dosage: '1 comprimé matin et soir',
    frequency: '2x par jour',
    nextRefill: '20 Jan 2024',
    stock: 8,
    condition: 'Diabète',
  },
];

const mockAppointments: CarePlanAppointment[] = [
  {
    id: 1,
    type: 'Consultation cardiologie',
    date: '25 Jan 2024',
    time: '10:00',
    doctor: 'Dr. Trabelsi',
    status: 'upcoming',
  },
  {
    id: 2,
    type: 'Prise de sang',
    date: '30 Jan 2024',
    time: '08:00',
    location: 'Laboratoire Central',
    status: 'upcoming',
  },
  {
    id: 3,
    type: 'Suivi diabétologie',
    date: '5 Fév 2024',
    time: '14:30',
    doctor: 'Dr. Ben Ali',
    status: 'scheduled',
  },
];

const mockTasks: DailyTask[] = [
  {
    id: 1,
    title: 'Mesurer la tension',
    frequency: 'Quotidien - Matin',
    completed: true,
    time: '08:00',
  },
  {
    id: 2,
    title: 'Glycémie à jeun',
    frequency: 'Quotidien - Matin',
    completed: true,
    time: '07:30',
  },
  {
    id: 3,
    title: 'Prendre Amlodipine',
    frequency: 'Quotidien - Matin',
    completed: false,
    time: '09:00',
  },
  {
    id: 4,
    title: 'Marche 30 minutes',
    frequency: 'Quotidien - Après-midi',
    completed: false,
    time: '17:00',
  },
];

// ============================================
// ============================================
// HANDLERS
// ============================================

export const carePlanHandlers = [
  // ── GET /api/care-plan/conditions ─────────────────────────
  http.get('*/api/v1/care-plan/conditions', () => {
    return apiOk(mockConditions);
  }),

  // ── GET /api/care-plan/medications ────────────────────────
  http.get('*/api/v1/care-plan/medications', () => {
    return apiOk(mockMedications);
  }),

  // ── GET /api/care-plan/appointments ───────────────────────
  http.get('*/api/v1/care-plan/appointments', () => {
    return apiOk(mockAppointments);
  }),

  // ── GET /api/care-plan/tasks ──────────────────────────────
  http.get('*/api/v1/care-plan/tasks', () => {
    return apiOk(mockTasks);
  }),
];
