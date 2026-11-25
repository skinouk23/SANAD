/**
 * Care Plan Schemas
 * Zod schemas for care plan types: conditions, medications, appointments, tasks.
 */

import { z } from 'zod';

// ============================================
// CHRONIC CONDITION
// ============================================

export const ChronicConditionSchema = z.object({
  id: z.number(),
  name: z.string(),
  since: z.string(),
  status: z.string(),
  icon: z.string(),
});

// ============================================
// MEDICATION
// ============================================

export const MedicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  nextRefill: z.string(),
  stock: z.number(),
  condition: z.string(),
});

// ============================================
// CARE PLAN APPOINTMENT
// ============================================

export const CarePlanAppointmentSchema = z.object({
  id: z.number(),
  type: z.string(),
  date: z.string(),
  time: z.string(),
  doctor: z.string().optional(),
  location: z.string().optional(),
  status: z.string(),
});

// ============================================
// DAILY TASK
// ============================================

export const DailyTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  frequency: z.string(),
  completed: z.boolean(),
  time: z.string(),
});

// ============================================
// INFERRED TYPES
// ============================================

export type ChronicCondition = z.infer<typeof ChronicConditionSchema>;
export type Medication = z.infer<typeof MedicationSchema>;
export type CarePlanAppointment = z.infer<typeof CarePlanAppointmentSchema>;
export type DailyTask = z.infer<typeof DailyTaskSchema>;
