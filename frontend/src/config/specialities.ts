/**
 * Doctor specialities for the Tunisian healthcare market.
 * Used by the doctor category listing page for provider filtering.
 */
export const DOCTOR_SPECIALITIES = [
  'Généraliste',
  'Pédiatre',
  'Cardiologue',
  'Dermatologue',
  'Gynécologue Obstétricien',
  'Ophtalmologue',
  'ORL',
  'Psychiatre',
  'Pneumologue',
  'Gastro-Entérologue',
  'Endocrinologue Diabétologue',
  'Rhumatologue',
  'Médecin interniste',
  'Chirurgien Orthopédiste Traumatologue',
  'Chirurgien Pédiatrique',
  'Cancérologue',
  'Radiothérapeute',
  'Infectiologue',
  'Neuropédiatre',
  'Anesthésiste-Réanimateur',
  'Angiologue',
  'Dentiste',
  'Orthodontiste',
  'Audioprothésiste',
] as const;

export type DoctorSpeciality = (typeof DOCTOR_SPECIALITIES)[number];
