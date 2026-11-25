import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, DollarSign, FileText, Shield, type LucideIcon } from 'lucide-react';

import {
  useInsuranceClaims,
  useInsuranceCoverage,
  useInsuranceDocuments,
  useInsuranceStats,
} from '@/features/insurance';

export interface InsuranceStatCard {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  gradient: string;
  highlight?: boolean;
}

export const INSURANCE_CONDITIONS = [
  {
    category: 'Couverture générale',
    items: [
      "Responsabilité civile professionnelle jusqu'à 500 000 TND par sinistre",
      'Couverture des dommages corporels, matériels et immatériels',
      "Protection juridique incluse (frais d'avocat et de défense)",
      'Couverture mondiale pour les déplacements professionnels',
      'Aucune franchise sur les sinistres couverts',
    ],
  },
  {
    category: 'Exclusions',
    items: [
      'Faute intentionnelle ou dol du professionnel',
      "Dommages causés sous l'influence d'alcool ou de stupéfiants",
      'Activités non déclarées ou non autorisées',
      'Sinistres antérieurs à la date de souscription',
      'Dommages aux biens confiés (sauf clause spécifique)',
    ],
  },
  {
    category: 'Procédure de déclaration',
    items: [
      'Déclaration obligatoire dans les 5 jours ouvrés suivant la connaissance du sinistre',
      'Formulaire de déclaration disponible sur la plateforme',
      "Documents requis: rapport d'incident, témoignages, photos si applicable",
      'Délai de traitement: 15 jours ouvrés maximum',
      'Possibilité de recours en cas de refus de prise en charge',
    ],
  },
  {
    category: 'Obligations du professionnel',
    items: [
      'Respecter les normes et protocoles de la profession',
      'Maintenir ses qualifications et certifications à jour',
      "Informer l'assureur de tout changement d'activité",
      'Conserver les dossiers patients pendant 10 ans minimum',
      "Coopérer pleinement lors de l'instruction d'un sinistre",
    ],
  },
  {
    category: 'Résiliation et renouvellement',
    items: [
      'Renouvellement automatique annuel',
      'Possibilité de résiliation avec préavis de 2 mois',
      'Aucune pénalité en cas de résiliation',
      'Maintien de la couverture pendant 30 jours après résiliation (effet différé)',
      'Tarification stable garantie pendant 3 ans',
    ],
  },
  {
    category: 'Conformité légale tunisienne',
    items: [
      'Conforme au Code des Assurances tunisien',
      "Agréé par l'Autorité de Contrôle des Assurances (ACA)",
      'Respect de la loi n° 2008-37 sur la RC professionnelle',
      'Couverture obligatoire pour les professions de santé',
      "Attestation d'assurance valable pour les autorités tunisiennes",
    ],
  },
];

export function getInsuranceClaimStatus(status: string) {
  switch (status) {
    case 'resolved':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-500',
        border: 'border-green-500/30',
        label: 'Résolu',
      };
    case 'in-progress':
      return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        label: 'En cours',
      };
    default:
      return {
        bg: 'bg-slate-500/20',
        text: 'text-slate-500',
        border: 'border-slate-500/30',
        label: 'Inconnu',
      };
  }
}

export function useProviderInsuranceScreen() {
  const navigate = useNavigate();
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const coverage = useInsuranceCoverage();
  const claims = useInsuranceClaims();
  const documents = useInsuranceDocuments();
  const stats = useInsuranceStats();

  const loading = coverage.loading || claims.loading || documents.loading || stats.loading;
  const error = coverage.error || claims.error || documents.error || stats.error;

  const statCards = useMemo<InsuranceStatCard[]>(
    () => [
      {
        label: 'Statut',
        value: stats.data?.status || 'Active',
        sub: `Valide jusqu'au ${stats.data?.validUntil || '31 Déc 2024'}`,
        icon: Shield,
        gradient: 'from-green-500 to-emerald-500',
        highlight: true,
      },
      {
        label: 'Couverture max',
        value: stats.data?.maxCoverage || '500K TND',
        sub: 'Par sinistre',
        icon: DollarSign,
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        label: 'Sinistres',
        value: String(stats.data?.claimsCount ?? 0),
        sub: 'Cette année',
        icon: FileText,
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        label: 'Franchise',
        value: stats.data?.franchise || '0 TND',
        sub: 'Aucune franchise',
        icon: Award,
        gradient: 'from-amber-500 to-orange-500',
      },
    ],
    [stats.data],
  );

  return {
    claims,
    coverage,
    documents,
    error,
    loading,
    navigate,
    refetchAll: () => {
      void coverage.refetch();
      void claims.refetch();
      void documents.refetch();
      void stats.refetch();
    },
    setShowConditionsModal,
    showConditionsModal,
    statCards,
  };
}
