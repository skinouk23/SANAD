/**
 * Care Plan Query Options
 *
 * Pre-built queryOptions for every care-plan query.
 * Consumed by hooks and can be used directly with queryClient.prefetchQuery().
 */

import { queryOptions } from '@tanstack/react-query';
import { carePlanKeys } from './keys';
import { getConditions, getMedications, getAppointments, getTasks } from './service';

export function conditionsOptions() {
  return queryOptions({
    queryKey: carePlanKeys.conditions(),
    queryFn: getConditions,
  });
}

export function medicationsOptions() {
  return queryOptions({
    queryKey: carePlanKeys.medications(),
    queryFn: getMedications,
  });
}

export function carePlanAppointmentsOptions() {
  return queryOptions({
    queryKey: carePlanKeys.appointments(),
    queryFn: getAppointments,
  });
}

export function dailyTasksOptions() {
  return queryOptions({
    queryKey: carePlanKeys.tasks(),
    queryFn: getTasks,
  });
}
