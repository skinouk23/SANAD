import type { ElementType } from 'react';
import {
  Activity,
  Ambulance,
  Baby,
  Brain,
  ClipboardCheck,
  Dumbbell,
  FlaskConical,
  Heart,
  HeartPulse,
  Moon,
  Package,
  PawPrint,
  Pill,
  Scan,
  Stethoscope,
  Syringe,
  Users,
  Utensils,
} from 'lucide-react';
import type { ProviderCategoryConfigKey } from './providerAuthoring';

interface ServiceAuthoringFieldOption {
  value: string;
  label: string;
}

interface ServiceAuthoringDefaultService {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface ServiceAuthoringField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'multiselect';
  placeholder?: string;
  options?: ServiceAuthoringFieldOption[];
  required?: boolean;
}

export interface ServiceAuthoringConfig {
  title: string;
  icon: ElementType;
  fields: ServiceAuthoringField[];
  defaultServices?: ServiceAuthoringDefaultService[];
  isBespoke: boolean;
  hasLookupDependencies: boolean;
}

type BespokeProviderCategoryConfigKey =
  | 'nursing'
  | 'elderly_care'
  | 'physiotherapy'
  | 'laboratory'
  | 'radiology'
  | 'equipment'
  | 'nutrition'
  | 'psychology'
  | 'ambulance'
  | 'pharmacy'
  | 'funeral'
  | 'veterinary';

type FallbackProviderCategoryConfigKey = Exclude<
  ProviderCategoryConfigKey,
  BespokeProviderCategoryConfigKey
>;

type BespokeServiceAuthoringConfig = Omit<
  ServiceAuthoringConfig,
  'isBespoke' | 'hasLookupDependencies'
>;

interface CategoryDisplayMetadata {
  title: string;
  icon: ElementType;
}

const LOOKUP_CATEGORY_KEYS = new Set<ProviderCategoryConfigKey>([
  'nutrition',
  'ambulance',
  'veterinary',
]);

export const STANDARD_FALLBACK_FIELDS: ServiceAuthoringField[] = [
  {
    id: 'name',
    label: 'Nom du service',
    type: 'text',
    placeholder: 'Ex: Consultation à domicile',
    required: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Décrivez le service...',
  },
  {
    id: 'price',
    label: 'Prix (TND)',
    type: 'number',
    placeholder: '50',
    required: true,
  },
  {
    id: 'duration',
    label: 'Durée (min)',
    type: 'number',
    placeholder: '30',
  },
  {
    id: 'location',
    label: "Lieu d'intervention",
    type: 'select',
    options: [
      {
        value: 'home',
        label: 'À domicile uniquement',
      },
      {
        value: 'clinic',
        label: 'Au cabinet uniquement',
      },
      {
        value: 'both',
        label: 'Domicile et cabinet',
      },
      {
        value: 'online',
        label: 'En ligne',
      },
    ],
  },
  {
    id: 'isUrgent',
    label: 'Disponible en urgence',
    type: 'checkbox',
  },
  {
    id: 'prescription',
    label: 'Ordonnance requise',
    type: 'checkbox',
  },
];

const BESPOKE_SERVICE_CONFIGS: Record<
  BespokeProviderCategoryConfigKey,
  BespokeServiceAuthoringConfig
