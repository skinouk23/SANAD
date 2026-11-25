import type {
  Donation,
  DonationCategoryOption,
  DonationCondition,
  DonationPostForm,
  DonationPostItem,
  DonationPostStepOption,
  DonationRequestItem,
  DonationStatus,
  DonationTabOption,
  DonationType,
} from '@/features/patient/donations/medicationDonation.types';

export const donationInputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500';

export const donationTabs: DonationTabOption[] = [
  { id: 'browse', label: 'Parcourir', icon: '🔍' },
  { id: 'post', label: 'Publier un don', icon: '🤝' },
  { id: 'my-requests', label: 'Mes demandes', icon: '📋' },
  { id: 'my-donations', label: 'Mes dons', icon: '💚' },
];

export const donationPostSteps: DonationPostStepOption[] = [
  { id: 1, label: 'Catégorie' },
  { id: 2, label: 'Détails' },
  { id: 3, label: 'Confirmation' },
];

export const donationTypeCategories: Record<DonationType, string[]> = {
  medication: [
    'Cancer / Oncologie',
    'Alzheimer / Démence',
    'Diabète',
    'Hypertension',
    'Cardiologie',
    'Autre maladie chronique',
  ],
  equipment: [
    'Fauteuil roulant',
    'Béquilles',
    'Déambulateur',
    'Lit médicalisé',
    "Concentrateur d'oxygène",
    'Autre matériel',
  ],
};

export const donationUnitOptions = ['comprimés', 'ampoules', 'unité', 'boîtes', 'flacons'];

export function createInitialDonationPostForm(): DonationPostForm {
  return {
    type: 'medication',
    name: '',
    brand: '',
    category: '',
    condition: 'new',
    quantity: '',
    unit: 'comprimés',
    location: '',
    expiryDate: '',
    requiresPrescription: false,
    description: '',
  };
}

export const mockDonations: Donation[] = [
  {
    id: '1',
    type: 'medication',
    name: 'Imatinib 400mg',
    brand: 'Gleevec',
    category: 'Cancer',
    condition: 'new',
    quantity: 30,
    unit: 'comprimés',
    location: 'Tunis',
    expiryDate: '2026-08',
    requiresPrescription: true,
    status: 'available',
    donorName: 'Famille Ben Salah',
    donorRating: 4.9,
    donorVerified: true,
    donorBadge: 'Donateur solidaire',
    postedDate: '2025-02-20',
    description:
      'Médicament non ouvert, suite au décès de notre père. Peut aider une famille dans le besoin.',
  },
  {
    id: '2',
    type: 'equipment',
    name: 'Fauteuil roulant manuel',
    brand: 'Invacare',
    category: 'Mobilité',
    condition: 'very-good',
    quantity: 1,
    unit: 'unité',
    location: 'Sfax',
    requiresPrescription: false,
    status: 'available',
    donorName: 'Ahmed Trabelsi',
    donorRating: 4.7,
    donorVerified: true,
    donorBadge: 'Donateur solidaire',
    postedDate: '2025-02-18',
    description: 'Fauteuil en très bon état, utilisé 6 mois. Pliable, léger.',
  },
  {
    id: '3',
    type: 'medication',
    name: 'Donepezil 10mg',
    brand: 'Aricept',
    category: 'Alzheimer',
    condition: 'new',
    quantity: 28,
    unit: 'comprimés',
    location: 'Sousse',
    expiryDate: '2026-05',
    requiresPrescription: true,
    status: 'available',
    donorName: 'Mme. Fatma Khelifi',
    donorRating: 5.0,
    donorVerified: true,
    postedDate: '2025-02-15',
    description: 'Boîte complète non ouverte.',
  },
  {
    id: '4',
    type: 'equipment',
    name: 'Déambulateur avec roues',
    brand: 'Drive Medical',
    category: 'Mobilité',
    condition: 'good',
    quantity: 1,
    unit: 'unité',
    location: 'Ariana',
    requiresPrescription: false,
    status: 'reserved',
    donorName: 'Sami Boughanmi',
    donorRating: 4.5,
    donorVerified: false,
    postedDate: '2025-02-10',
    description: 'Déambulateur 4 roues avec frein. Bon état général.',
  },
  {
    id: '5',
    type: 'medication',
    name: 'Metformine 1000mg',
    brand: 'Glucophage',
    category: 'Diabète',
    condition: 'new',
    quantity: 60,
    unit: 'comprimés',
    location: 'Monastir',
    expiryDate: '2026-11',
    requiresPrescription: true,
    status: 'available',
    donorName: 'Dr. Leila Mansouri',
    donorRating: 4.8,
    donorVerified: true,
    donorBadge: 'Professionnel de santé',
    postedDate: '2025-02-22',
    description: 'Médicament pour diabète type 2. Boîtes non ouvertes.',
  },
  {
    id: '6',
    type: 'equipment',
    name: 'Lit médicalisé électrique',
    brand: 'Stiegelmeyer',
    category: 'Confort',
    condition: 'good',
    quantity: 1,
    unit: 'unité',
    location: 'Nabeul',
    requiresPrescription: false,
    status: 'available',
    donorName: 'Famille Chaabane',
    donorRating: 4.6,
    donorVerified: true,
    postedDate: '2025-02-12',
    description: 'Lit 3 fonctions avec télécommande. Matelas inclus.',
  },
];

export const donationBrowseCategories: DonationCategoryOption[] = [
  {
    id: 'all',
    label: '🏥 Tout',
    count: mockDonations.length,
  },
  {
    id: 'medication',
    label: '💊 Médicaments',
    count: mockDonations.filter((donation) => donation.type === 'medication').length,
  },
  {
    id: 'equipment',
    label: '🦽 Matériel',
    count: mockDonations.filter((donation) => donation.type === 'equipment').length,
  },
];

export const mockMyRequests: DonationRequestItem[] = [
  {
    id: 'r1',
    donationName: 'Fauteuil roulant manuel',
    donorName: 'Ahmed Trabelsi',
    requestDate: '2025-02-19',
    status: 'pending',
    message: 'Ma mère a besoin de ce fauteuil suite à une fracture.',
  },
  {
    id: 'r2',
    donationName: 'Imatinib 400mg',
    donorName: 'Famille Ben Salah',
    requestDate: '2025-02-10',
    status: 'accepted',
    message: 'Traitement pour mon père atteint de leucémie.',
  },
];

export const mockMyDonations: DonationPostItem[] = [
  {
    id: 'd1',
    name: 'Béquilles aluminium',
    type: 'equipment',
    status: 'given',
    postedDate: '2025-01-15',
    requests: 3,
  },
];

export const donationStatusConfig: Record<DonationStatus, { label: string; className: string }> = {
  available: {
    label: 'Disponible',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  reserved: {
    label: 'Réservé',
    className:
      'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
  },
  given: {
    label: 'Donné',
    className:
      'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400',
  },
};

export const donationConditionLabels: Record<DonationCondition, string> = {
  new: 'Neuf',
  'very-good': 'Très bon état',
  good: 'Bon état',
};
