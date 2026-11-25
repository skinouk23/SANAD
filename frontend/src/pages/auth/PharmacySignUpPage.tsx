import { Pill } from 'lucide-react';
import { SpecializedReviewRequestPage } from '@/features/auth/components';

export function PharmacySignUpPage() {
  return (
    <SpecializedReviewRequestPage
      config={{
        confirmationBody:
          'Votre demande d inscription a bien ete recue. Notre equipe va verifier vos documents avant de valider votre espace pharmacie.',
        confirmationTitle: 'Demande envoyee',
        documents: [
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'pharmacist-degree',
            label: 'Diplome de pharmacien',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'exercise-license',
            label: 'Autorisation d exercice',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'business-license',
            label: 'Patente ou registre de commerce',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'identity-card',
            label: 'Piece d identite du titulaire',
          },
        ],
        documentsNotice:
          'Les documents televerses restent accessibles uniquement a notre equipe de verification.',
        documentsSubtitle:
          'Ajoutez les pieces utiles pour accelerer la validation de votre demande.',
        documentsTitle: 'Documents justificatifs',
        iconBadge: '💊',
        identifierLabel: 'Numero de licence / patente',
        identifierPlaceholder: 'PHAR-TN-2024-021',
        managerLabel: 'Nom du pharmacien titulaire',
        managerPlaceholder: 'Dr. Prenom Nom',
        organizationLabel: 'Nom de la pharmacie',
        organizationPlaceholder: 'Pharmacie Centrale',
        services: [
          'Depistage COVID-19',
          'Vaccination',
          'Livraison de medicaments',
          'Orthopedie / contention',
          'Tests TROD',
          'Suivi maladies chroniques',
          'Preparation piluliers',
          'Parapharmacie',
          'Location materiel medical',
        ],
        servicesSubtitle: 'Indiquez les services disponibles dans votre officine.',
        servicesTitle: 'Services proposes',
        subtitle:
          'Renseignez les informations generales de votre etablissement avant validation manuelle.',
        title: 'Inscription Pharmacie',
      }}
      icon={Pill}
    />
  );
}
