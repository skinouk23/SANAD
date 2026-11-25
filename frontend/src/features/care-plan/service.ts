/**
 * Care Plan Service
 *
 * Pure API client for the care-plan domain. Every function makes a real
 * HTTP call via the shared Axios instance — zero mock branching.
 * MSW intercepts these requests during development.
 */

import { z } from 'zod';
import { api } from '@/api/client';
import {
  ChronicConditionSchema,
  MedicationSchema,
  CarePlanAppointmentSchema,
  DailyTaskSchema,
} from './schema';
import type { ChronicCondition, Medication, CarePlanAppointment, DailyTask } from './schema';

/** Fetch chronic conditions for the current patient. */
export async function getConditions(): Promise<ChronicCondition[]> {
  const raw = await api.get<ChronicCondition[]>('/care-plan/conditions');
  return z.array(ChronicConditionSchema).parse(raw);
}

/** Fetch medications for the current patient. */
export async function getMedications(): Promise<Medication[]> {
  const raw = await api.get<Medication[]>('/care-plan/medications');
  return z.array(MedicationSchema).parse(raw);
}

/** Fetch care plan appointments for the current patient. */
export async function getAppointments(): Promise<CarePlanAppointment[]> {
  const raw = await api.get<CarePlanAppointment[]>('/care-plan/appointments');
  return z.array(CarePlanAppointmentSchema).parse(raw);
}

/** Fetch daily tasks for the current patient. */
export async function getTasks(): Promise<DailyTask[]> {
  const raw = await api.get<DailyTask[]>('/care-plan/tasks');
  return z.array(DailyTaskSchema).parse(raw);
}

// ============================================
// SERVICE OBJECT (convenience re-export)
// ============================================

export const carePlanService = {
  getConditions,
  getMedications,
  getAppointments,
  getTasks,
};
