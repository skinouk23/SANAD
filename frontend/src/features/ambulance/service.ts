/**
 * Ambulance Service
 *
 * Pure API client for ambulance config lookups.
 */

import { z } from 'zod';
import { api } from '@/api/client';

export const AmbulanceServiceTypeSchema = z.object({
  code: z.string(),
  label: z.string(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export type AmbulanceServiceType = z.infer<typeof AmbulanceServiceTypeSchema>;

/** Fetch available ambulance service types. */
export async function getServiceTypes(): Promise<AmbulanceServiceType[]> {
  const raw = await api.get<AmbulanceServiceType[]>('/ambulance/service-types');
  return z.array(AmbulanceServiceTypeSchema).parse(raw);
}

export const ambulanceService = {
  getServiceTypes,
};
