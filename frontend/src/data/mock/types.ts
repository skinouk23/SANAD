/**
 * Mock-Only Types
 * Types consumed exclusively by mock generators (src/data/mock/generators.ts)
 * and MSW handlers (src/mocks/handlers/). NOT Zod API schemas.
 *
 * These are verbatim copies from types/index.ts, co-located here so that
 * the central types barrel (src/types/index.ts) can be deleted.
 */

import type { ServiceType } from '@/data/services.types';
import type { Location } from '@/shared/schemas/geo';
import type { UserRole, UserStatus, UserSegment } from '@/shared/schemas/common';

// ============================================
// USER & FAMILY TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  countryCode?: string;
  city?: string;
  address?: string;
  status?: UserStatus;
  segment?: UserSegment;
  lastActiveAt?: string;
  metadata?: Record<string, unknown>;
  specialty?: string;
  createdAt: string;
  updatedAt: string;
}

export type FamilyRelation =
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister'
  | 'parent'
  | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relation: FamilyRelation;
  avatar?: string;
  color: string;
  inviteStatus: 'pending' | 'accepted' | 'declined';
}

// ============================================
// PATIENT TYPES
// ============================================

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
  };
  familyCircle?: FamilyMember[];
  stats?: PatientStats;
}

export interface PatientStats {
  totalAppointments: number;
  totalSpent: number;
  streakDays: number;
  lastAppointmentDate?: string;
  upcomingAppointments: number;
}

// ============================================
// PROVIDER SUB-TYPES
// ============================================

export type ProviderStatus = 'active' | 'pending' | 'suspended' | 'rejected';
export type SubscriptionPlan = 'commission' | 'standard' | 'elite';

export type ProviderBadge = 'verified' | 'experienced' | 'rated' | 'premium' | 'new';

export type ProviderType =
  | 'nurse'
  | 'physiotherapist'
  | 'doctor'
  | 'laboratory'
  | 'radiology'
  | 'pharmacy'
  | 'ambulance'
  | 'equipment'
  | 'nutritionist'
  | 'funeral'
  | 'gym';

export interface PricingTier {
  serviceId: string;
  serviceName: string;
  price: number;
  currency: string;
  unit: 'session' | 'hour' | 'day' | 'visit';
}

export interface ProviderService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
}

export interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  enabled: boolean;
  slots: { start: string; end: string }[];
}

export interface ProviderStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  pendingRevenue: number;
  averageRating: number;
  responseRate: number;
  completionRate: number;
}

// ============================================
// APPOINTMENT TYPES
// ============================================

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';
export type AppointmentType = 'home' | 'video' | 'clinic';

export interface AppointmentFilters {
  status?: AppointmentStatus;
  serviceType?: ServiceType;
  dateFrom?: string;
  dateTo?: string;
  providerId?: string;
  patientId?: string;
  page?: number;
  limit?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  serviceType: ServiceType;
  serviceName: string;
  subService?: string;
  date: string;
  time: string;
  endTime?: string;
  duration: number;
  status: AppointmentStatus;
  type: AppointmentType;
  location: Location;
  price: number;
  currency: string;
  commission?: number;
  netAmount?: number;
  notes?: string;
  rating?: number;
  review?: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'cash' | 'd17' | 'flouci' | 'bank_transfer';
export type TransactionType =
  | 'payment'
  | 'refund'
  | 'payout'
  | 'commission'
  | 'subscription'
  | 'deposit'
  | 'deduction';

export interface TransactionFilters {
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  providerId?: string;
  patientId?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

export interface Transaction {
  id: string;
  type?: TransactionType;
  appointmentId?: string;
  patientId?: string;
  patientName?: string;
  providerId?: string;
  providerName?: string;
  patient?: Patient;
  provider?: Provider;
  serviceName?: string;
  amount: number;
  commission?: number;
  netAmount?: number;
  currency?: string;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  description?: string;
  metadata?: Record<string, unknown>;
  date?: string;
  createdAt?: string;
  processedAt?: string;
  failureReason?: string;
  countryCode?: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = 'appointment' | 'health' | 'reminder' | 'payment' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  icon?: string;
  color?: string;
}

// ============================================
// SYSTEM HEALTH (legacy plain interface)
// ============================================

export interface SystemHealth {
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  activeUsers: number;
  services: ServiceHealth[];
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTime: number;
  lastError?: string;
}

// ============================================
// CONVERSATION PARTICIPANT
// ============================================

export interface ConversationParticipant {
  userId: string;
  user?: User;
  role: 'patient' | 'provider';
  joinedAt: string;
}

// ============================================
// TICKET MESSAGE (legacy plain interface)
// ============================================

export interface TicketMessage {
  id: string;
  senderId: string;
  sender?: User;
  content: string;
  attachments?: string[];
  createdAt: string;
}

// ============================================
// REVIEW
// ============================================

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ============================================
// CONVERSATION / MESSAGE TYPES
// ============================================

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: UserRole;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  name: string;
  size: number;
}

// ============================================
// PROVIDER (temporary — T03 removes when adapter deleted)
// ============================================

export interface Provider {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  role?: UserRole;
  serviceType?: ServiceType;
  providerType?: ProviderType;
  specialties: string[];
  rating: number;
  reviewCount: number;
  verified?: boolean;
  available: boolean;
  location?: Location;
  pricing?: PricingTier[];
  subscriptionPlan?: SubscriptionPlan;
  status?: ProviderStatus;
  experience?: number;
  bio?: string;
  imageUrl?: string;
  avatar?: string;
  badges?: ProviderBadge[];
  countryCode?: string;
  licenseNumber?: string;
  licenseVerified?: boolean;
  workingHours?: WorkingHours;
  specialty?: string;
  lastActiveAt?: string;
  services?: ProviderService[];
  stats?: ProviderStats;
  subscriptionTier?: 'basic' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface ProviderFilters {
  serviceType?: ServiceType;
  city?: string;
  minRating?: number;
  maxPrice?: number;
  available?: boolean;
  verified?: boolean;
  sortBy?: 'rating' | 'price' | 'distance' | 'reviews';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
