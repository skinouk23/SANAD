import {
  AdminProvider,
  AdminPatient,
  AdminTransaction,
  SubscriptionTransaction,
  CommissionTransaction,
  AuditLog,
  AdminSettings,
  PatientReservation,
  ProviderBooking } from
'../../types/admin.types';

const cities = [
'Tunis',
'Sfax',
'Sousse',
'Monastir',
'Bizerte',
'Nabeul',
'Kairouan',
'Gabès'];

const services = [
'nursing',
'physio',
'laboratory',
'pharmacy',
'ambulance',
'nutrition'];


export const mockProviders: AdminProvider[] = Array.from({ length: 30 }).map(
  (_, i) => {
    const isPending = i < 5;
    const isCommission = i % 3 === 0;
    return {
      id: `prov-${i + 1}`,
      name: `Dr. Provider ${i + 1}`,
      email: `provider${i + 1}@example.com`,
      phone: `+216 20 000 ${i.toString().padStart(3, '0')}`,
      serviceType: services[i % services.length],
      city: cities[i % cities.length],
      rating: 4 + Math.random(),
      status: isPending ?
      'pending' :
      i === 6 ?
      'suspended' :
      i === 7 ?
      'blocked' :
      'active',
      subscriptionPlan: isCommission ? 'commission' : 'standard',
      joinedDate: new Date(
        Date.now() - Math.random() * 10000000000
      ).toISOString(),
      bookingsCount: Math.floor(Math.random() * 500),
      revenueGenerated: Math.floor(Math.random() * 50000),
      cancellationRate: Math.random() * 15,
      totalCancellations: Math.floor(Math.random() * 20),
      walletBalance: isCommission ?
      Math.floor(Math.random() * 5000) :
      undefined,
      pendingPayouts: isCommission ?
      Math.floor(Math.random() * 1000) :
      undefined,
      minTransferAmount: 100,
      documents: [
      {
        id: `doc-1-${i}`,
        type: 'License',
        url: '#',
        verified: !isPending,
        uploadedAt: new Date().toISOString()
      },
      {
        id: `doc-2-${i}`,
        type: 'ID Card',
        url: '#',
        verified: !isPending,
        uploadedAt: new Date().toISOString()
      }],

      aiAnalysis: isPending ?
      {
        score: Math.floor(Math.random() * 40) + 60,
        fraudRisk: Math.random() > 0.8 ? 'High' : 'Low',
        documentAuthenticity: Math.floor(Math.random() * 20) + 80,
        recommendation: Math.random() > 0.8 ? 'review' : 'approve',
        flags:
        Math.random() > 0.8 ?
        ['Mismatched ID name', 'Suspicious IP'] :
        []
      } :
      undefined
    };
  }
);

const tunisianNames = [
'Amira Ben Salah',
'Youssef Trabelsi',
'Fatma Bouazizi',
'Mehdi Gharbi',
'Leila Mansour',
'Karim Jlassi',
'Nour Hachani',
'Sami Khemiri',
'Aicha Ayari',
'Omar Baccouche',
'Sarra Miled',
'Ali Riahi',
'Ines Dridi',
'Mohamed Chaabane',
'Hela Rekik',
'Ahmed Zribi',
'Mariem Kallel',
'Walid Feki',
'Asma Dhaouadi',
'Nizar Sellami',
'Rym Ghorbel',
'Khaled Jendoubi',
'Salma Kharrat',
'Tarek Ben Ali',
'Nadia Marzouki',
'Hassen Touati',
'Safa Belhaj',
'Mourad Abid',
'Sonia Karray',
'Anis Ben Ammar',
'Wafa Triki',
'Zied Boukadida',
'Mouna Ellouze',
'Hichem Boughanmi',
'Imen Sassi',
'Fares Ben Youssef',
'Dorra Charni',
'Nabil Khemakhem',
'Amel Mseddi',
'Skander Gargouri'];


const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const insuranceProviders = [
'CNAM',
'Star Assurances',
'Comar',
'GAT Assurances',
'Maghrebia',
'Lloyd',
undefined];

const languages = ['fr', 'ar', 'en'] as const;
const commonAllergies = [
'Pénicilline',
'Arachides',
'Pollen',
'Acariens',
'Lactose',
'Gluten',
'Fruits de mer'];

const commonConditions = [
'Diabète Type 2',
'Hypertension',
'Asthme',
'Arthrose',
'Hypothyroïdie',
'Migraine chronique'];


