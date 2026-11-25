/**
 * Care Plan Hooks — barrel re-export
 */

export {
  useChronicConditions,
  useMedications,
  useCarePlanAppointments,
  useDailyTasks,
} from './useCarePlan';

// Re-export types for consumer convenience
export type {
  ChronicCondition,
  Medication,
  CarePlanAppointment,
  DailyTask,
} from '@/features/care-plan/schema';
