/**
 * Care Plan Query Key Factory
 *
 * Hierarchical keys enable granular invalidation:
 *   carePlanKeys.all                  → invalidate everything
 *   carePlanKeys.conditions()         → invalidate conditions
 *   carePlanKeys.medications()        → invalidate medications
 *   carePlanKeys.appointments()       → invalidate appointments
 *   carePlanKeys.tasks()              → invalidate tasks
 */

export const carePlanKeys = {
  all: ['care-plan'] as const,

  conditions: () => [...carePlanKeys.all, 'conditions'] as const,
  medications: () => [...carePlanKeys.all, 'medications'] as const,
  appointments: () => [...carePlanKeys.all, 'appointments'] as const,
  tasks: () => [...carePlanKeys.all, 'tasks'] as const,
} as const;
