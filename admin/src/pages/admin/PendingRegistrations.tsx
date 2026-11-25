import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  BrainCircuit,
  ExternalLink,
  Loader2,
  RefreshCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/admin/shared/StatusBadge';
import { Modal } from '../../components/admin/shared/Modal';
import {
  approvePendingProvider,
  getPendingProviderApprovals,
  getPendingProviderDocumentDownloadUrl,
  rejectPendingProvider
} from '../../services/adminPendingApprovals.service';
import { useAdminPendingApprovals } from '../../contexts/AdminPendingApprovalsContext';
import type { PendingApprovalItem } from '../../types/admin-pending-approvals.types';

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR');
}

function getScoreColor(score?: number | null): string {
  if ((score ?? 0) > 80) {
    return 'text-emerald-600';
  }

  if ((score ?? 0) > 60) {
    return 'text-amber-600';
  }

  return 'text-red-600';
}

export function PendingRegistrations() {
  const { refreshPendingApprovalsCount } = useAdminPendingApprovals();
  const [pendingProviders, setPendingProviders] = useState<PendingApprovalItem[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<PendingApprovalItem | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null);

  const loadPendingProviders = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getPendingProviderApprovals({
        page,
        limit: itemsPerPage,
        sortBy: 'appliedAt',
        sortDesc: true
      });

      if (response.pagination.totalPages > 0 && page > response.pagination.totalPages) {
        setPage(response.pagination.totalPages);
        return;
      }

      setPendingProviders(response.items);
      setTotalPages(Math.max(1, response.pagination.totalPages || 1));
      setTotalItems(response.pagination.total);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load pending approvals.'
      );
      setPendingProviders([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage, page]);

  useEffect(() => {
    void loadPendingProviders();
  }, [loadPendingProviders]);

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setPage(1);
  };

  const closeApproveModal = () => {
    setIsApproveModalOpen(false);
    setSelectedProvider(null);
    setApprovalNotes('');
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedProvider(null);
    setRejectReason('');
  };

  const handleApprove = async () => {
    if (!selectedProvider) {
      return;
    }

    setIsSubmitting(true);
    try {
      await approvePendingProvider(selectedProvider.id, {
        approvalNotes: approvalNotes.trim() || undefined,
        notifyProvider: true,
        expectedVersion: selectedProvider.versionToken
      });
      closeApproveModal();
      await loadPendingProviders();
      await refreshPendingApprovalsCount();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to approve this registration.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProvider || !rejectReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await rejectPendingProvider(selectedProvider.id, {
        reason: rejectReason.trim(),
        notifyProvider: true,
        expectedVersion: selectedProvider.versionToken
      });
      closeRejectModal();
      await loadPendingProviders();
      await refreshPendingApprovalsCount();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to reject this registration.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDocument = async (providerId: string, documentId: string) => {
    setDownloadingDocumentId(documentId);

    try {
      const response = await getPendingProviderDocumentDownloadUrl(providerId, documentId);
      window.open(response.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'Unable to open this document.'
      );
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pending Registrations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review and approve new professional accounts
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-sm">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {totalItems} pending registration{totalItems > 1 ? 's' : ''} awaiting review.
        </div>
        <button
          onClick={() => void loadPendingProviders()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : pendingProviders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              All caught up!
            </h3>
            <p className="text-slate-500">
              There are no pending registrations to review.
            </p>
          </div>
        ) : (
          pendingProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {provider.displayName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {provider.email} {provider.phone ? `• ${provider.phone}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={provider.status} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Service:</span>{' '}
                    <span className="font-medium capitalize">
                      {provider.serviceType}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">City:</span>{' '}
                    <span className="font-medium">{provider.city || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Applied:</span>{' '}
                    <span className="font-medium">
                      {formatDate(provider.appliedAt)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Documents Submitted
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => void openDocument(provider.id, doc.id)}
                        disabled={downloadingDocumentId === doc.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {doc.type}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    AI Analysis Results
                  </h4>
                </div>

                {provider.analysis.available ? (
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        Overall Score
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(provider.analysis.overallScore)}`}>
                        {provider.analysis.overallScore ?? 'N/A'}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Fraud Risk</span>
                      <StatusBadge
                        status={provider.analysis.fraudRisk || 'unknown'}
                        className="text-[10px] px-1.5 py-0"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        Doc Authenticity
                      </span>
                      <span className="text-sm font-medium">
                        {provider.analysis.documentAuthenticity == null
                          ? 'N/A'
                          : `${provider.analysis.documentAuthenticity}%`}
                      </span>
                    </div>
                    {provider.analysis.recommendation ? (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Recommendation</span>
                        <StatusBadge
                          status={provider.analysis.recommendation}
                          className="text-[10px] px-1.5 py-0"
                        />
                      </div>
                    ) : null}

                    {provider.analysis.flags.length > 0 ? (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span className="text-xs font-medium text-red-800 dark:text-red-400">
                            Flags Detected
                          </span>
                        </div>
                        <ul className="text-[10px] text-red-700 dark:text-red-300 list-disc pl-4">
                          {provider.analysis.flags.map((flag, index) => (
                            <li key={index}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-500 italic text-center">
                    Provider opted out of AI analysis or analysis is not yet available.
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProvider(provider);
                      setApprovalNotes('');
                      setIsApproveModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProvider(provider);
                      setRejectReason('');
                      setIsRejectModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-red-600 text-xs font-medium rounded border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && pendingProviders.length > 0 ? (
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Afficher</span>
            <select
              value={itemsPerPage}
              onChange={(event) => handleItemsPerPageChange(Number(event.target.value))}
              className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>par page</span>
            <span className="text-slate-400 dark:text-slate-500 ml-2">
              ({totalItems} demandes au total)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              1
            </button>
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-sm font-medium text-slate-900 dark:text-white bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800/50 rounded-md">
              {page} / {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
              className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {totalPages || 1}
            </button>
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={isApproveModalOpen}
        onClose={closeApproveModal}
        title="Approuver l'Inscription"
        footer={
          <>
            <button
              onClick={closeApproveModal}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={() => void handleApprove()}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-60"
            >
              {isSubmitting ? 'Processing...' : "Confirmer l'Approbation"}
            </button>
          </>
        }
      >
        {selectedProvider ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Confirmer l'approbation
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                  Vous êtes sur le point d'approuver l'inscription de{' '}
                  <span className="font-bold">{selectedProvider.displayName}</span>. Le
                  professionnel sera notifié et pourra commencer à recevoir des réservations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-teal-300">
                {selectedProvider.displayName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedProvider.displayName}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {selectedProvider.serviceType} • {selectedProvider.city || 'N/A'} •{' '}
                  {selectedProvider.email}
                </p>
              </div>
            </div>
            {selectedProvider.analysis.available ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 uppercase mb-0.5">
                    Score AI
                  </p>
                  <p className={`text-sm font-bold ${getScoreColor(selectedProvider.analysis.overallScore)}`}>
                    {selectedProvider.analysis.overallScore ?? 'N/A'}/100
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 uppercase mb-0.5">
                    Risque Fraude
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedProvider.analysis.fraudRisk || 'N/A'}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 uppercase mb-0.5">
                    Auth. Documents
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedProvider.analysis.documentAuthenticity == null
                      ? 'N/A'
                      : `${selectedProvider.analysis.documentAuthenticity}%`}
                  </p>
                </div>
              </div>
            ) : null}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes d'approbation (Optionnel)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(event) => setApprovalNotes(event.target.value)}
                className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                rows={2}
                placeholder="Notes internes sur cette approbation..."
              />
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        title="Reject Registration"
        footer={
          <>
            <button
              onClick={closeRejectModal}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleReject()}
              disabled={!rejectReason.trim() || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You are about to reject the registration for{' '}
            <span className="font-semibold">{selectedProvider?.displayName}</span>.
            Please provide a reason which will be sent to the applicant.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Rejection Reason
            </label>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
              placeholder="e.g. Invalid medical license, incomplete documentation..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
