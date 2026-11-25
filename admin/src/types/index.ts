/**
 * Central type definitions for Care@Home Tunisia
 * All TypeScript interfaces and types for the application
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = 'patient' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  countryCode: string;
  city?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  role: UserRole;
  serviceType?: string;
}

// ============================================
// PROVIDER TYPES
// ============================================

export type ProviderStatus = 'active' | 'pending' | 'suspended' | 'rejected';
export type SubscriptionPlan = 'commission' | 'standard' | 'elite';

export interface Provider {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  specialties: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  available: boolean;
  location: Location;
  pricing: PricingTier[];
  subscriptionPlan: SubscriptionPlan;
  status: ProviderStatus;
  experience: number; // years
  bio?: string;
  imageUrl?: string;
  badges: ProviderBadge[];
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}

export type ProviderBadge =
'verified' |
'experienced' |
'rated' |
'premium' |
'new';

export interface PricingTier {
  serviceId: string;
  serviceName: string;
  price: number;
  currency: string;
  unit: 'session' | 'hour' | 'day' | 'visit';
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

// ============================================
// SERVICE TYPES
// ============================================

export type ServiceType =
'nursing' |
'elderly' |
'physio' |
'maternity' |
'checkup' |
'night' |
'ambulance' |
'doctor-home' |
'chronic-care' |
'medical-companion' |
'babysitting' |
'nutrition' |
'psychology' |
'laboratory' |
'radiology' |
'pharmacy' |
'gym' |
'funeral' |
'veterinary';

export type ServiceCategory =
'medical' |
'daily' |
'rehabilitation' |
'wellness';

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  maxPrice?: number;
  currency: string;
  priceUnit: string;
  icon: string;
  gradient: string;
  badge?: string;
  popular?: boolean;
  recurring?: boolean;
  countryCode: string;
}

export interface SubService {
  id: string;
  parentServiceType: ServiceType;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration?: number; // minutes
}

// ============================================
// EQUIPMENT TYPES
// ============================================

export type EquipmentCategory =
'mobility' |
'respiratory' |
'bed' |
'monitoring' |
'other';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  categoryLabel: string;
  description: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  deposit: number;
  currency: string;
  available: boolean;
  providerId: string;
  providerName: string;
  providerType: 'parapharmacie' | 'agence';
  location: Location;
  specifications: Specification[];
  features: string[];
  imageUrl?: string;
  gradient: string;
  countryCode: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface EquipmentFilters {
  category?: EquipmentCategory;
  providerId?: string;
  city?: string;
  available?: boolean;
  maxPricePerDay?: number;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface EquipmentProvider {
  id: string;
  name: string;
  type: 'parapharmacie' | 'agence';
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  countryCode: string;
}

// ============================================
// APPOINTMENT TYPES
// ============================================

export type AppointmentStatus =
'pending' |
'confirmed' |
'in-progress' |
'completed' |
'cancelled' |
'rejected';
export type AppointmentType = 'home' | 'video' | 'clinic';

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
  duration: number; // minutes
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

// ============================================
// TRANSACTION TYPES
// ============================================

export type TransactionStatus =
'pending' |
'processing' |
'completed' |
'failed' |
'refunded';
export type PaymentMethod = 'card' | 'cash' | 'd17' | 'flouci' | 'bank_transfer';

export interface Transaction {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  amount: number;
  commission: number;
  netAmount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  date: string;
  countryCode: string;
}

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

// ============================================
// LOCATION TYPES
// ============================================

export interface Location {
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Region {
  id: string;
  name: string;
  countryCode: string;
}

// ============================================
// COUNTRY & CURRENCY TYPES
// ============================================

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: CurrencyCode;
  locale: string;
  phonePrefix: string;
  regions: Region[];
}

export type CurrencyCode =
'TND' |
'MAD' |
'DZD' |
'EGP' |
'SAR' |
'AED' |
'EUR' |
'GBP' |
'USD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  pagination?: Pagination;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
  statusCode: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType =
'appointment' |
'health' |
'reminder' |
'payment' |
'system';

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
// MESSAGE TYPES
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
// REVIEW TYPES
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
// FAMILY CIRCLE TYPES
// ============================================

export type FamilyRelation =
'spouse' |
'son' |
'daughter' |
'brother' |
'sister' |
'parent' |
'other';

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
// FORM TYPES
// ============================================

export interface FormField {
  name: string;
  label: string;
  type:
  'text' |
  'email' |
  'password' |
  'tel' |
  'select' |
  'textarea' |
  'checkbox' |
  'radio' |
  'date' |
  'time' |
  'file';
  placeholder?: string;
  required?: boolean;
  options?: {value: string;label: string;}[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant =
'default' |
'success' |
'warning' |
'error' |
'info' |
'teal' |
'gray';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';