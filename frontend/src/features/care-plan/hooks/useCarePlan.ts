/**
 * Care Plan Fetch Hooks (TanStack Query)
 *
 * Drop-in replacements for the old useApi-based hooks.
 * Each returns { data, loading, error, refetch } to match the existing API.
 *
 * useDailyTasks is special: useQuery provides the initial task list, then
 * local useState manages toggle state (optimistic client-only mutation).
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  conditionsOptions,
  medicationsOptions,
  carePlanAppointmentsOptions,
  dailyTasksOptions,
} from '@/features/care-plan/options';
import type {
  ChronicCondition,
  Medication,
  CarePlanAppointment,
  DailyTask,
} from '@/features/care-plan/schema';

/**
 * Fetch chronic conditions.
 */
export function useChronicConditions() {
  const query = useQuery(conditionsOptions());

  return {
    data: (query.data as ChronicCondition[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch medications.
 */
export function useMedications() {
  const query = useQuery(medicationsOptions());

  return {
    data: (query.data as Medication[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch care plan appointments.
 */
export function useCarePlanAppointments() {
  const query = useQuery(carePlanAppointmentsOptions());

  return {
    data: (query.data as CarePlanAppointment[] | undefined) ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch daily tasks with local toggle support.
 *
 * useQuery provides the server task list. Toggle state is held as a
 * Set<number> of task IDs the user has locally flipped. The displayed
 * list is derived via useMemo — no sync effect needed, no state drift.
 */
export function useDailyTasks() {
  const query = useQuery(dailyTasksOptions());
  const [toggledIds, setToggledIds] = useState<Set<number>>(new Set());

  // Derive displayed tasks by XOR-ing server `completed` with local toggles
  const tasks = useMemo<DailyTask[]>(() => {
    if (!query.data) return [];
    return query.data.map((task) =>
      toggledIds.has(task.id) ? { ...task, completed: !task.completed } : task,
    );
  }, [query.data, toggledIds]);

  const toggleTask = useCallback((taskId: number) => {
    setToggledIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;

  return {
    data: tasks.length > 0 ? tasks : null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    toggleTask,
    completedCount,
    totalCount: tasks.length,
  };
}
