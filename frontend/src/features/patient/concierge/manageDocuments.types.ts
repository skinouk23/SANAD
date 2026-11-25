import type { LucideIcon } from 'lucide-react';

export type PatientDocumentType = 'prescription' | 'results' | 'report';
export type PatientDocumentTab = 'all' | 'prescriptions' | 'results' | 'reports';

export interface PatientDocument {
  id: number;
  name: string;
  type: PatientDocumentType;
  date: string;
  doctor: string;
  category: string;
  size: string;
  icon: LucideIcon;
}
