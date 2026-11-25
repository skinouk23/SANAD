/**
 * Mock Data Generators
 * Generates realistic mock data for development and testing
 */

import type {
  Appointment,
  Transaction,
  Conversation,
  Patient,
  Provider,
  AppointmentStatus,
  AppointmentType,
  TransactionStatus,
  ProviderType,
} from '@/data/mock/types';
import type { UserSegment } from '@/shared/schemas';

// ============================================
// HELPER FUNCTIONS
// ============================================

const randomId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
const randomDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};
const randomFutureDate = (daysAhead: number = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date.toISOString();
};
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Tunisian names
const firstNames = [
  'Mohamed',
  'Ahmed',
  'Fatma',
  'Amel',
  'Sami',
  'Karim',
  'Sarah',
  'Nadia',
  'Youssef',
  'Leila',
  'Omar',
  'Rania',
  'Tarek',
  'Ines',
  'Hedi',
];

const lastNames = [
  'Ben Ali',
  'Trabelsi',
  'Gharbi',
  'Mansour',
  'Kallel',
  'Ben Salem',
  'Karray',
  'Bouazizi',
  'Hamdi',
  'Jebali',
  'Chahed',
  'Essid',
];

const cities = [
  'Tunis',
  'Sfax',
  'Sousse',
  'La Marsa',
  'Carthage',
  'Lac 2',
  'Ariana',
  'Ben Arous',
  'Nabeul',
  'Monastir',
];

const serviceNames: Record<ProviderType, string[]> = {
  nurse: [
    'Injection à domicile',
    'Pansement complexe',
    'Prise de sang',
    'Perfusion',
    'Soins post-opératoires',
  ],

  physiotherapist: [
    'Rééducation',
    'Massage thérapeutique',
    'Kinésithérapie respiratoire',
    'Électrothérapie',
  ],

  doctor: [
    'Consultation générale',
    'Consultation spécialisée',
    'Suivi chronique',
    'Certificat médical',
  ],

  laboratory: ['Bilan sanguin complet', 'Analyse urinaire', 'Test COVID', 'Bilan lipidique'],

  radiology: ['Radiographie', 'Échographie', 'Scanner', 'IRM'],
  pharmacy: ['Livraison médicaments', 'Préparation magistrale', 'Conseil pharmaceutique'],

  ambulance: ['Transport médical', 'Urgence', 'Rapatriement'],
  equipment: ['Location fauteuil roulant', 'Lit médicalisé', 'Concentrateur oxygène'],

  nutritionist: ['Consultation nutrition', 'Plan alimentaire', 'Suivi poids'],
  funeral: ['Services funéraires', 'Transport', 'Formalités administratives'],
  gym: ['Coaching personnel', 'Rééducation sportive', 'Programme fitness'],
};

// ============================================
// USER GENERATORS
// ============================================

