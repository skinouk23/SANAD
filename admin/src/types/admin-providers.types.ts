export type AdminProviderStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'blocked'
  | 'rejected';

export interface AdminProviderDocument {
  id: string;
  documentType: string;
  documentName?: string | null;
  documentUrl: string;
  isVerified: boolean;
  isExpired: boolean;
  expiryDate?: string | null;
  createdAt: string;
  verifiedAt?: string | null;
}

export interface AdminProviderRow {
  id: string;
  displayName: string;
  businessName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  serviceCategory: string;
  city?: string | null;
  ratingAverage: number;
  ratingCount: number;
  status: AdminProviderStatus;
  subscriptionTier: string;
  isApproved: boolean;
  isVerified: boolean;
  isAvailable: boolean;
  totalBookings: number;
  totalRevenue: number;
  cancellationRate: number;
  createdAt: string;
}

export interface AdminProviderDetail extends AdminProviderRow {
  bio?: string | null;
  shortDescription?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;
  countryCode: string;
  availableBalance: number;
  documents: AdminProviderDocument[];
}

export interface AdminProviderUpdatePayload {
  businessName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  shortDescription?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface AdminProviderListFilters {
  page: number;
  limit: number;
  search?: string;
  serviceCategory?: string;
  status?: AdminProviderStatus;
  city?: string;
  sortBy?: 'created' | 'name' | 'city' | 'rating' | 'bookings';
  sortDesc?: boolean;
}

export interface AdminProviderListResult {
  items: AdminProviderRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminProviderCategoryOption {
  code: string;
  label: string;
  group?: string;
}

export type AdminProviderStatusAction =
  | 'approve'
  | 'suspend'
  | 'unsuspend'
  | 'block'
  | 'unblock'
  | 'reject';
