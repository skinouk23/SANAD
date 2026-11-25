import { Package } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { SpecializedProviderAccountSignUpPage } from '@/features/auth/components';

export function EquipmentSignUpPage() {
  const { t } = useLanguage();

  return (
    <SpecializedProviderAccountSignUpPage
      config={{
        additionalDocumentsLabel: 'Certification equipement',
        additionalDocumentsPlaceholder:
          'Ajoutez vos autres certifications techniques si necessaire.',
        additionalDocumentsTitle: 'Certifications complementaires',
        documentsSubtitle:
          'Importez les justificatifs necessaires pour activer votre espace prestataire.',
        documentsTitle: 'Documents de verification',
        iconBadge: '🩼',
        identifierLabel: t.signup.registrationNumber,
        identifierPlaceholder: 'RC-2024-00125',
        managerLabel: t.signup.managerName,
        managerPlaceholder: 'Ahmed Ben Ali',
        offerings: [
          { icon: '🦽', id: 'mobilite', label: t.signup.wheelchairs },
          { icon: '💨', id: 'respiratoire', label: t.signup.oxygenConcentrators },
          { icon: '🛏️', id: 'lit_medicalise', label: t.signup.medicalBeds },
          { icon: '📊', id: 'monitoring', label: t.signup.monitoring },
          { icon: '🏋️', id: 'reeducation', label: t.signup.patientLifts },
          { icon: '🚿', id: 'aide_quotidienne', label: t.signup.otherEquipment },
        ],
        offeringsDescription:
          'Selectionnez les categories de materiel disponibles a la location ou a la vente.',
        offeringsTitle: 'Equipements proposes',
        organizationLabel: t.signup.agencyName,
        organizationPlaceholder: 'MediEquip Tunisie',
        requiredDocuments: [
          {
            description: 'Registre du commerce ou patente',
            id: 'license',
            label: 'Registre commercial',
          },
          {
            description: 'Carte nationale d identite ou passeport du responsable',
            id: 'id_card',
            label: 'Piece d identite du responsable',
          },
          {
            description: 'Assurance responsabilite civile',
            id: 'insurance-certificate',
            label: 'Attestation d assurance',
          },
        ],
        serviceType: 'equipment_rental',
        subtitle: t.signup.equipmentSubtitle,
        title: t.signup.equipmentTitle,
        yearsLabel: "Annees d'activite",
        yearsPlaceholder: '5',
      }}
      icon={Package}
    />
  );
}
