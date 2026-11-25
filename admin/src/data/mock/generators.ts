/**
 * Mock Data Generators
 * Generates realistic mock data for development and testing
 */

import type {
  User,
  Patient,
  Provider,
  Appointment,
  Transaction,
  Conversation,
  Message,
  AdminStats,
  SystemHealth,
  AuditLog,
  FraudAlert,
  SupportTicket,
  Equipment,
  Notification,
  UserSegment,
  AppointmentStatus,
  AppointmentType,
  TransactionStatus,
  ProviderType } from
'../../types/api.types';

// ============================================
// HELPER FUNCTIONS
// ============================================

const randomId = () => Math.random().toString(36).substring(2, 15);
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
const randomElement = <T,>(arr: T[]): T =>
arr[Math.floor(Math.random() * arr.length)];
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
'Hedi'];

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
'Essid'];

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
'Monastir'];


const serviceNames: Record<ProviderType, string[]> = {
  nurse: [
  'Injection à domicile',
  'Pansement complexe',
  'Prise de sang',
  'Perfusion',
  'Soins post-opératoires'],

  physiotherapist: [
  'Rééducation',
  'Massage thérapeutique',
  'Kinésithérapie respiratoire',
  'Électrothérapie'],

  doctor: [
  'Consultation générale',
  'Consultation spécialisée',
  'Suivi chronique',
  'Certificat médical'],

  laboratory: [
  'Bilan sanguin complet',
  'Analyse urinaire',
  'Test COVID',
  'Bilan lipidique'],

  radiology: ['Radiographie', 'Échographie', 'Scanner', 'IRM'],
  pharmacy: [
  'Livraison médicaments',
  'Préparation magistrale',
  'Conseil pharmaceutique'],

  ambulance: ['Transport médical', 'Urgence', 'Rapatriement'],
  equipment: [
  'Location fauteuil roulant',
  'Lit médicalisé',
  'Concentrateur oxygène'],

  nutritionist: ['Consultation nutrition', 'Plan alimentaire', 'Suivi poids'],
  funeral: ['Services funéraires', 'Transport', 'Formalités administratives'],
  gym: ['Coaching personnel', 'Rééducation sportive', 'Programme fitness']
};

// ============================================
// USER GENERATORS
// ============================================

export function generatePatient(overrides?: Partial<Patient>): Patient {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const segments: UserSegment[] = [
  'vip',
  'active',
  'occasional',
  'inactive',
  'at_risk'];


  return {
    id: `patient_${randomId()}`,
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
      upcomingAppointments: randomNumber(0, 3)
    },
    familyCircle: [],
    ...overrides
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
  'pharmacy'];

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
    gym: 'Coach sportif'
  };

  return {
    id: `provider_${randomId()}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@pro.sanad.tn`,
    name:
    providerType === 'doctor' ?
    `Dr. ${firstName} ${lastName}` :
    `${firstName} ${lastName}`,
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
      city: randomElement(cities)
    },
    services: services.slice(0, randomNumber(2, 4)).map((name, i) => ({
      id: `service_${randomId()}`,
      name,
      price: randomNumber(30, 150),
      duration: randomElement([30, 45, 60, 90]),
      category: providerType,
      active: true
    })),
    stats: {
      totalAppointments: randomNumber(50, 500),
      completedAppointments: randomNumber(40, 450),
      cancelledAppointments: randomNumber(5, 30),
      totalRevenue: randomNumber(5000, 50000),
      pendingRevenue: randomNumber(100, 2000),
      averageRating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      responseRate: randomNumber(85, 100),
      completionRate: randomNumber(90, 100)
    },
    subscriptionTier: randomElement(['basic', 'pro', 'enterprise']),
    createdAt: randomDate(365),
    updatedAt: randomDate(30),
    lastActiveAt: randomDate(3),
    ...overrides
  };
}

// ============================================
// APPOINTMENT GENERATORS
// ============================================

