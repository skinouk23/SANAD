import { Scan } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { SpecializedProviderAccountSignUpPage } from '@/features/auth/components';

export function RadiologySignUpPage() {
  const { t } = useLanguage();

  return (
    <SpecializedProviderAccountSignUpPage
      config={{
        additionalDocumentsLabel: 'Certification equipement',
        additionalDocumentsPlaceholder:
          'Ajoutez les certificats techniques ou de maintenance utiles.',
        additionalDocumentsTitle: 'Certifications complementaires',
        documentsSubtitle:
          'Joignez les justificatifs de fonctionnement et de securite radiologique.',
        documentsTitle: 'Documents de verification',
        iconBadge: '🩻',
        identifierLabel: 'Numero de licence',
        identifierPlaceholder: 'RAD-TN-2024-014',
        managerLabel: t.signup.medicalDirector,
        managerPlaceholder: 'Dr. Mouna Salah',
        offerings: [
          { icon: '📷', id: 'xray', label: t.signup.standardXray },
          { icon: '🔊', id: 'echo', label: t.signup.ultrasound },
          { icon: '🔬', id: 'scanner', label: t.signup.ctScan },
          { icon: '🧲', id: 'mri', label: t.signup.mri },
          { icon: '🩺', id: 'mammo', label: t.signup.mammography },
          { icon: '💓', id: 'doppler', label: t.signup.vascularDoppler },
          { icon: '🦷', id: 'dental', label: t.signup.dentalRadiology },
          { icon: '🦴', id: 'osteo', label: t.signup.boneDensitometry },
        ],
        offeringsDescription:
          'Selectionnez les examens et equipements disponibles dans votre centre.',
        offeringsTitle: 'Equipements et examens',
        organizationLabel: t.signup.centerName,
        organizationPlaceholder: 'Centre Radiologie Moderne',
        requiredDocuments: [
          {
            description: 'Autorisation d exploitation ou accreditation',
            id: 'license',
            label: 'Autorisation du centre',
          },
          {
            description: 'Carte nationale d identite ou passeport du directeur medical',
            id: 'id_card',
            label: 'Piece d identite du directeur medical',
          },
          {
            description: 'Attestation de radioprotection',
            id: 'radiation-safety-file',
            label: 'Document de securite radiologique',
          },
          {
            description: 'Diplome ou credentials du directeur medical',
            id: 'director-credentials',
            label: 'Qualification du directeur medical',
          },
        ],
        serviceType: 'radiology',
        subtitle: t.signup.radiologySubtitle,
        title: t.signup.radiologyTitle,
        yearsLabel: "Annees d'activite",
        yearsPlaceholder: '6',
      }}
      icon={Scan}
    />
  );
}
