import { PawPrint } from 'lucide-react';
import { SpecializedReviewRequestPage } from '@/features/auth/components';

export function VeterinarySignUpPage() {
  return (
    <SpecializedReviewRequestPage
      config={{
        confirmationBody:
          'Votre demande d inscription a ete recue. Nous verifierons les documents transmis avant d ouvrir votre profil clinique.',
        confirmationTitle: 'Demande envoyee',
        documents: [
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'veterinary-degree',
            label: 'Diplome de docteur veterinaire',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'order-registration',
            label: 'Inscription a l ordre des veterinaires',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'exercise-permit',
            label: 'Autorisation d exercice',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'identity-card',
            label: 'Piece d identite nationale',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'liability-insurance',
            label: 'Assurance responsabilite civile',
          },
        ],
        documentsNotice:
          'Les pieces partagees restent protegees et consultees uniquement par l equipe de validation.',
        documentsSubtitle: 'Joignez les documents officiels utiles a la validation du dossier.',
        documentsTitle: 'Documents justificatifs',
        iconBadge: '🐾',
        identifierLabel: 'Numero d ordre',
        identifierPlaceholder: 'VET-TN-2024-033',
        managerLabel: 'Nom du veterinaire responsable',
        managerPlaceholder: 'Dr. Prenom Nom',
        organizationLabel: 'Nom de la clinique veterinaire',
        organizationPlaceholder: 'Clinique Veterinaire Carthage',
        services: [
          'Consultation generale',
          'Vaccination',
          'Chirurgie',
          'Sterilisation',
          'Detartrage',
          'Urgences 24h/24',
          'Toilettage',
          'Pension / garde',
          'Analyses de laboratoire',
          'Radiographie / echographie',
          'Dermatologie',
          'Ophtalmologie',
          'NAC (nouveaux animaux de compagnie)',
          'Visites a domicile',
        ],
        servicesSubtitle: 'Selectionnez les prises en charge et specialites disponibles.',
        servicesTitle: 'Services proposes',
        subtitle:
          'Commencez par les informations generales de votre clinique avant revue manuelle.',
        title: 'Inscription Clinique Veterinaire',
      }}
      icon={PawPrint}
    />
  );
}