export function generateAppointment(
patient?: Patient,
provider?: Provider,
overrides?: Partial<Appointment>)
: Appointment {
  const statuses: AppointmentStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'];

  const types: AppointmentType[] = ['home', 'video', 'clinic'];
  const status = overrides?.status || randomElement(statuses);
  const isPast = status === 'completed' || status === 'cancelled';
  const providerType = provider?.providerType || 'nurse';
  const services = serviceNames[providerType] || serviceNames.nurse;
  const serviceName = randomElement(services);
  const serviceId = `service_${randomId()}`;
  const price = randomNumber(30, 150);
  const duration = randomElement([30, 45, 60, 90]);

  return {
    id: `apt_${randomId()}`,
    patientId: patient?.id || `patient_${randomId()}`,
    providerId: provider?.id || `provider_${randomId()}`,
    patient,
    provider,
    serviceId,
    serviceName,
    // Add service object for convenience
    service: {
      id: serviceId,
      name: serviceName,
      price,
      duration
    },
    status,
    type: randomElement(types),
    scheduledAt: isPast ? randomDate(30) : randomFutureDate(14),
    duration,
    price,
    totalPrice: price,
    address: `${randomNumber(1, 100)} Rue ${randomElement(['Habib Bourguiba', 'de la Liberté'])}, ${randomElement(cities)}`,
    validationCode:
    status === 'confirmed' ? `${randomNumber(1000, 9999)}` : undefined,
    rating: status === 'completed' ? randomNumber(3, 5) : undefined,
    createdAt: randomDate(60),
    updatedAt: randomDate(7),
    ...overrides
  };
}

// ============================================
// TRANSACTION GENERATORS
// ============================================

