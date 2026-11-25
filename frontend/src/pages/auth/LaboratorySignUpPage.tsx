import { FlaskConical } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { SpecializedProviderAccountSignUpPage } from '@/features/auth/components';

export function LaboratorySignUpPage() {
  const { t } = useLanguage();

  return (
    <SpecializedProviderAccountSignUpPage
      config={{
        additionalDocumentsLabel: 'Certification qualite',
        additionalDocumentsPlaceholder:
          'Ajoutez les certificats ou accreditations supplementaires.',
        additionalDocumentsTitle: 'Certifications complementaires',
        documentsSubtitle:
          'Renseignez les documents utilises pour verifier le laboratoire et son responsable scientifique.',
        documentsTitle: 'Documents de verification',
        iconBadge: '🧪',
        identifierLabel: 'Numero d accreditation',
        identifierPlaceholder: 'LAB-TN-2024-018',
        managerLabel: t.signup.biologistName,
        managerPlaceholder: 'Dr. Ahmed Ben Ali',
        offerings: [
          { icon: '🩸', id: 'blood', label: t.signup.bloodTests },
          { icon: '💧', id: 'urine', label: t.signup.urineTests },
          { icon: '🧬', id: 'hormones', label: t.signup.hormoneTests },
          { icon: '🔬', id: 'genetics', label: t.signup.geneticTests },
          { icon: '🦠', id: 'covid', label: t.signup.covidTests },
          { icon: '⚕️', id: 'preop', label: t.signup.preOpTests },
          { icon: '🏠', id: 'home', label: t.signup.homeSampling },
          { icon: '⚡', id: 'express', label: t.signup.expressResults },
        ],
        offeringsDescription: 'Selectionnez les analyses et services de laboratoire proposes.',
        offeringsTitle: 'Services de laboratoire',
        organizationLabel: t.signup.labName,
        organizationPlaceholder: 'Laboratoire Central',
        requiredDocuments: [
          {
            description: 'Document d accreditation ou autorisation officielle',
            id: 'license',
            label: 'Accreditation du laboratoire',
          },
          {
            description: 'Carte nationale d identite ou passeport du responsable scientifique',
            id: 'id_card',
            label: 'Piece d identite du responsable',
          },
          {
            description: 'Certificat de qualite ou equivalent',
            id: 'quality-certificate',
            label: 'Certificat qualite',
          },
          {
            description: 'Diplome ou qualification du responsable scientifique',
            id: 'director-diploma',
            label: 'Diplome du biologiste responsable',
          },
        ],
        serviceType: 'laboratory',
        subtitle: t.signup.laboratorySubtitle,
        title: t.signup.laboratoryTitle,
        yearsLabel: "Annees d'activite",
        yearsPlaceholder: '8',
      }}
      icon={FlaskConical}
    />
  );
}