export const mockPatients: AdminPatient[] = Array.from({ length: 40 }).map(
  (_, i) => {
    const name = tunisianNames[i % tunisianNames.length];
    const gender = [
    'Amira',
    'Fatma',
    'Leila',
    'Nour',
    'Aicha',
    'Sarra',
    'Ines',
    'Hela',
    'Mariem',
    'Asma',
    'Rym',
    'Salma',
    'Nadia',
    'Safa',
    'Sonia',
    'Wafa',
    'Mouna',
    'Imen',
    'Dorra',
    'Amel'].
    includes(name.split(' ')[0]) ?
    'female' :
    'male';
    const hasInsurance = Math.random() > 0.3;
    const hasEmergencyContact = Math.random() > 0.2;
    const numAllergies =
    Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0;
    const numConditions =
    Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;

    return {
      id: `pat-${i + 1}`,
      name,
      email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@example.com`,
      phone: `+216 ${Math.floor(Math.random() * 80 + 20)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
      city: cities[i % cities.length],
      bookingsCount: Math.floor(Math.random() * 50),
      totalSpent: Math.floor(Math.random() * 5000),
      status: [5, 12, 28].includes(i) ? 'suspended' : 'active',
      joinedDate: new Date(
        Date.now() - Math.random() * 100000000000
      ).toISOString(),
      dateOfBirth: new Date(
        Date.now() - (Math.random() * 50 + 20) * 31556952000
      ).
      toISOString().
      split('T')[0],
      gender,
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      address: `${Math.floor(Math.random() * 100 + 1)} Rue de ${cities[Math.floor(Math.random() * cities.length)]}`,
      preferredLanguage:
      languages[Math.floor(Math.random() * languages.length)],
      insuranceProvider: hasInsurance ?
      insuranceProviders[
      Math.floor(Math.random() * (insuranceProviders.length - 1))] :

      undefined,
      insuranceNumber: hasInsurance ?
      Math.floor(Math.random() * 10000000000).
      toString().
      padStart(10, '0') :
      undefined,
      emergencyContactName: hasEmergencyContact ?
      tunisianNames[(i + 5) % tunisianNames.length] :
      undefined,
      emergencyContactPhone: hasEmergencyContact ?
      `+216 ${Math.floor(Math.random() * 80 + 20)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}` :
      undefined,
      allergies: Array.from({ length: numAllergies }).map(
        () =>
        commonAllergies[Math.floor(Math.random() * commonAllergies.length)]
      ),
      chronicConditions: Array.from({ length: numConditions }).map(
        () =>
        commonConditions[Math.floor(Math.random() * commonConditions.length)]
      ),
      lastActivityDate: new Date(
        Date.now() - Math.random() * 1000000000
      ).toISOString(),
      lastBookingDate:
      Math.random() > 0.2 ?
      new Date(Date.now() - Math.random() * 5000000000).toISOString() :
      undefined,
      cancellationRate: Math.random() * 20,
      totalCancellations: Math.floor(Math.random() * 10),
      averageRating: 3.5 + Math.random() * 1.5,
      notes:
      Math.random() > 0.8 ? "Patient VIP. Toujours à l'heure." : undefined
    };
  }
);

const providerNames = [
'Dr. Amine Bouzid',
'Dr. Salma Khelifi',
'Inf. Youssef Trabelsi',
'Dr. Hela Rekik',
'Dr. Omar Baccouche',
'Kiné. Asma Dhaouadi',
'Dr. Ali Riahi',
'Inf. Mariem Kallel',
'Dr. Walid Feki',
'Dr. Rym Ghorbel'];


const serviceTypes = [
'nursing',
'physio',
'laboratory',
'pharmacy',
'ambulance',
'nutrition'];

const serviceNames = {
  nursing: 'Soins infirmiers à domicile',
  physio: 'Séance de kinésithérapie',
  laboratory: 'Analyse de sang',
  pharmacy: 'Livraison médicaments',
  ambulance: 'Transport médical',
  nutrition: 'Consultation nutrition'
};

const specialties = {
  nursing: 'Infirmier(e) D.E',
  physio: 'Kinésithérapeute',
  laboratory: "Laboratoire d'analyses",
  pharmacy: 'Pharmacien',
  ambulance: 'Ambulancier',
  nutrition: 'Nutritionniste'
};

export const mockReservations: PatientReservation[] = Array.from({
  length: 80
}).map((_, i) => {
  const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
  const serviceType = serviceTypes[
  Math.floor(Math.random() * serviceTypes.length)] as
  keyof typeof serviceNames;
  const statuses = [
  'confirmed',
  'completed',
  'cancelled',
  'pending',
  'in_progress',
  'no_show'] as
  const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: `res-${i + 1}`,
    patientId: patient.id,
    patientName: patient.name,
    date: new Date(Date.now() - Math.random() * 5000000000).
    toISOString().
    split('T')[0],
    time: `${Math.floor(Math.random() * 10 + 8).
    toString().
    padStart(2, '0')}:00`,
    endTime: `${Math.floor(Math.random() * 10 + 9).
    toString().
    padStart(2, '0')}:30`,
    serviceType,
    serviceName: serviceNames[serviceType],
    providerName:
    providerNames[Math.floor(Math.random() * providerNames.length)],
    providerPhone: `+216 ${Math.floor(Math.random() * 80 + 20)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
    providerRating: 3.5 + Math.random() * 1.5,
    providerSpecialty: specialties[serviceType],
    address: `${Math.floor(Math.random() * 100 + 1)} Rue de ${cities[Math.floor(Math.random() * cities.length)]}`,
    city: patient.city,
    amount: Math.floor(Math.random() * 470) + 30,
    paymentMethod: ['card', 'cash', 'd17', 'flouci'][
    Math.floor(Math.random() * 4)] as
    'card' | 'cash' | 'd17' | 'flouci',
    status,
    cancellationReason:
    status === 'cancelled' ? 'Empêchement de dernière minute' : undefined,
    notes: Math.random() > 0.7 ? "Code d'accès: 1234" : undefined,
    rating:
    status === 'completed' && Math.random() > 0.3 ?
    Math.floor(Math.random() * 2) + 4 :
    undefined,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  };
});

export const mockProviderBookings: ProviderBooking[] = Array.from({
  length: 100
}).map((_, i) => {
  const provider =
  mockProviders[Math.floor(Math.random() * mockProviders.length)];
  const patientName =
  tunisianNames[Math.floor(Math.random() * tunisianNames.length)];
  const statuses = [
  'confirmed',
  'completed',
  'cancelled',
  'pending',
  'in_progress',
  'no_show'] as
  const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const amount = Math.floor(Math.random() * 470) + 30;
  const commission =
  provider.subscriptionPlan === 'commission' ? amount * 0.15 : 0;

  return {
    id: `pbook-${i + 1}`,
    providerId: provider.id,
    providerName: provider.name,
    patientName,
    patientPhone: `+216 ${Math.floor(Math.random() * 80 + 20)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
    patientCity: cities[Math.floor(Math.random() * cities.length)],
    date: new Date(Date.now() - Math.random() * 5000000000).
    toISOString().
    split('T')[0],
    time: `${Math.floor(Math.random() * 10 + 8).
    toString().
    padStart(2, '0')}:00`,
    endTime: `${Math.floor(Math.random() * 10 + 9).
    toString().
    padStart(2, '0')}:30`,
    serviceType: provider.serviceType,
    serviceName:
    serviceNames[provider.serviceType as keyof typeof serviceNames] ||
    'Service',
    address: `${Math.floor(Math.random() * 100 + 1)} Rue de ${cities[Math.floor(Math.random() * cities.length)]}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    amount,
    commission,
    netAmount: amount - commission,
    paymentMethod: ['card', 'cash', 'd17', 'flouci'][
    Math.floor(Math.random() * 4)] as
    'card' | 'cash' | 'd17' | 'flouci',
    status,
    cancellationReason:
    status === 'cancelled' ? 'Patient indisponible' : undefined,
    patientRating:
    status === 'completed' && Math.random() > 0.4 ?
    Math.floor(Math.random() * 2) + 4 :
    undefined,
    patientReview:
    status === 'completed' && Math.random() > 0.7 ?
    'Excellent service, très professionnel.' :
    undefined,
    notes:
    Math.random() > 0.8 ?
    'Patient nécessite une attention particulière' :
    undefined,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  };
});

export const mockTransactions: AdminTransaction[] = Array.from({
  length: 50
}).map((_, i) => {
  const amount = Math.floor(Math.random() * 500) + 50;
  const commission = amount * 0.15;
  return {
    id: `txn-${i + 1}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    patientName: `Patient ${Math.floor(Math.random() * 40) + 1}`,
    providerName: `Dr. Provider ${Math.floor(Math.random() * 30) + 1}`,
    serviceName: 'Home Care Visit',
    amount,
    commission,
    netAmount: amount - commission,
    paymentMethod: ['card', 'd17', 'cash'][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.1 ? 'completed' : 'pending',
    direction: 'in'
  };
});

export const mockSubscriptionTransactions: SubscriptionTransaction[] =
Array.from({
  length: 30
}).map((_, i) => {
  const isAnnual = Math.random() > 0.8;
  const amount = isAnnual ? 1490 : Math.random() > 0.5 ? 89 : 149;
  const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'];

  const randomMonth = months[Math.floor(Math.random() * months.length)];
  return {
    id: `sub-${i + 1}`,
    date: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    providerName: `Dr. Provider ${Math.floor(Math.random() * 30) + 1}`,
    providerService: ['nursing', 'physio', 'laboratory', 'pharmacy'][
    Math.floor(Math.random() * 4)],

    plan: isAnnual ? 'annuel' : 'mensuel',
    amount,
    period: `${randomMonth} 2026`,
    paymentMethod: ['card', 'bank_transfer', 'd17'][
    Math.floor(Math.random() * 3)],

    status:
    Math.random() > 0.1 ?
    'completed' :
    Math.random() > 0.5 ?
    'pending' :
    'failed'
  };
});

export const mockCommissionTransactions: CommissionTransaction[] = Array.from({
  length: 40
}).map((_, i) => {
  const grossAmount = Math.floor(Math.random() * 300) + 50;
  const commissionRate = 0.15;
  const commissionAmount = grossAmount * commissionRate;
  return {
    id: `com-${i + 1}`,
    date: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    providerName: `Dr. Provider ${Math.floor(Math.random() * 30) + 1}`,
    serviceName: [
    'Consultation',
    'Soins Infirmiers',
    'Prélèvement',
    'Séance Kiné'][
    Math.floor(Math.random() * 4)],
    grossAmount,
    commissionRate,
    commissionAmount,
    netAmount: grossAmount - commissionAmount,
    bookingRef: `BKG-${Math.floor(Math.random() * 10000).
    toString().
    padStart(4, '0')}`,
    status: Math.random() > 0.1 ? 'completed' : 'pending'
  };
});

// --- BI Reports Mock Data ---
export const mockMonthlyRevenue = [
{
  month: 'Jan',
  revenue: 125000,
  commissions: 18750,
  subscriptions: 4500,
  netProfit: 23250
},
{
  month: 'Fév',
  revenue: 132000,
  commissions: 19800,
  subscriptions: 4800,
  netProfit: 24600
},
{
  month: 'Mar',
  revenue: 145000,
  commissions: 21750,
  subscriptions: 5200,
  netProfit: 26950
},
{
  month: 'Avr',
  revenue: 158000,
  commissions: 23700,
  subscriptions: 5800,
  netProfit: 29500
},
{
  month: 'Mai',
  revenue: 165000,
  commissions: 24750,
  subscriptions: 6100,
  netProfit: 30850
},
{
  month: 'Juin',
  revenue: 182000,
  commissions: 27300,
  subscriptions: 6500,
  netProfit: 33800
},
{
  month: 'Juil',
  revenue: 195000,
  commissions: 29250,
  subscriptions: 7200,
  netProfit: 36450
},
{
  month: 'Août',
  revenue: 188000,
  commissions: 28200,
  subscriptions: 7000,
  netProfit: 35200
},
{
  month: 'Sep',
  revenue: 210000,
  commissions: 31500,
  subscriptions: 7800,
  netProfit: 39300
},
{
  month: 'Oct',
  revenue: 225000,
  commissions: 33750,
  subscriptions: 8500,
  netProfit: 42250
},
{
  month: 'Nov',
  revenue: 240000,
  commissions: 36000,
  subscriptions: 9200,
  netProfit: 45200
},
{
  month: 'Déc',
  revenue: 265000,
  commissions: 39750,
  subscriptions: 10500,
  netProfit: 50250
}];


export const mockServiceUtilization = [
{
  service: 'Soins Infirmiers',
  bookings: 4500,
  revenue: 315000,
  avgRating: 4.8,
  cancellationRate: 5.2
},
{
  service: 'Kinésithérapie',
  bookings: 3200,
  revenue: 256000,
  avgRating: 4.7,
  cancellationRate: 6.1
},
{
  service: 'Laboratoire',
  bookings: 2800,
  revenue: 196000,
  avgRating: 4.9,
  cancellationRate: 3.5
},
{
  service: 'Consultation',
  bookings: 5100,
  revenue: 408000,
  avgRating: 4.6,
  cancellationRate: 8.4
},
{
  service: 'Ambulance',
  bookings: 950,
  revenue: 142500,
  avgRating: 4.5,
  cancellationRate: 2.1
}];


export const mockInvestorKPIs = [
{
  metric: 'Gross Merchandise Value (GMV)',
  value: '2.8M TND',
  change: '+45%',
  trend: 'up'
},
{ metric: 'Take Rate Moyen', value: '16.5%', change: '+0.5%', trend: 'up' },
{
  metric: 'Customer Acquisition Cost (CAC)',
  value: '12.5 TND',
  change: '-15%',
  trend: 'down'
},
{
  metric: 'Lifetime Value (LTV)',
  value: '450 TND',
  change: '+22%',
  trend: 'up'
},
{
  metric: 'Monthly Active Users (MAU)',
  value: '12,500',
  change: '+35%',
  trend: 'up'
},
{
  metric: 'Burn Rate Mensuel',
  value: '45,000 TND',
  change: '-5%',
  trend: 'down'
}];


const auditLogTemplates = [
{
  user: 'leila.trabelsi@email.com',
  userRole: 'PATIENT' as const,
  category: 'Payment' as const,
  description: 'Processed appointment payment',
  resource: 'Transaction',
  severity: 'info' as const,
  ip: '197.15.45.123'
},
{
  user: 'dr.mansour@sanad.tn',
  userRole: 'PROVIDER' as const,
  category: 'GDPR' as const,
  description: 'Requested personal data export',
  resource: 'UserData',
  severity: 'warning' as const,
  ip: '197.15.45.123'
},
{
  user: 'system',
  userRole: 'SYSTEM' as const,
  category: 'Data' as const,
  description: 'Accessed patient record',
  resource: 'PatientProfile',
  severity: 'info' as const,
  ip: '192.168.1.1'
},
{
  user: 'ahmed.benali@email.com',
  userRole: 'PATIENT' as const,
  category: 'Data' as const,
  description: 'Accessed patient record',
  resource: 'PatientProfile',
  severity: 'info' as const,
  ip: '192.168.1.1'
},
{
  user: 'admin@sanad.tn',
  userRole: 'ADMIN' as const,
  category: 'GDPR' as const,
  description: 'Requested personal data export',
  resource: 'UserData',
  severity: 'warning' as const,
  ip: '102.156.22.11'
},
{
  user: 'system',
  userRole: 'SYSTEM' as const,
  category: 'Security' as const,
  description: 'API rate limit exceeded',
  resource: 'LoginAPI',
  severity: 'error' as const,
  ip: '102.156.22.11'
},
{
  user: 'ahmed.benali@email.com',
  userRole: 'PATIENT' as const,
  category: 'Auth' as const,
  description: 'User logged in successfully',
  resource: 'System',
  severity: 'info' as const,
  ip: '192.168.1.1'
},
{
  user: 'ahmed.benali@email.com',
  userRole: 'PATIENT' as const,
  category: 'GDPR' as const,
  description: 'Requested personal data export',
  resource: 'UserData',
  severity: 'warning' as const,
  ip: '197.15.45.123'
},
{
  user: 'leila.trabelsi@email.com',
  userRole: 'PATIENT' as const,
  category: 'GDPR' as const,
  description: 'Requested personal data export',
  resource: 'UserData',
  severity: 'warning' as const,
  ip: '192.168.1.1'
},
{
  user: 'system',
  userRole: 'SYSTEM' as const,
  category: 'Security' as const,
  description: 'Blocked malicious payload injection attempt',
  resource: 'ContactForm',
  severity: 'critical' as const,
  ip: '197.15.45.123'
},
{
  user: 'admin@sanad.tn',
  userRole: 'ADMIN' as const,
  category: 'Security' as const,
  description: 'Multiple failed logins from new IP',
  resource: 'AuthSystem',
  severity: 'critical' as const,
  ip: '192.168.1.1'
},
{
  user: 'ahmed.benali@email.com',
  userRole: 'PATIENT' as const,
  category: 'Security' as const,
  description: 'API rate limit exceeded',
  resource: 'LoginAPI',
  severity: 'error' as const,
  ip: '10.0.0.5'
},
{
  user: 'dr.fatma.khelifi@email.com',
  userRole: 'PROVIDER' as const,
  category: 'Auth' as const,
  description: 'Provider logged in successfully',
  resource: 'System',
  severity: 'info' as const,
  ip: '41.228.15.67'
},
{
  user: 'admin@sanad.tn',
  userRole: 'ADMIN' as const,
  category: 'System' as const,
  description: 'Updated commission rate settings',
  resource: 'AdminSettings',
  severity: 'info' as const,
  ip: '192.168.1.1'
},
{
  user: 'dr.karim.bouazizi@email.com',
  userRole: 'PROVIDER' as const,
  category: 'Data' as const,
  description: 'Updated provider profile information',
  resource: 'ProviderProfile',
  severity: 'info' as const,
  ip: '41.230.22.89'
},
{
  user: 'system',
  userRole: 'SYSTEM' as const,
  category: 'System' as const,
  description: 'Scheduled backup completed',
  resource: 'Database',
  severity: 'info' as const,
  ip: '10.0.0.1'
},
{
  user: 'admin@sanad.tn',
  userRole: 'ADMIN' as const,
  category: 'Auth' as const,
  description: 'Approved provider registration',
  resource: 'ProviderApproval',
  severity: 'info' as const,
  ip: '192.168.1.1'
},
{
  user: 'sonia.mejri@email.com',
  userRole: 'PATIENT' as const,
  category: 'Payment' as const,
  description: 'Payment refund processed',
  resource: 'Transaction',
  severity: 'warning' as const,
  ip: '197.15.45.200'
},
{
  user: 'system',
  userRole: 'SYSTEM' as const,
  category: 'Security' as const,
  description: 'Suspicious login attempt detected',
  resource: 'AuthSystem',
  severity: 'error' as const,
  ip: '185.220.101.45'
},
{
  user: 'dr.nabil.gharbi@email.com',
  userRole: 'PROVIDER' as const,
  category: 'Data' as const,
  description: 'Exported patient appointment history',
  resource: 'AppointmentData',
  severity: 'warning' as const,
  ip: '41.228.33.12'
}];


const baseTime = new Date();
baseTime.setHours(12, 14, 25, 0);

export const mockAuditLogs: AuditLog[] = auditLogTemplates.map((t, i) => {
  const ts = new Date(baseTime.getTime() - i * 300000 - Math.random() * 120000);
  return {
    id: `log-${i + 1}`,
    timestamp: ts.toISOString(),
    user: t.user,
    userRole: t.userRole,
    portal:
    t.userRole === 'ADMIN' ?
    'admin' as const :
    t.userRole === 'PROVIDER' ?
    'provider' as const :
    'patient' as const,
    actionType: t.category.toUpperCase(),
    category: t.category,
    entity: t.resource,
    resource: t.resource,
    description: t.description,
    ipAddress: t.ip,
    severity: t.severity
  };
});

export const mockSettings: AdminSettings = {
  features: {
    providerPortal: true,
    patientPortal: true,
    aiAnalysis: true,
    maintenanceMode: false
  },
  commissions: {
    defaultRate: 15,
    nursing: 12,
    physio: 15,
    laboratory: 10
  },
  transfers: {
    minAmount: 100
  },
  notifications: {
    email: true,
    sms: true
  },
  cancellations: {
    warningThreshold: 10,
    blockThreshold: 15,
    suspensionPeriodDays: 7
  },
  services: [
  {
    id: 'nursing',
    name: 'Soins Infirmiers',
    icon: '🩺',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'elderly',
    name: 'Aide aux Personnes Âgées',
    icon: '👴',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'physio',
    name: 'Kinésithérapie',
    icon: '💪',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: '🥗',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'laboratory',
    name: 'Laboratoire',
    icon: '🔬',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'radiology',
    name: 'Radiologie',
    icon: '📡',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'pharmacy',
    name: 'Pharmacie',
    icon: '💊',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    icon: '🚑',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'equipment',
    name: 'Équipement Médical',
    icon: '🏥',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'gym',
    name: 'Salle de Sport',
    icon: '🏋️',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'funeral',
    name: 'Services Funéraires',
    icon: '🕊️',
    providerPortal: true,
    patientPortal: false
  },
  {
    id: 'veterinary',
    name: 'Vétérinaire',
    icon: '🐾',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'maternity',
    name: 'Maternité',
    icon: '👶',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'night',
    name: 'Garde de Nuit',
    icon: '🌙',
    providerPortal: true,
    patientPortal: true
  },
  {
    id: 'psychology',
    name: 'Psychologie',
    icon: '🧠',
    providerPortal: false,
    patientPortal: false
  },
  {
    id: 'babysitting',
    name: 'Baby-sitting',
    icon: '👶',
    providerPortal: false,
    patientPortal: true
  }]

};