export function generateTransaction(
overrides?: Partial<Transaction>)
: Transaction {
  const statuses: TransactionStatus[] = [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'];

  const status = overrides?.status || randomElement(statuses);
  const amount = randomNumber(30, 200);
  const commission = Math.round(amount * 0.15);

  return {
    id: `txn_${randomId()}`,
    type: randomElement(['payment', 'deposit', 'deduction', 'payout']),
    status,
    amount,
    currency: 'TND',
    commission,
    netAmount: amount - commission,
    paymentMethod: randomElement(['card', 'd17', 'cash']),
    appointmentId: `apt_${randomId()}`,
    patientId: `patient_${randomId()}`,
    providerId: `provider_${randomId()}`,
    description: randomElement(serviceNames.nurse),
    createdAt: randomDate(30),
    processedAt: status === 'completed' ? randomDate(30) : undefined,
    ...overrides
  };
}

// ============================================
// MESSAGE GENERATORS
// ============================================

export function generateConversation(
patient?: Patient,
provider?: Provider)
: Conversation {
  const patientData = patient || generatePatient();
  const providerData = provider || generateProvider();

  return {
    id: `conv_${randomId()}`,
    participants: [
    {
      userId: patientData.id,
      user: patientData,
      role: 'patient',
      joinedAt: randomDate(30)
    },
    {
      userId: providerData.id,
      user: providerData,
      role: 'provider',
      joinedAt: randomDate(30)
    }],

    unreadCount: randomNumber(0, 5),
    createdAt: randomDate(30),
    updatedAt: randomDate(3)
  };
}

export function generateMessage(
conversationId: string,
senderId: string)
: Message {
  const messages = [
  'Bonjour, je souhaite prendre rendez-vous.',
  'Bien sûr, quand êtes-vous disponible ?',
  'Demain matin serait parfait.',
  'Je confirme le rendez-vous pour demain à 10h.',
  'Merci beaucoup !',
  'À demain alors.',
  "Le rendez-vous s'est bien passé, merci.",
  "Je vous en prie, n'hésitez pas si vous avez des questions."];


  return {
    id: `msg_${randomId()}`,
    conversationId,
    senderId,
    content: randomElement(messages),
    type: 'text',
    read: Math.random() > 0.3,
    createdAt: randomDate(7)
  };
}

// ============================================
// ADMIN DATA GENERATORS
// ============================================

export function generateAdminStats(): AdminStats {
  return {
    users: {
      total: randomNumber(10000, 15000),
      active: randomNumber(8000, 12000),
      newThisWeek: randomNumber(100, 300),
      newThisMonth: randomNumber(500, 1000),
      byRole: {
        patient: randomNumber(8000, 10000),
        provider: randomNumber(500, 1000),
        admin: randomNumber(10, 30),
        super_admin: randomNumber(1, 5)
      },
      bySegment: {
        vip: randomNumber(200, 500),
        active: randomNumber(3000, 5000),
        occasional: randomNumber(4000, 6000),
        inactive: randomNumber(2000, 3000),
        at_risk: randomNumber(100, 300)
      }
    },
    appointments: {
      total: randomNumber(50000, 80000),
      completed: randomNumber(40000, 60000),
      pending: randomNumber(500, 1000),
      cancelled: randomNumber(2000, 5000),
      todayCount: randomNumber(50, 150),
      weekCount: randomNumber(400, 800)
    },
    revenue: {
      total: randomNumber(500000, 1000000),
      thisWeek: randomNumber(20000, 50000),
      thisMonth: randomNumber(80000, 150000),
      pending: randomNumber(5000, 15000),
      commissions: randomNumber(50000, 100000)
    },
    providers: {
      total: randomNumber(500, 1000),
      active: randomNumber(400, 800),
      pendingApproval: randomNumber(10, 50),
      suspended: randomNumber(5, 20)
    }
  };
}

export function generateSystemHealth(): SystemHealth {
  const services = [
  {
    name: 'API Gateway',
    status: 'operational' as const,
    responseTime: randomNumber(50, 150)
  },
  {
    name: 'Database',
    status: 'operational' as const,
    responseTime: randomNumber(10, 50)
  },
  {
    name: 'Authentication',
    status: 'operational' as const,
    responseTime: randomNumber(30, 100)
  },
  {
    name: 'Payment Gateway',
    status: randomElement([
    'operational',
    'operational',
    'degraded'] as
    const),
    responseTime: randomNumber(100, 300)
  },
  {
    name: 'Notification Service',
    status: 'operational' as const,
    responseTime: randomNumber(20, 80)
  },
  {
    name: 'File Storage',
    status: 'operational' as const,
    responseTime: randomNumber(50, 200)
  }];


  const hasIssue = services.some((s) => s.status !== 'operational');

  return {
    status: hasIssue ? 'degraded' : 'operational',
    uptime: Number((99 + Math.random()).toFixed(2)),
    responseTime: randomNumber(80, 200),
    activeUsers: randomNumber(500, 2000),
    services,
    lastChecked: new Date().toISOString()
  };
}

export function generateAuditLog(): AuditLog {
  const actions = [
  { action: 'user.login', resource: 'auth' },
  { action: 'user.logout', resource: 'auth' },
  { action: 'appointment.create', resource: 'appointments' },
  { action: 'appointment.update', resource: 'appointments' },
  { action: 'payment.process', resource: 'transactions' },
  { action: 'provider.approve', resource: 'providers' },
  { action: 'document.verify', resource: 'documents' },
  { action: 'settings.update', resource: 'settings' }];

  const selected = randomElement(actions);

  return {
    id: `log_${randomId()}`,
    userId: `user_${randomId()}`,
    action: selected.action,
    resource: selected.resource,
    resourceId: `${selected.resource}_${randomId()}`,
    ipAddress: `${randomNumber(1, 255)}.${randomNumber(1, 255)}.${randomNumber(1, 255)}.${randomNumber(1, 255)}`,
    createdAt: randomDate(7)
  };
}

export function generateFraudAlert(): FraudAlert {
  const types = [
  'suspicious_login',
  'unusual_activity',
  'payment_fraud',
  'account_takeover'] as
  const;
  const severities = ['low', 'medium', 'high', 'critical'] as const;
  const statuses = [
  'open',
  'investigating',
  'resolved',
  'false_positive'] as
  const;

  return {
    id: `fraud_${randomId()}`,
    type: randomElement([...types]),
    severity: randomElement([...severities]),
    status: randomElement([...statuses]),
    userId: `user_${randomId()}`,
    description: 'Activité suspecte détectée sur le compte',
    createdAt: randomDate(14)
  };
}

export function generateSupportTicket(): SupportTicket {
  const categories = [
  'technical',
  'billing',
  'account',
  'complaint',
  'other'] as
  const;
  const priorities = ['low', 'medium', 'high', 'urgent'] as const;
  const statuses = [
  'open',
  'in_progress',
  'waiting_response',
  'resolved',
  'closed'] as
  const;
  const subjects = [
  'Problème de connexion',
  'Paiement non reçu',
  'Annulation de rendez-vous',
  'Question sur les tarifs',
  'Réclamation service'];


  return {
    id: `ticket_${randomId()}`,
    userId: `user_${randomId()}`,
    subject: randomElement(subjects),
    description:
    "Description détaillée du problème rencontré par l'utilisateur.",
    category: randomElement([...categories]),
    priority: randomElement([...priorities]),
    status: randomElement([...statuses]),
    messages: [],
    createdAt: randomDate(14),
    updatedAt: randomDate(3)
  };
}

// ============================================
// EQUIPMENT GENERATORS
// ============================================

export function generateEquipment(overrides?: Partial<Equipment>): Equipment {
  const categories = [
  'Mobilité',
  'Respiration',
  'Surveillance',
  'Confort',
  'Rééducation'];

  const equipmentNames: Record<string, string[]> = {
    Mobilité: [
    'Fauteuil roulant',
    'Déambulateur',
    'Canne de marche',
    'Béquilles'],

    Respiration: [
    "Concentrateur d'oxygène",
    'Nébuliseur',
    'Aspirateur de mucosités'],

    Surveillance: ['Tensiomètre', 'Oxymètre', 'Glucomètre', 'Thermomètre'],
    Confort: [
    'Lit médicalisé',
    'Matelas anti-escarres',
    'Coussin de positionnement'],

    Rééducation: ["Vélo d'appartement", 'Pédalier', 'Bandes élastiques']
  };

  const category = overrides?.category || randomElement(categories);
  const names = equipmentNames[category] || equipmentNames['Mobilité'];

  return {
    id: `equip_${randomId()}`,
    name: randomElement(names),
    description:
    'Équipement médical de qualité professionnelle pour usage à domicile.',
    category,
    brand: randomElement(['Invacare', 'Drive Medical', 'Philips', 'Omron']),
    model: `MOD-${randomNumber(1000, 9999)}`,
    images: [],
    pricePerDay: randomNumber(15, 50),
    pricePerWeek: randomNumber(80, 250),
    pricePerMonth: randomNumber(250, 800),
    deposit: randomNumber(100, 500),
    available: Math.random() > 0.2,
    quantity: randomNumber(3, 20),
    availableQuantity: randomNumber(1, 10),
    providerId: `provider_${randomId()}`,
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    reviewCount: randomNumber(5, 100),
    createdAt: randomDate(180),
    ...overrides
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
providers?: Provider[])
: Appointment[] {
  return Array.from({ length: count }, () => {
    const patient = patients ? randomElement(patients) : undefined;
    const provider = providers ? randomElement(providers) : undefined;
    return generateAppointment(patient, provider);
  });
}

export function generateTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, () => generateTransaction());
}

export function generateAuditLogs(count: number): AuditLog[] {
  return Array.from({ length: count }, () => generateAuditLog());
}

export function generateFraudAlerts(count: number): FraudAlert[] {
  return Array.from({ length: count }, () => generateFraudAlert());
}

export function generateSupportTickets(count: number): SupportTicket[] {
  return Array.from({ length: count }, () => generateSupportTicket());
}

export function generateEquipmentList(count: number): Equipment[] {
  return Array.from({ length: count }, () => generateEquipment());
}

export function generateConversations(
count: number,
patients?: Patient[],
providers?: Provider[])
: Conversation[] {
  return Array.from({ length: count }, () => {
    const patient = patients ? randomElement(patients) : undefined;
    const provider = providers ? randomElement(providers) : undefined;
    return generateConversation(patient, provider);
  });
}