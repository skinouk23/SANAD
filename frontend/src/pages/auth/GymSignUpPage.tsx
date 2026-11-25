import { Dumbbell } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { SpecializedProviderAccountSignUpPage } from '@/features/auth/components';

export function GymSignUpPage() {
  const { t } = useLanguage();

  return (
    <SpecializedProviderAccountSignUpPage
      config={{
        additionalDocumentsLabel: 'Certification sportive',
        additionalDocumentsPlaceholder:
          'Ajoutez les certifications de coaches ou labels supplementaires.',
        additionalDocumentsTitle: 'Certifications complementaires',
        documentsSubtitle:
          'Importez les pieces necessaires a la verification de la salle et de ses responsables.',
        documentsTitle: 'Documents de verification',
        iconBadge: '🏋️',
        identifierLabel: 'Numero d enregistrement',
        identifierPlaceholder: 'GYM-TN-2024-017',
        managerLabel: t.signup.ownerName,
        managerPlaceholder: 'Mohamed Slim',
        offerings: [
          { icon: '🏃', id: 'cardio', label: t.signup.cardioTraining },
          { icon: '🏋️', id: 'weights', label: t.signup.weightTraining },
          { icon: '👥', id: 'classes', label: t.signup.groupClasses },
          { icon: '🧘', id: 'yoga', label: t.signup.yogaPilates },
          { icon: '💪', id: 'crossfit', label: t.signup.crossfit },
          { icon: '🥊', id: 'boxing', label: t.signup.boxing },
          { icon: '🏊', id: 'pool', label: t.signup.pool },
          { icon: '🧖', id: 'spa', label: t.signup.spaSauna },
        ],
        offeringsDescription: 'Selectionnez les espaces et activites disponibles dans votre salle.',
        offeringsTitle: 'Installations et activites',
        organizationLabel: t.signup.gymName,
        organizationPlaceholder: 'FitZone Premium',
        requiredDocuments: [
          {
            description: 'Registre du commerce ou patente',
            id: 'license',
            label: 'Enregistrement de la salle',
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
          {
            description: 'Secourisme, securite ou equivalent',
            id: 'first-aid-certificate',
            label: 'Certificat de premiers secours',
          },
        ],
        serviceType: 'gym',
        subtitle: t.signup.gymSubtitle,
        title: t.signup.gymTitle,
        yearsLabel: "Annees d'activite",
        yearsPlaceholder: '4',
      }}
      icon={Dumbbell}
    />
  );
}