export function generatePatient(overrides?: Partial<Patient>): Patient {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const segments: UserSegment[] = ['vip', 'active', 'occasional', 'inactive', 'at_risk'];

  return {
    id: randomId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@email.com`,
    name: `${firstName} ${lastName}`,
    phone: `+216 ${randomNumber(20, 99)} ${randomNumber(100, 999)} ${randomNumber(100, 999)}`,
    role: 'patient',
    status: 'active',
    segment: randomElement(segments),
    createdAt: randomDate(365),
    updatedAt: randomDate(30),
    lastActiveAt: randomDate(7),
    address: `${randomNumber(1, 100)} Rue ${randomElement(['Habib Bourguiba', 'de la Liberté', 'de Paris', 'Ibn Khaldoun'])}, ${randomElement(cities)}`,
    stats: {
      totalAppointments: randomNumber(1, 50),
      totalSpent: randomNumber(100, 5000),
      streakDays: randomNumber(0, 30),
      upcomingAppointments: randomNumber(0, 3),
    },
    familyCircle: [],
    ...overrides,
  };
}

export function generateProvider(overrides?: Partial<Provider>): Provider {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const providerTypes: ProviderType[] = [
    'nurse',
    'physiotherapist',
    'doctor',
    'laboratory',
    'radiology',
    'pharmacy',
  ];

  const providerType = overrides?.providerType || randomElement(providerTypes);
  const services = serviceNames[providerType] || serviceNames.nurse;
  const specialtyMap: Record<ProviderType, string> = {
    nurse: 'Infirmier(e)',
    physiotherapist: 'Kinésithérapeute',
    doctor: 'Médecin généraliste',
    laboratory: 'Laboratoire',
    radiology: 'Radiologie',
    pharmacy: 'Pharmacie',
    ambulance: 'Ambulance',
    equipment: 'Équipement médical',
    nutritionist: 'Nutritionniste',
    funeral: 'Services funéraires',
    gym: 'Coach sportif',
  };

  return {
    id: randomId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@pro.sanad.tn`,
    name: providerType === 'doctor' ? `Dr. ${firstName} ${lastName}` : `${firstName} ${lastName}`,
    phone: `+216 ${randomNumber(20, 99)} ${randomNumber(100, 999)} ${randomNumber(100, 999)}`,
    role: 'provider',
    status: 'active',
    providerType,
    specialty: specialtyMap[providerType],
    specialties: [randomElement(services)],
    licenseNumber: `LIC-${randomNumber(10000, 99999)}`,
    licenseVerified: Math.random() > 0.2,
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    reviewCount: randomNumber(10, 200),
    available: Math.random() > 0.3,
    location: {
      address: `${randomNumber(1, 100)} Rue ${randomElement(['Habib Bourguiba', 'de la Liberté', 'de Paris'])}, ${randomElement(cities)}`,
      city: randomElement(cities),
      countryCode: 'TN',
    },
    services: services.slice(0, randomNumber(2, 4)).map((name, _i) => ({
      id: randomId(),
      name,
      price: randomNumber(30, 150),
      duration: randomElement([30, 45, 60, 90]),
      category: providerType,
      active: true,
    })),
    stats: {
      totalAppointments: randomNumber(50, 500),
      completedAppointments: randomNumber(40, 450),
      cancelledAppointments: randomNumber(5, 30),
      totalRevenue: randomNumber(5000, 50000),
      pendingRevenue: randomNumber(100, 2000),
      averageRating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      responseRate: randomNumber(85, 100),
      completionRate: randomNumber(90, 100),
    },
    subscriptionTier: randomElement(['basic', 'pro', 'enterprise']),
    createdAt: randomDate(365),
    updatedAt: randomDate(30),
    lastActiveAt: randomDate(3),
    ...overrides,
  };
}

// ============================================
// APPOINTMENT GENERATORS
// ============================================

export function generateAppointment(
  patient?: Patient,
  provider?: Provider,
  overrides?: Partial<Appointment>,
): Record<string, unknown> {
  const statuses: AppointmentStatus[] = [
    'pending',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
  ];

  const types: AppointmentType[] = ['home', 'video', 'clinic'];
  const status = overrides?.status || randomElement(statuses);
  const isPast = status === 'completed' || status === 'cancelled';
  const providerType = provider?.providerType || 'nurse';
  const services = serviceNames[providerType] || serviceNames.nurse;
  const serviceName = randomElement(services);
  const serviceId = randomId();
  const price = randomNumber(30, 150);
  const duration = randomElement([30, 45, 60, 90]);

  return {
    id: randomId(),
    patientId: patient?.id || randomId(),
    providerId: provider?.id || randomId(),
    patient,
    provider,
    serviceId,
    serviceName,
    // Add service object for convenience
    service: {
      id: serviceId,
      name: serviceName,
      price,
      duration,
    },
    status,
    type: randomElement(types),
    scheduledAt: isPast ? randomDate(30) : randomFutureDate(14),
    duration,
    price,
    totalPrice: price,
    address: `${randomNumber(1, 100)} Rue ${randomElement(['Habib Bourguiba', 'de la Liberté'])}, ${randomElement(cities)}`,
    validationCode: status === 'confirmed' ? `${randomNumber(1000, 9999)}` : undefined,
    rating: status === 'completed' ? randomNumber(3, 5) : undefined,
    createdAt: randomDate(60),
    updatedAt: randomDate(7),
    ...overrides,
  };
}

