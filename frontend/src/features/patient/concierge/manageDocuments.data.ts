import { FileCheck, FileText, FlaskConical, Pill } from 'lucide-react';

import type { PatientDocument, PatientDocumentType } from './manageDocuments.types';

export const initialDocuments: PatientDocument[] = [
  {
    id: 1,
    name: 'Ordonnance - Dr. Trabelsi',
    type: 'prescription',
    date: '15 Jan 2024',
    doctor: 'Dr. Ahmed Trabelsi',
    category: 'Cardiologie',
    size: '245 KB',
    icon: Pill,
  },
  {
    id: 2,
    name: 'Analyses sanguines',
    type: 'results',
    date: '12 Jan 2024',
    doctor: 'Laboratoire Central',
    category: 'Analyses',
    size: '1.2 MB',
    icon: FlaskConical,
  },
  {
    id: 3,
    name: 'Compte-rendu consultation',
    type: 'report',
    date: '10 Jan 2024',
    doctor: 'Dr. Leila Ben Ali',
    category: 'Neurologie',
    size: '890 KB',
    icon: FileCheck,
  },
  {
    id: 4,
    name: 'Ordonnance - Dr. Gharbi',
    type: 'prescription',
    date: '8 Jan 2024',
    doctor: 'Dr. Mohamed Gharbi',
    category: 'Médecine générale',
    size: '180 KB',
    icon: Pill,
  },
  {
    id: 5,
    name: 'Radio thorax',
    type: 'results',
    date: '5 Jan 2024',
    doctor: 'Centre de Radiologie',
    category: 'Imagerie',
    size: '3.5 MB',
    icon: FlaskConical,
  },
];

export const documentIconByType = {
  prescription: Pill,
  results: FlaskConical,
  report: FileCheck,
} satisfies Record<PatientDocumentType, typeof Pill>;

export function getDocumentTypeColor(_type: PatientDocumentType) {
  switch (_type) {
    case 'prescription':
      return 'border-green-200 bg-green-100 text-green-700 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400';
    case 'results':
      return 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400';
    case 'report':
      return 'border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700 dark:border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400';
  }
}

export function getDocumentTypeGradient(type: PatientDocumentType) {
  switch (type) {
    case 'prescription':
      return 'from-green-500 to-emerald-500';
    case 'results':
      return 'from-blue-500 to-cyan-500';
    case 'report':
      return 'from-purple-500 to-pink-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
}

export function getDocumentTypeLabel(type: PatientDocumentType) {
  switch (type) {
    case 'prescription':
      return 'Ordonnance';
    case 'results':
      return 'Résultats';
    case 'report':
      return 'Compte-rendu';
    default:
      return 'Document';
  }
}

export const manageDocumentStatCards = [
  {
    key: 'prescription',
    icon: Pill,
    label: 'Ordonnances',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    key: 'results',
    icon: FlaskConical,
    label: 'Résultats',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'report',
    icon: FileCheck,
    label: 'Comptes-rendus',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    key: 'total',
    icon: FileText,
    label: 'Total documents',
    gradient: 'from-amber-500 to-orange-500',
  },
] as const;
