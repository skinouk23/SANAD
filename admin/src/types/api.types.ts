/**
 * API Types
 * Comprehensive type definitions for all API entities
 */

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'patient' | 'provider' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserSegment =
'vip' |
'active' |
'occasional' |
'inactive' |
'at_risk';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  segment?: UserSegment;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
  metadata?: Record<string, any>;
  // Additional fields for provider display
  specialty?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  address?: string;
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

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relationship: string;
  accessLevel: 'full' | 'limited' | 'emergency_only';
  addedAt: string;
}

export interface Provider extends User {
  role: 'provider';
  providerType: ProviderType;
  specialties: string[];
  licenseNumber: string;
  licenseVerified: boolean;
  rating: number;
  reviewCount: number;
  available: boolean;
  location?: {
    address: string;
    city: string;
    coordinates?: {lat: number;lng: number;};
  };
  workingHours?: WorkingHours;
  services: ProviderService[];
  stats?: ProviderStats;
  subscriptionTier?: 'basic' | 'pro' | 'enterprise';
}

export type ProviderType =
'nurse' |
'physiotherapist' |
'doctor' |
'laboratory' |
'radiology' |
'pharmacy' |
'ambulance' |
'equipment' |
'nutritionist' |
'funeral' |
'gym';

export interface ProviderService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
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
  slots: {start: string;end: string;}[];
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
'pending' |
'confirmed' |
'in_progress' |
'completed' |
'cancelled' |
'no_show';

export type AppointmentType = 'home' | 'video' | 'clinic';

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  patient?: Patient;
  provider?: Provider;
  serviceId: string;
  serviceName: string;
  // Service object for convenience
  service?: {
    id: string;
    name: string;
    price?: number;
    duration?: number;
  };
  status: AppointmentStatus;
  type?: AppointmentType;
  scheduledAt: string;
  duration: number;
  price: number;
  totalPrice?: number;
  address?: string;
  notes?: string;
  validationCode?: string;
  validatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export type TransactionStatus =
'pending' |
'processing' |
'completed' |
'failed' |
'refunded';
export type TransactionType =
'payment' |
'refund' |
'payout' |
'commission' |
'subscription' |
'deposit' |
'deduction';
export type PaymentMethod = 'card' | 'd17' | 'cash' | 'bank_transfer' | 'wallet';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  commission?: number;
  netAmount?: number;
  paymentMethod?: PaymentMethod;
  appointmentId?: string;
  patientId?: string;
  providerId?: string;
  patient?: Patient;
  provider?: Provider;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  userId: string;
  user?: User;
  role: 'patient' | 'provider';
  joinedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  read: boolean;
  readAt?: string;
  createdAt: string;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisWeek: number;
    newThisMonth: number;
    byRole: Record<UserRole, number>;
    bySegment: Record<UserSegment, number>;
  };
  appointments: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    todayCount: number;
    weekCount: number;
  };
  revenue: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    commissions: number;
  };
  providers: {
    total: number;
    active: number;
    pendingApproval: number;
    suspended: number;
  };
}

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

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  type:
  'suspicious_login' |
  'unusual_activity' |
  'payment_fraud' |
  'account_takeover';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  userId?: string;
  user?: User;
  description: string;
  details?: Record<string, any>;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  user?: User;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'complaint' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  assignedTo?: string;
  assignee?: User;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  sender?: User;
  content: string;
  attachments?: string[];
  createdAt: string;
}

// ============================================
// EQUIPMENT TYPES
// ============================================

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  model?: string;
  images: string[];
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  deposit: number;
  available: boolean;
  quantity: number;
  availableQuantity: number;
  specifications?: Record<string, string>;
  providerId: string;
  provider?: Provider;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipment?: Equipment;
  patientId: string;
  patient?: Patient;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'message' | 'payment' | 'system' | 'promotion';
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}