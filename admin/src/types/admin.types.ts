export type AdminProviderStatus =
'active' |
'pending' |
'suspended' |
'rejected' |
'warning' |
'blocked';

export interface AdminProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  city: string;
  rating: number;
  status: AdminProviderStatus;
  subscriptionPlan: 'commission' | 'standard' | 'elite';
  joinedDate: string;
  bookingsCount: number;
  revenueGenerated: number;
  cancellationRate: number;
  totalCancellations: number;
  walletBalance?: number;
  pendingPayouts?: number;
  minTransferAmount?: number;
  documents: AdminDocument[];
  aiAnalysis?: AIAnalysisResult;
}

export interface AdminPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bookingsCount: number;
  totalSpent: number;
  status: 'active' | 'suspended';
  joinedDate: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodType: string;
  address: string;
  preferredLanguage: 'fr' | 'ar' | 'en';
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies: string[];
  chronicConditions: string[];
  lastActivityDate: string;
  lastBookingDate?: string;
  cancellationRate: number;
  totalCancellations: number;
  averageRating: number;
  notes?: string;
}

export interface PatientReservation {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  endTime: string;
  serviceType: string;
  serviceName: string;
  providerName: string;
  providerPhone: string;
  providerRating: number;
  providerSpecialty: string;
  address: string;
  city: string;
  amount: number;
  paymentMethod: 'card' | 'cash' | 'd17' | 'flouci';
  status:
  'confirmed' |
  'completed' |
  'cancelled' |
  'pending' |
  'in_progress' |
  'no_show';
  cancellationReason?: string;
  notes?: string;
  rating?: number;
  createdAt: string;
}

export interface ProviderBooking {
  id: string;
  providerId: string;
  providerName: string;
  patientName: string;
  patientPhone: string;
  patientCity: string;
  date: string;
  time: string;
  endTime: string;
  serviceType: string;
  serviceName: string;
  address: string;
  city: string;
  amount: number;
  commission: number;
  netAmount: number;
  paymentMethod: 'card' | 'cash' | 'd17' | 'flouci';
  status:
  'confirmed' |
  'completed' |
  'cancelled' |
  'pending' |
  'in_progress' |
  'no_show';
  cancellationReason?: string;
  patientRating?: number;
  patientReview?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminDocument {
  id: string;
  type: string;
  url: string;
  verified: boolean;
  uploadedAt: string;
}

export interface AIAnalysisResult {
  score: number;
  fraudRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  documentAuthenticity: number;
  recommendation: 'approve' | 'review' | 'reject';
  flags: string[];
}

export interface AdminTransaction {
  id: string;
  date: string;
  patientName: string;
  providerName: string;
  serviceName: string;
  amount: number;
  commission: number;
  netAmount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  direction: 'in' | 'out';
  bookingReference?: string;
  paymentReference?: string;
}

export interface SubscriptionTransaction {
  id: string;
  date: string;
  providerName: string;
  providerService: string;
  plan: 'mensuel' | 'annuel';
  amount: number;
  period?: string;
  periodStart?: string;
  periodEnd?: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface CommissionTransaction {
  id: string;
  date: string;
  providerName: string;
  serviceName: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  bookingRef: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface AdminTransactionsOverview {
  payments: AdminTransaction[];
  subscriptions: SubscriptionTransaction[];
  commissions: CommissionTransaction[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: 'PATIENT' | 'PROVIDER' | 'ADMIN' | 'SYSTEM';
  portal: 'admin' | 'provider' | 'patient';
  actionType: string;
  category: 'Payment' | 'GDPR' | 'Data' | 'Auth' | 'Security' | 'System';
  entity: string;
  resource: string;
  description: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface AdminSettings {
  features: {
    providerPortal: boolean;
    patientPortal: boolean;
    aiAnalysis: boolean;
    maintenanceMode: boolean;
  };
  commissions: {
    defaultRate: number;
    nursing: number;
    physio: number;
    laboratory: number;
  };
  transfers: {
    minAmount: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
  };
  services: ServiceAvailability[];
  cancellations: {
    warningThreshold: number;
    blockThreshold: number;
    suspensionPeriodDays: number;
  };
}

export interface ServiceAvailability {
  id: string;
  name: string;
  icon: string;
  providerPortal: boolean;
  patientPortal: boolean;
}
