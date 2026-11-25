export interface PendingApprovalDocument {
  id: string;
  type: string;
  name: string;
  verified: boolean;
  uploadedAt: string;
  expiryDate?: string | null;
}

export interface PendingApprovalAnalysis {
  available: boolean;
  overallScore?: number | null;
  fraudRisk?: string | null;
  documentAuthenticity?: number | null;
  recommendation?: string | null;
  flags: string[];
  generatedAt?: string | null;
  requiresReview: boolean;
}

export interface PendingApprovalItem {
  id: string;
  displayName: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  city?: string | null;
  appliedAt: string;
  status: 'pending';
  versionToken: string;
  documents: PendingApprovalDocument[];
  analysis: PendingApprovalAnalysis;
}

export interface PendingApprovalListFilters {
  page: number;
  limit: number;
  search?: string;
  sortBy?: 'appliedAt' | 'name' | 'city' | 'score' | 'riskLevel';
  sortDesc?: boolean;
}

export interface PendingApprovalListResponse {
  items: PendingApprovalItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PendingApprovalSummary {
  pendingCount: number;
}

export interface PendingApprovalDocumentDownload {
  documentId: string;
  fileName: string;
  mimeType: string;
  downloadUrl: string;
  expiresAt: string;
}

export interface ApprovePendingProviderPayload {
  approvalNotes?: string;
  notifyProvider?: boolean;
  expectedVersion?: string;
}

export interface RejectPendingProviderPayload {
  reason: string;
  notifyProvider?: boolean;
  expectedVersion?: string;
}