// ============================================
// TRANSACTION GENERATORS
// ============================================

export function generateTransaction(overrides?: Partial<Transaction>): Transaction {
  const statuses: TransactionStatus[] = [
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
  ];

  const status = overrides?.status || randomElement(statuses);
  const amount = randomNumber(30, 200);
  const commission = Math.round(amount * 0.15);

  return {
    id: randomId(),
    type: randomElement(['payment', 'deposit', 'deduction', 'payout']),
    status,
    amount,
    currency: 'TND',
    commission,
    netAmount: amount - commission,
    paymentMethod: randomElement(['card', 'd17', 'cash']),
    appointmentId: randomId(),
    patientId: randomId(),
    providerId: randomId(),
    description: randomElement(serviceNames.nurse),
    createdAt: randomDate(30),
    processedAt: status === 'completed' ? randomDate(30) : undefined,
    ...overrides,
  };
}

// ============================================
// MESSAGE GENERATORS
// ============================================

export function generateConversation(
  patient?: Patient,
  provider?: Provider,
): Record<string, unknown> {
  const patientData = patient || generatePatient();
  const providerData = provider || generateProvider();

  return {
    id: randomId(),
    participants: [
      {
        userId: patientData.id,
        user: patientData,
        role: 'patient',
        joinedAt: randomDate(30),
      },
      {
        userId: providerData.id,
        user: providerData,
        role: 'provider',
        joinedAt: randomDate(30),
      },
    ],

    unreadCount: randomNumber(0, 5),
    createdAt: randomDate(30),
    updatedAt: randomDate(3),
  };
}

export function generateMessage(conversationId: string, senderId: string): Record<string, unknown> {
  const messages = [
    'Bonjour, je souhaite prendre rendez-vous.',
    'Bien sûr, quand êtes-vous disponible ?',
    'Demain matin serait parfait.',
    'Je confirme le rendez-vous pour demain à 10h.',
    'Merci beaucoup !',
    'À demain alors.',
    "Le rendez-vous s'est bien passé, merci.",
    "Je vous en prie, n'hésitez pas si vous avez des questions.",
  ];

  return {
    id: randomId(),
    conversationId,
    senderId,
    content: randomElement(messages),
    type: 'text',
    read: Math.random() > 0.3,
    createdAt: randomDate(7),
  };
}

// ============================================
// BATCH GENERATORS
// ============================================

export function generatePatients(count: number): Patient[] {
  return Array.from({ length: count }, () => generatePatient());
}

export function generateProviders(count: number): Provider[] {
  return Array.from({ length: count }, () => generateProvider());
}

export function generateAppointments(
  count: number,
  patients?: Patient[],
  providers?: Provider[],
): Appointment[] {
  return Array.from({ length: count }, () => {
    const patient = patients ? randomElement(patients) : undefined;
    const provider = providers ? randomElement(providers) : undefined;
    return generateAppointment(patient, provider) as unknown as Appointment;
  });
}

export function generateTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, () => generateTransaction());
}

export function generateConversations(
  count: number,
  patients?: Patient[],
  providers?: Provider[],
): Conversation[] {
  return Array.from({ length: count }, () => {
    const patient = patients ? randomElement(patients) : undefined;
    const provider = providers ? randomElement(providers) : undefined;
    return generateConversation(patient, provider) as unknown as Conversation;
  });
}