> = {
  nursing: {
    title: 'Soins Infirmiers',
    icon: Syringe,
    fields: [
      {
        id: 'name',
        label: 'Nom du soin',
        type: 'text',
        placeholder: 'Ex: Injection à domicile',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le soin en détail...',
      },
      {
        id: 'price',
        label: 'Prix (TND)',
        type: 'number',
        placeholder: '40',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée (min)',
        type: 'number',
        placeholder: '30',
      },
      {
        id: 'location',
        label: "Lieu d'intervention",
        type: 'select',
        options: [
          {
            value: 'home',
            label: 'À domicile uniquement',
          },
          {
            value: 'clinic',
            label: 'Au cabinet uniquement',
          },
          {
            value: 'both',
            label: 'Domicile et cabinet',
          },
        ],
      },
      {
        id: 'isUrgent',
        label: 'Disponible en urgence',
        type: 'checkbox',
      },
      {
        id: 'prescription',
        label: 'Ordonnance requise',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Injection intramusculaire',
        description: "Administration d'injections IM à domicile",
        price: 35,
        duration: 20,
      },
      {
        name: 'Pansement simple',
        description: 'Réfection de pansement simple',
        price: 40,
        duration: 30,
      },
      {
        name: 'Perfusion à domicile',
        description: 'Pose et surveillance de perfusion IV',
        price: 80,
        duration: 60,
      },
      {
        name: 'Prise de sang',
        description: 'Prélèvement sanguin à domicile',
        price: 30,
        duration: 15,
      },
      {
        name: 'Sondage urinaire',
        description: 'Pose ou changement de sonde urinaire',
        price: 50,
        duration: 30,
      },
      {
        name: 'Soins de stomie',
        description: 'Entretien et changement de poche de stomie',
        price: 45,
        duration: 30,
      },
      {
        name: 'Injection sous-cutanée',
        description: 'Administration insuline ou anticoagulant',
        price: 25,
        duration: 15,
      },
      {
        name: 'Ablation de fils/agrafes',
        description: 'Retrait de fils ou agrafes post-opératoires',
        price: 35,
        duration: 20,
      },
    ],
  },
  elderly_care: {
    title: 'Aide aux Seniors',
    icon: Heart,
    fields: [
      {
        id: 'name',
        label: 'Nom du service',
        type: 'text',
        placeholder: 'Ex: Aide à la toilette',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le service...',
      },
      {
        id: 'price',
        label: 'Prix/heure (TND)',
        type: 'number',
        placeholder: '25',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée minimum (min)',
        type: 'number',
        placeholder: '60',
      },
      {
        id: 'weekend',
        label: 'Disponible le weekend',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Aide à la toilette',
        description: 'Assistance pour la toilette quotidienne',
        price: 30,
        duration: 45,
      },
      {
        name: 'Compagnie',
        description: 'Présence, discussion, activités de stimulation',
        price: 20,
        duration: 120,
      },
      {
        name: 'Aide aux repas',
        description: 'Préparation et aide à la prise des repas',
        price: 25,
        duration: 60,
      },
      {
        name: 'Aide à la mobilité',
        description: 'Accompagnement déplacements et transferts',
        price: 30,
        duration: 60,
      },
      {
        name: 'Courses et commissions',
        description: 'Achats alimentaires et courses quotidiennes',
        price: 20,
        duration: 90,
      },
      {
        name: 'Entretien du cadre de vie',
        description: 'Ménage léger, rangement, linge',
        price: 25,
        duration: 120,
      },
    ],
  },
  physiotherapy: {
    title: 'Kinésithérapie',
    icon: Activity,
    fields: [
      {
        id: 'name',
        label: 'Nom du soin',
        type: 'text',
        placeholder: 'Ex: Rééducation post-opératoire',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le soin...',
      },
      {
        id: 'price',
        label: 'Prix/séance (TND)',
        type: 'number',
        placeholder: '50',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée (min)',
        type: 'number',
        placeholder: '45',
      },
    ],

    defaultServices: [
      {
        name: 'Rééducation orthopédique',
        description: 'Rééducation post-fracture, entorse, prothèse',
        price: 50,
        duration: 45,
      },
      {
        name: 'Massage thérapeutique',
        description: 'Massage décontracturant, drainage',
        price: 40,
        duration: 45,
      },
      {
        name: 'Kinésithérapie respiratoire',
        description: 'Désencombrement bronchique, rééducation pulmonaire',
        price: 45,
        duration: 30,
      },
      {
        name: 'Rééducation neurologique',
        description: 'Post-AVC, Parkinson, sclérose en plaques',
        price: 55,
        duration: 45,
      },
      {
        name: 'Rééducation périnéale',
        description: 'Rééducation du plancher pelvien',
        price: 45,
        duration: 30,
      },
      {
        name: 'Drainage lymphatique',
        description: 'Drainage manuel pour œdèmes et lymphœdèmes',
        price: 50,
        duration: 45,
      },
    ],
  },
  laboratory: {
    title: "Laboratoire d'Analyses",
    icon: FlaskConical,
    fields: [
      {
        id: 'name',
        label: "Nom de l'analyse",
        type: 'text',
        placeholder: 'Ex: Bilan lipidique complet',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez les paramètres analysés...',
      },
      {
        id: 'price',
        label: 'Prix (TND)',
        type: 'number',
        placeholder: '50',
        required: true,
      },
      {
        id: 'duration',
        label: 'Délai résultats (heures)',
        type: 'number',
        placeholder: '24',
      },
      {
        id: 'fasting',
        label: 'À jeun requis',
        type: 'checkbox',
      },
      {
        id: 'homeCollection',
        label: 'Prélèvement à domicile disponible',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Bilan sanguin complet',
        description: 'NFS, VS, glycémie, créatinine, ionogramme',
        price: 85,
        duration: 24,
      },
      {
        name: 'Bilan lipidique',
        description: 'Cholestérol total, HDL, LDL, triglycérides',
        price: 45,
        duration: 24,
      },
      {
        name: 'Bilan hépatique',
        description: 'Transaminases, bilirubine, GGT, phosphatases alcalines',
        price: 55,
        duration: 24,
      },
      {
        name: 'Bilan thyroïdien',
        description: 'TSH, T3, T4 libre',
        price: 65,
        duration: 48,
      },
      {
        name: 'Hémoglobine glyquée (HbA1c)',
        description: 'Suivi du diabète sur 3 mois',
        price: 35,
        duration: 24,
      },
      {
        name: "Analyse d'urine (ECBU)",
        description: 'Examen cytobactériologique des urines',
        price: 30,
        duration: 48,
      },
      {
        name: 'Bilan rénal',
        description: 'Créatinine, urée, acide urique, ionogramme',
        price: 50,
        duration: 24,
      },
      {
        name: 'Sérologie complète',
        description: 'Hépatite B/C, HIV, syphilis',
        price: 120,
        duration: 72,
      },
    ],
  },
  radiology: {
    title: 'Centre de Radiologie',
    icon: Scan,
    fields: [
      {
        id: 'name',
        label: "Nom de l'examen",
        type: 'text',
        placeholder: 'Ex: Scanner thoracique',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: "Décrivez l'examen...",
      },
      {
        id: 'price',
        label: 'Prix (TND)',
        type: 'number',
        placeholder: '150',
        required: true,
      },
      {
        id: 'duration',
        label: "Durée de l'examen (min)",
        type: 'number',
        placeholder: '30',
      },
    ],

    defaultServices: [
      {
        name: 'Radiographie thoracique',
        description: 'Radio des poumons face et profil',
        price: 35,
        duration: 10,
      },
      {
        name: 'Échographie abdominale',
        description: 'Foie, vésicule, pancréas, rate, reins',
        price: 80,
        duration: 30,
      },
      {
        name: 'Scanner cérébral',
        description: 'Tomodensitométrie du crâne avec/sans injection',
        price: 180,
        duration: 20,
      },
      {
        name: 'IRM lombaire',
        description: 'Imagerie par résonance magnétique du rachis lombaire',
        price: 250,
        duration: 40,
      },
      {
        name: 'Échographie obstétricale',
        description: 'Suivi de grossesse, morphologie fœtale',
        price: 70,
        duration: 30,
      },
      {
        name: 'Mammographie',
        description: 'Dépistage et diagnostic du sein',
        price: 60,
        duration: 15,
      },
      {
        name: 'Panoramique dentaire',
        description: 'Radiographie panoramique des mâchoires',
        price: 40,
        duration: 10,
      },
    ],
  },
  equipment: {
    title: 'Agence de Location',
    icon: Package,
    fields: [
      {
        id: 'name',
        label: "Nom de l'équipement",
        type: 'text',
        placeholder: 'Ex: Lit médicalisé électrique',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: "Décrivez l'équipement...",
      },
      {
        id: 'priceDaily',
        label: 'Prix/jour (TND)',
        type: 'number',
        placeholder: '25',
        required: true,
      },
      {
        id: 'deposit',
        label: 'Caution (TND)',
        type: 'number',
        placeholder: '300',
      },
      {
        id: 'delivery',
        label: 'Livraison à domicile',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Fauteuil roulant manuel',
        description: 'Fauteuil pliable léger',
        price: 15,
        duration: 1,
      },
      {
        name: 'Lit médicalisé électrique',
        description: 'Lit 3 fonctions avec barrières',
        price: 35,
        duration: 1,
      },
      {
        name: "Concentrateur d'oxygène",
        description: "Appareil d'oxygénothérapie portable",
        price: 25,
        duration: 1,
      },
      {
        name: 'Déambulateur',
        description: 'Déambulateur pliable avec roues',
        price: 8,
        duration: 1,
      },
      {
        name: 'Matelas anti-escarres',
        description: 'Matelas à pression alternée',
        price: 20,
        duration: 1,
      },
      {
        name: 'Aspirateur de mucosités',
        description: "Appareil d'aspiration portable",
        price: 18,
        duration: 1,
      },
    ],
  },
  nutrition: {
    title: 'Nutrition & Alimentation',
    icon: Utensils,
    fields: [
      {
        id: 'name',
        label: 'Nom du service',
        type: 'text',
        placeholder: 'Ex: Bilan nutritionnel',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le service...',
      },
      {
        id: 'price',
        label: 'Prix (TND)',
        type: 'number',
        placeholder: '80',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée (min)',
        type: 'number',
        placeholder: '60',
      },
      {
        id: 'subcategory',
        label: 'Sous-catégorie',
        type: 'select',
        options: [
          {
            value: 'consultation',
            label: 'Consultation',
          },
          {
            value: 'meal_plan',
            label: 'Plan alimentaire',
          },
          {
            value: 'meal_delivery',
            label: 'Livraison de repas',
          },
        ],
        required: true,
      },
      {
        id: 'dietTypes',
        label: 'Régimes pris en charge',
        type: 'multiselect',
        options: [
          {
            value: 'diabetic',
            label: 'Diabétique',
          },
          {
            value: 'low_salt',
            label: 'Pauvre en sel',
          },
          {
            value: 'cardiac',
            label: 'Cardiaque',
          },
          {
            value: 'gluten_free',
            label: 'Sans gluten',
          },
          {
            value: 'vegetarian',
            label: 'Végétarien',
          },
          {
            value: 'vegan',
            label: 'Vegan',
          },
        ],
      },
    ],

    defaultServices: [
      {
        name: 'Bilan nutritionnel complet',
        description: 'Évaluation complète + plan alimentaire',
        price: 120,
        duration: 90,
      },
      {
        name: 'Consultation de suivi',
        description: 'Suivi et ajustement du programme',
        price: 60,
        duration: 30,
      },
      {
        name: 'Programme minceur',
        description: 'Plan personnalisé de perte de poids',
        price: 100,
        duration: 60,
      },
      {
        name: 'Nutrition sportive',
        description: 'Plan alimentaire adapté aux sportifs',
        price: 90,
        duration: 45,
      },
      {
        name: 'Régime diabétique',
        description: 'Plan alimentaire pour diabétiques',
        price: 80,
        duration: 45,
      },
      {
        name: 'Nutrition pédiatrique',
        description: 'Alimentation adaptée enfants et adolescents',
        price: 70,
        duration: 45,
      },
    ],
  },
  psychology: {
    title: 'Psychologie',
    icon: Brain,
    fields: [
      {
        id: 'name',
        label: 'Nom de la consultation',
        type: 'text',
        placeholder: 'Ex: Thérapie cognitive',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez la consultation...',
      },
      {
        id: 'price',
        label: 'Prix/séance (TND)',
        type: 'number',
        placeholder: '80',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée (min)',
        type: 'number',
        placeholder: '60',
      },
    ],

    defaultServices: [
      {
        name: 'Consultation individuelle',
        description: 'Séance de psychothérapie individuelle',
        price: 80,
        duration: 60,
      },
      {
        name: 'Thérapie de couple',
        description: 'Séance pour couples',
        price: 120,
        duration: 90,
      },
      {
        name: 'Thérapie cognitive (TCC)',
        description: 'Thérapie cognitivo-comportementale',
        price: 90,
        duration: 60,
      },
      {
        name: 'Gestion du stress et anxiété',
        description: 'Techniques de relaxation et gestion émotionnelle',
        price: 80,
        duration: 60,
      },
      {
        name: 'Accompagnement au deuil',
        description: 'Soutien psychologique en période de deuil',
        price: 80,
        duration: 60,
      },
      {
        name: 'Bilan psychologique',
        description: 'Évaluation psychologique complète avec rapport',
        price: 150,
        duration: 120,
      },
    ],
  },
  ambulance: {
    title: 'Ambulance',
    icon: Ambulance,
    fields: [
      {
        id: 'name',
        label: 'Nom du service',
        type: 'text',
        placeholder: 'Ex: Transport médicalisé',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le service...',
      },
      {
        id: 'serviceTypes',
        label: 'Types de service',
        type: 'multiselect',
        options: [
          {
            value: 'emergency',
            label: 'Urgence',
          },
          {
            value: 'inter_hospital',
            label: 'Inter-hospitalier',
          },
          {
            value: 'repatriation',
            label: 'Rapatriement',
          },
          {
            value: 'event_assistance',
            label: 'Assistance événementielle',
          },
        ],
      },
      {
        id: 'basePrice',
        label: 'Prix de base (TND)',
        type: 'number',
        placeholder: '50',
        required: true,
      },
      {
        id: 'standardKilometers',
        label: 'Nombre de kilomètres inclus dans le prix de base',
        type: 'number',
        placeholder: '10',
        required: true,
      },
      {
        id: 'pricePerExtraKm',
        label: 'Prix par kilomètre supplémentaire (TND)',
        type: 'number',
        placeholder: '2',
        required: true,
      },
      {
        id: 'available24h',
        label: 'Disponible 24h/24',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Transport VSL',
        description: 'Véhicule sanitaire léger',
        price: 40,
        duration: 60,
      },
      {
        name: 'Ambulance équipée',
        description: 'Transport avec monitoring',
        price: 100,
        duration: 60,
      },
      {
        name: 'Transport inter-hospitalier',
        description: 'Transfert entre établissements de santé',
        price: 120,
        duration: 90,
      },
      {
        name: 'Rapatriement sanitaire',
        description: 'Transport longue distance médicalisé',
        price: 300,
        duration: 240,
      },
      {
        name: 'Transport dialyse',
        description: 'Transport régulier pour séances de dialyse',
        price: 50,
        duration: 60,
      },
      {
        name: "Intervention d'urgence",
        description: 'Prise en charge urgente avec équipe médicale',
        price: 150,
        duration: 30,
      },
    ],
  },
  pharmacy: {
    title: 'Pharmacie',
    icon: Pill,
    fields: [
      {
        id: 'name',
        label: 'Nom du service',
        type: 'text',
        placeholder: 'Ex: Dépistage COVID-19',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le service...',
      },
      {
        id: 'price',
        label: 'Prix (TND)',
        type: 'number',
        placeholder: '25',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée (min)',
        type: 'number',
        placeholder: '15',
      },
      {
        id: 'locationType',
        label: 'Lieu du service',
        type: 'select',
        options: [
          {
            value: 'pharmacie',
            label: 'En pharmacie uniquement',
          },
          {
            value: 'domicile',
            label: 'À domicile uniquement',
          },
          {
            value: 'both',
            label: 'Pharmacie et domicile',
          },
        ],

        required: true,
      },
      {
        id: 'requiresPrescription',
        label: 'Ordonnance requise',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Dépistage COVID-19',
        description: 'Test antigénique avec résultat en 15 min',
        price: 25,
        duration: 15,
      },
      {
        name: 'Prise de tension',
        description: 'Mesure et suivi de la tension artérielle',
        price: 0,
        duration: 5,
      },
      {
        name: 'Vaccination grippe',
        description: 'Injection du vaccin antigrippal',
        price: 0,
        duration: 15,
      },
      {
        name: 'Préparation de pilulier',
        description: 'Organisation hebdomadaire des médicaments',
        price: 10,
        duration: 20,
      },
      {
        name: 'Livraison de médicaments',
        description: 'Livraison à domicile de médicaments sur ordonnance',
        price: 5,
        duration: 30,
      },
      {
        name: 'Conseil pharmaceutique',
        description: 'Consultation et conseil sur les traitements',
        price: 0,
        duration: 15,
      },
      {
        name: 'Test de glycémie',
        description: 'Mesure rapide de la glycémie capillaire',
        price: 5,
        duration: 5,
      },
    ],
  },
  funeral: {
    title: 'Services Funéraires',
    icon: Heart,
    fields: [
      {
        id: 'name',
        label: 'Nom du service',
        type: 'text',
        placeholder: 'Ex: Organisation complète des obsèques',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le service...',
      },
      {
        id: 'price',
        label: 'Prix de base (TND)',
        type: 'number',
        placeholder: '2500',
        required: true,
      },
      {
        id: 'ceremonyType',
        label: 'Type de cérémonie',
        type: 'select',
        options: [
          {
            value: 'religious',
            label: 'Religieuse uniquement',
          },
          {
            value: 'civil',
            label: 'Civile uniquement',
          },
          {
            value: 'both',
            label: 'Les deux',
          },
        ],
      },
      {
        id: 'burialType',
        label: 'Mode de sépulture',
        type: 'select',
        options: [
          {
            value: 'burial',
            label: 'Inhumation uniquement',
          },
          {
            value: 'cremation',
            label: 'Crémation uniquement',
          },
          {
            value: 'both',
            label: 'Les deux',
          },
        ],
      },
      {
        id: 'repatriation',
        label: 'Rapatriement international inclus',
        type: 'checkbox',
      },
      {
        id: 'floralService',
        label: 'Service floral inclus',
        type: 'checkbox',
      },
      {
        id: 'transportService',
        label: 'Transport des proches inclus',
        type: 'checkbox',
      },
      {
        id: 'adminAssistance',
        label: 'Assistance administrative incluse',
        type: 'checkbox',
      },
      {
        id: 'griefSupport',
        label: 'Accompagnement au deuil inclus',
        type: 'checkbox',
      },
      {
        id: 'available24h',
        label: 'Disponible 24h/24',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Organisation complète des obsèques',
        description:
          'Prise en charge totale: démarches administratives, cérémonie, transport, sépulture',
        price: 2500,
        duration: 0,
      },
      {
        name: 'Cérémonie religieuse',
        description:
          'Organisation de cérémonie selon les rites religieux (musulman, chrétien, juif)',
        price: 1800,
        duration: 0,
      },
      {
        name: 'Rapatriement international',
        description: 'Transport du défunt vers un autre pays avec toutes les formalités',
        price: 5500,
        duration: 0,
      },
      {
        name: 'Crémation avec cérémonie',
        description: 'Organisation de crémation avec cérémonie civile et urne funéraire',
        price: 2000,
        duration: 0,
      },
      {
        name: 'Transport de corps avant mise en bière',
        description: 'Transfert du lieu de décès vers le domicile ou la chambre funéraire',
        price: 350,
        duration: 0,
      },
      {
        name: 'Soins de conservation',
        description: 'Soins de présentation et de conservation du défunt',
        price: 450,
        duration: 0,
      },
    ],
  },
  veterinary: {
    title: 'Vétérinaire',
    icon: PawPrint,
    fields: [
      {
        id: 'name',
        label: 'Nom du service',
        type: 'text',
        placeholder: 'Ex: Consultation générale',
        required: true,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Décrivez le service...',
      },
      {
        id: 'price',
        label: 'Prix (TND)',
        type: 'number',
        placeholder: '60',
        required: true,
      },
      {
        id: 'duration',
        label: 'Durée (min)',
        type: 'number',
        placeholder: '30',
      },
      {
        id: 'animalTypes',
        label: 'Animaux pris en charge',
        type: 'multiselect',
        options: [
          {
            value: 'dog',
            label: 'Chiens',
          },
          {
            value: 'cat',
            label: 'Chats',
          },
          {
            value: 'bird',
            label: 'Oiseaux',
          },
          {
            value: 'reptile',
            label: 'Reptiles',
          },
          {
            value: 'nac',
            label: 'NAC (Nouveaux Animaux de Compagnie)',
          },
          {
            value: 'horse',
            label: 'Chevaux',
          },
        ],
      },
      {
        id: 'homeVisit',
        label: 'Consultation à domicile disponible',
        type: 'checkbox',
      },
      {
        id: 'emergency24h',
        label: 'Urgences 24h/24',
        type: 'checkbox',
      },
    ],

    defaultServices: [
      {
        name: 'Consultation générale',
        description: 'Examen complet de santé pour chiens et chats',
        price: 60,
        duration: 30,
      },
      {
        name: 'Vaccination annuelle',
        description: 'Rappel de vaccins et examen de santé',
        price: 80,
        duration: 20,
      },
      {
        name: 'Consultation NAC',
        description: 'Examen pour lapins, rongeurs, oiseaux, reptiles',
        price: 70,
        duration: 30,
      },
      {
        name: 'Identification par puce',
        description: 'Pose de puce électronique et enregistrement',
        price: 90,
        duration: 15,
      },
      {
        name: 'Détartrage',
        description: 'Nettoyage dentaire sous anesthésie générale',
        price: 150,
        duration: 45,
      },
      {
        name: 'Consultation comportementale',
        description: 'Évaluation et conseils pour problèmes de comportement',
        price: 90,
        duration: 60,
      },
      {
        name: 'Échographie vétérinaire',
        description: 'Imagerie diagnostique abdominale ou cardiaque',
        price: 120,
        duration: 30,
      },
      {
        name: 'Castration / Stérilisation',
        description: 'Chirurgie de convenance (prix de base)',
        price: 180,
        duration: 60,
      },
    ],
  },
};

