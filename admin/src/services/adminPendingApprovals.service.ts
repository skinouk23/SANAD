import { api } from '../api/client';
import type {
  ApprovePendingProviderPayload,
  PendingApprovalDocumentDownload,
  PendingApprovalListFilters,
  PendingApprovalListResponse,
  PendingApprovalSummary,
  RejectPendingProviderPayload
} from '../types/admin-pending-approvals.types';

export async function getPendingProviderApprovals(
  filters: PendingApprovalListFilters
): Promise<PendingApprovalListResponse> {
  return api.get<PendingApprovalListResponse>('/admin/provider-approvals', {
    params: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search || undefined,
      sortBy: filters.sortBy || undefined,
      sortDesc: filters.sortDesc ?? undefined
    }
  });
}

export async function getPendingProviderApprovalsSummary(): Promise<PendingApprovalSummary> {
  return api.get<PendingApprovalSummary>('/admin/provider-approvals/summary');
}

export async function getPendingProviderDocumentDownloadUrl(
  providerId: string,
  documentId: string
): Promise<PendingApprovalDocumentDownload> {
  return api.get<PendingApprovalDocumentDownload>(
    `/admin/provider-approvals/${providerId}/documents/${documentId}/download-url`
  );
}

export async function approvePendingProvider(
  providerId: string,
  payload: ApprovePendingProviderPayload
): Promise<void> {
  await api.post(`/admin/provider-approvals/${providerId}/approve`, payload);
}

export async function rejectPendingProvider(
  providerId: string,
  payload: RejectPendingProviderPayload
): Promise<void> {
  await api.post(`/admin/provider-approvals/${providerId}/reject`, payload);
}

export const adminPendingApprovalsService = {
  getPendingProviderApprovals,
  getPendingProviderApprovalsSummary,
  getPendingProviderDocumentDownloadUrl,
  approvePendingProvider,
  rejectPendingProvider
};
