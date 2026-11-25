/**
 * Ambulance Transport Types — single source of truth
 *
 * Used by AmbulanceServicePage and AmbulanceBookingPage.
 * Each code maps to translation keys:
 *   `t.serviceListing.transport_<code>`     — label
 *   `t.serviceListing.transport_<code>Desc` — description (if applicable)
 */

export const TRANSPORT_TYPES = [
  'emergency',
  'hospital_home',
  'home_hospital',
  'inter_clinic',
  'medical_appointment',
  'dialysis',
] as const;

export type TransportType = (typeof TRANSPORT_TYPES)[number];

export interface TransportTypeOption {
  id: TransportType;
  label: string;
  icon: string;
}

/** Display lookup (French fallback — use translation keys for i18n). */
export const TRANSPORT_TYPE_OPTIONS: TransportTypeOption[] = [
  { id: 'emergency', label: 'Urgence médicale', icon: '🚨' },
  { id: 'hospital_home', label: 'Hôpital → Domicile', icon: '🏥' },
  { id: 'home_hospital', label: 'Domicile → Hôpital', icon: '🏠' },
  { id: 'inter_clinic', label: 'Inter-cliniques', icon: '🏥' },
  { id: 'medical_appointment', label: 'Rendez-vous médical', icon: '📅' },
  { id: 'dialysis', label: 'Dialyse régulière', icon: '💉' },
];