const CATEGORY_DISPLAY_METADATA: Record<
  FallbackProviderCategoryConfigKey,
  CategoryDisplayMetadata
> = {
  doctor: {
    title: 'Médecin',
    icon: Stethoscope,
  },
  maternity: {
    title: 'Maternité',
    icon: Baby,
  },
  night_care: {
    title: 'Garde de Nuit',
    icon: Moon,
  },
  gym: {
    title: 'Salle de Sport',
    icon: Dumbbell,
  },
  checkup: {
    title: 'Bilan de Santé',
    icon: ClipboardCheck,
  },
  chronic_care: {
    title: 'Soins Chroniques',
    icon: HeartPulse,
  },
  medical_companion: {
    title: 'Accompagnement Médical',
    icon: Users,
  },
  babysitting: {
    title: "Garde d'Enfants",
    icon: Baby,
  },
};

function cloneFields(fields: ServiceAuthoringField[]): ServiceAuthoringField[] {
  return fields.map((field) => ({
    ...field,
    ...(field.options
      ? {
          options: field.options.map((option) => ({
            ...option,
          })),
        }
      : {}),
  }));
}

function cloneDefaultServices(
  defaultServices: ServiceAuthoringDefaultService[] | undefined,
): ServiceAuthoringDefaultService[] | undefined {
  return defaultServices?.map((service) => ({
    ...service,
  }));
}

