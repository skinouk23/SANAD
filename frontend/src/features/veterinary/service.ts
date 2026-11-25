/**
 * Veterinary Service
 *
 * Pure API client for veterinary config lookups.
 */

import { z } from 'zod';
import { api } from '@/api/client';

export const VeterinaryAnimalTypeSchema = z.object({
  code: z.string(),
  label: z.string(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export type VeterinaryAnimalType = z.infer<typeof VeterinaryAnimalTypeSchema>;

/** Fetch available veterinary animal types. */
export async function getAnimalTypes(): Promise<VeterinaryAnimalType[]> {
  const raw = await api.get<VeterinaryAnimalType[]>('/veterinary/animal-types');
  return z.array(VeterinaryAnimalTypeSchema).parse(raw);
}

export const veterinaryService = {
  getAnimalTypes,
};
