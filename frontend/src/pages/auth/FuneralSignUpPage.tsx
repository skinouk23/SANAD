import { Heart } from 'lucide-react';
import { SpecializedReviewRequestPage } from '@/features/auth/components';

export function FuneralSignUpPage() {
  return (
    <SpecializedReviewRequestPage
      config={{
        confirmationBody:
          'Votre demande a ete transmise. Notre equipe verifiera les pieces fournies et reviendra vers vous pour l activation du compte.',
        confirmationTitle: 'Demande envoyee',
        documents: [
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'prefectoral-license',
            label: 'Agrement prefectoral',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'capacity-certificate',
            label: 'Attestation de capacite professionnelle',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'insurance-certificate',
            label: 'Assurance responsabilite civile',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'business-register',
            label: 'Registre du commerce',
          },
          {
            description: 'PDF, JPG ou PNG (max 5MB)',
            id: 'identity-card',
            label: 'Piece d identite du responsable',
          },
        ],
        documentsNotice:
          'Ces documents sont traites de maniere confidentielle et utilises uniquement pour la verification administrative.',
        documentsSubtitle: 'Partagez les pieces necessaires a l instruction du dossier.',
        documentsTitle: 'Documents justificatifs',
        iconBadge: '🕯️',
        identifierLabel: 'Numero d agrement',
        identifierPlaceholder: 'FUN-TN-2024-009',
        managerLabel: 'Nom du responsable',
        managerPlaceholder: 'Prenom Nom',
        organizationLabel: 'Nom de l etablissement',
        organizationPlaceholder: 'Pompes Funebres Dignite',
        services: [
          'Organisation complete des obseques',
          'Transport du defunt',
          'Preparation et presentation',
          'Ceremonie religieuse',
          'Ceremonie civile',
          'Inhumation',
          'Cremation',
          'Rapatriement international',
          'Assistance administrative',
          'Accompagnement au deuil',
          'Fleurs et couronnes',
          'Faire-part et remerciements',
        ],
        servicesSubtitle:
          'Selectionnez les prestations disponibles pour les familles accompagnees.',
        servicesTitle: 'Services proposes',
        specialOptions: [
          {
            description: 'Service d urgence permanent',
            id: 'available24h',
            label: 'Disponible 24h/24, 7j/7',
          },
          {
            description: 'Transport vers l etranger',
            id: 'repatriation',
            label: 'Rapatriement international',
          },
        ],
        subtitle: 'Presentez votre entreprise afin de lancer la revue manuelle du dossier.',
        title: 'Inscription Services Funeraires',
      }}
      icon={Heart}
    />
  );
}