function isBespokeCategory(
  categoryKey: ProviderCategoryConfigKey,
): categoryKey is BespokeProviderCategoryConfigKey {
  return categoryKey in BESPOKE_SERVICE_CONFIGS;
}

export function isLookupCategory(categoryKey: ProviderCategoryConfigKey): boolean {
  return LOOKUP_CATEGORY_KEYS.has(categoryKey);
}

export function getServiceAuthoringConfig(
  categoryKey: ProviderCategoryConfigKey | null,
): ServiceAuthoringConfig | null {
  if (!categoryKey) {
    return null;
  }

  if (isBespokeCategory(categoryKey)) {
    const config = BESPOKE_SERVICE_CONFIGS[categoryKey];

    return {
      ...config,
      fields: cloneFields(config.fields),
      ...(config.defaultServices
        ? { defaultServices: cloneDefaultServices(config.defaultServices) }
        : {}),
      isBespoke: true,
      hasLookupDependencies: isLookupCategory(categoryKey),
    };
  }

  const metadata = CATEGORY_DISPLAY_METADATA[categoryKey as FallbackProviderCategoryConfigKey];

  if (!metadata) {
    return null;
  }

  return {
    ...metadata,
    fields: cloneFields(STANDARD_FALLBACK_FIELDS),
    isBespoke: false,
    hasLookupDependencies: false,
  };
}
