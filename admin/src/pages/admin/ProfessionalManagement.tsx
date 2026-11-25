import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Edit,
  Eye,
  Loader2,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { StatusBadge } from '../../components/admin/shared/StatusBadge';
import { DetailDrawer } from '../../components/admin/shared/DetailDrawer';
import { Modal } from '../../components/admin/shared/Modal';
import {
  adminProvidersService,
  deleteAdminProvider,
  getAdminProviderById,
  getAdminProviders,
  updateAdminProvider,
  updateAdminProviderStatus
} from '../../services/adminProviders.service';
import type {
  AdminProviderCategoryOption,
  AdminProviderDetail,
  AdminProviderListFilters,
  AdminProviderRow,
  AdminProviderStatus,
  AdminProviderStatusAction,
  AdminProviderUpdatePayload
} from '../../types/admin-providers.types';

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{label: string;value: AdminProviderStatus;}> = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Rejected', value: 'rejected' }
];

const SORT_OPTIONS: Array<{label: string;value: NonNullable<AdminProviderListFilters['sortBy']>}> = [
  { label: 'Newest', value: 'created' },
  { label: 'Name', value: 'name' },
  { label: 'City', value: 'city' },
  { label: 'Rating', value: 'rating' },
  { label: 'Bookings', value: 'bookings' }
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR');
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString()} TND`;
}

function buildEditForm(provider: AdminProviderDetail): AdminProviderUpdatePayload {
  return {
    businessName: provider.businessName || '',
    firstName: provider.firstName || '',
    lastName: provider.lastName || '',
    bio: provider.bio || '',
    shortDescription: provider.shortDescription || '',
    addressLine1: provider.addressLine1 || '',
    addressLine2: provider.addressLine2 || '',
    city: provider.city || '',
    stateProvince: provider.stateProvince || '',
    postalCode: provider.postalCode || '',
    countryCode: provider.countryCode || 'TN'
  };
}

function getStatusActions(status: AdminProviderStatus): Array<{
  label: string;
  value: AdminProviderStatusAction;
}> {
  switch (status) {
    case 'pending':
      return [
        { label: 'Approve', value: 'approve' },
        { label: 'Reject', value: 'reject' },
        { label: 'Block', value: 'block' }
      ];
    case 'active':
      return [
        { label: 'Suspend', value: 'suspend' },
        { label: 'Block', value: 'block' }
      ];
    case 'suspended':
      return [
        { label: 'Unsuspend', value: 'unsuspend' },
        { label: 'Block', value: 'block' }
      ];
    case 'blocked':
      return [
        { label: 'Unblock', value: 'unblock' },
        { label: 'Approve', value: 'approve' }
      ];
    case 'rejected':
      return [
        { label: 'Approve', value: 'approve' }
      ];
    default:
      return [];
  }
}

function getDefaultStatusAction(status: AdminProviderStatus): AdminProviderStatusAction {
  return getStatusActions(status)[0]?.value || 'approve';
}

export function ProfessionalManagement() {
  const [providers, setProviders] = useState<AdminProviderRow[]>([]);
  const [categories, setCategories] = useState<AdminProviderCategoryOption[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminProviderStatus | ''>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState<NonNullable<AdminProviderListFilters['sortBy']>>('created');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AdminProviderDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProviderDetail | null>(null);
  const [editForm, setEditForm] = useState<AdminProviderUpdatePayload>({});
  const [statusTarget, setStatusTarget] = useState<AdminProviderRow | null>(null);
  const [statusAction, setStatusAction] = useState<AdminProviderStatusAction>('approve');
  const [statusReason, setStatusReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminProviderRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadProviders = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getAdminProviders({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        serviceCategory: serviceCategoryFilter || undefined,
        status: statusFilter || undefined,
        city: cityFilter || undefined,
        sortBy,
        sortDesc
      });

      setProviders(response.items);
      setTotalPages(Math.max(1, response.pagination.totalPages || 1));
      setTotalItems(response.pagination.total);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load providers.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, serviceCategoryFilter, statusFilter, cityFilter, sortBy, sortDesc]);

  const loadCategories = useCallback(async () => {
    const response = await adminProvidersService.getAdminProviderCategories();
    setCategories(response);
  }, []);

  const openProviderDetail = useCallback(async (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsDetailLoading(true);
    setDetailError('');

    try {
      const response = await getAdminProviderById(providerId);
      setSelectedProvider(response);
    } catch (loadError) {
      setDetailError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load provider details.'
      );
      setSelectedProvider(null);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const serviceCategoryOptions = useMemo(
    () => categories.map((category) => ({
      label: category.label,
      value: category.code
    })),
    [categories]
  );

  const closeDrawer = () => {
    setSelectedProviderId(null);
    setSelectedProvider(null);
    setDetailError('');
  };

  const handleOpenEdit = async (provider: AdminProviderRow) => {
    setIsSubmitting(true);
    try {
      const detail = selectedProvider?.id === provider.id
        ? selectedProvider
        : await getAdminProviderById(provider.id);
      setEditTarget(detail);
      setEditForm(buildEditForm(detail));
      setIsEditModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenStatus = (provider: AdminProviderRow) => {
    setStatusTarget(provider);
    setStatusAction(getDefaultStatusAction(provider.status));
    setStatusReason('');
    setIsStatusModalOpen(true);
  };

  const handleOpenDelete = (provider: AdminProviderRow) => {
    setDeleteTarget(provider);
    setIsDeleteModalOpen(true);
  };

  const syncUpdatedProvider = async (detail: AdminProviderDetail) => {
    await loadProviders();

    if (selectedProviderId === detail.id) {
      setSelectedProvider(detail);
    }

    if (editTarget?.id === detail.id) {
      setEditTarget(detail);
      setEditForm(buildEditForm(detail));
    }
  };

  const submitEdit = async () => {
    if (!editTarget) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateAdminProvider(editTarget.id, editForm);
      await syncUpdatedProvider(response);
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStatusChange = async () => {
    if (!statusTarget) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateAdminProviderStatus(
        statusTarget.id,
        statusAction,
        statusReason.trim() || undefined
      );
      await syncUpdatedProvider(response);
      setIsStatusModalOpen(false);
      setStatusTarget(null);
      setStatusReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteAdminProvider(deleteTarget.id);
      await loadProviders();

      if (selectedProviderId === deleteTarget.id) {
        closeDrawer();
      }

      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Provider',
      accessor: (row: AdminProviderRow) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {row.displayName}
          </div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row: AdminProviderRow) => (
        <span className="capitalize">{row.serviceCategory}</span>
      )
    },
    {
      header: 'City',
      accessor: (row: AdminProviderRow) => row.city || 'N/A'
    },
    {
      header: 'Plan',
      accessor: (row: AdminProviderRow) => (
        <span className="capitalize">{row.subscriptionTier}</span>
      )
    },
    {
      header: 'Rating',
      accessor: (row: AdminProviderRow) => (
        <span>{row.ratingAverage.toFixed(1)} ({row.ratingCount})</span>
      )
    },
    {
      header: 'Status',
      accessor: (row: AdminProviderRow) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: (row: AdminProviderRow) => (
        <div
          className="flex items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={() => void openProviderDetail(row.id)}
            className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => void handleOpenEdit(row)}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenStatus(row)}
            className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
            title="Change status"
          >
            {row.status === 'active'
              ? <Ban className="w-4 h-4" />
              : <CheckCircle2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Professionals
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Moderate, update, and review providers through the live admin API.
        </p>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search by name, email, or phone..."
        filters={[
          {
            id: 'status',
            label: 'All Statuses',
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value as AdminProviderStatus | '');
              setPage(1);
            },
            options: STATUS_OPTIONS
          },
          {
            id: 'category',
            label: 'All Categories',
            value: serviceCategoryFilter,
            onChange: (value) => {
              setServiceCategoryFilter(value);
              setPage(1);
            },
            options: serviceCategoryOptions
          }
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={cityFilter}
              onChange={(event) => {
                setCityFilter(event.target.value);
                setPage(1);
              }}
              placeholder="Filter city..."
              className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as NonNullable<AdminProviderListFilters['sortBy']>);
                setPage(1);
              }}
              className="py-1.5 pl-2 pr-6 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSortDesc((value) => !value);
                setPage(1);
              }}
              className="px-3 py-1.5 text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              {sortDesc ? 'Desc' : 'Asc'}
            </button>
            <button
              onClick={() => void loadProviders()}
              className="px-3 py-1.5 text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={providers}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => void openProviderDetail(row.id)}
          exportConfig={{
            fileName: 'admin-providers',
            columns: [
              { header: 'Name', key: 'displayName' },
              { header: 'Email', key: 'email' },
              { header: 'Phone', key: 'phone' },
              { header: 'Category', key: 'serviceCategory' },
              { header: 'City', key: 'city' },
              { header: 'Tier', key: 'subscriptionTier' },
              { header: 'Status', key: 'status' },
              { header: 'Bookings', key: 'totalBookings' },
              { header: 'Revenue', key: 'totalRevenue' },
              { header: 'CancellationRate', key: 'cancellationRate' }
            ]
          }}
          pagination={{
            page,
            totalPages,
            totalItems,
            onPageChange: (nextPage) => setPage(nextPage)
          }}
        />
      )}

      <DetailDrawer
        isOpen={!!selectedProviderId}
        onClose={closeDrawer}
        title="Provider Details"
        footer={
          selectedProvider && (
            <div className="flex justify-end gap-2 w-full">
              <button
                onClick={() => void handleOpenEdit(selectedProvider)}
                className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Edit provider
              </button>
              <button
                onClick={() => handleOpenStatus(selectedProvider)}
                className="px-3 py-1.5 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Change status
              </button>
            </div>
          )
        }
      >
        {isDetailLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : detailError ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {detailError}
          </div>
        ) : selectedProvider ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500">
                {selectedProvider.displayName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProvider.displayName}
                </h3>
                <p className="text-sm text-slate-500">{selectedProvider.email}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedProvider.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <p className="text-sm font-medium capitalize">{selectedProvider.serviceCategory}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1">City</p>
                <p className="text-sm font-medium">{selectedProvider.city || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Phone</p>
                <p className="text-sm font-medium">{selectedProvider.phone || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm font-medium">{formatDate(selectedProvider.createdAt)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                Administrative State
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Subscription Tier</span>
                  <span className="text-sm font-medium capitalize">{selectedProvider.subscriptionTier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Approved</span>
                  <StatusBadge status={selectedProvider.isApproved ? 'active' : 'pending'} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Verified</span>
                  <StatusBadge status={selectedProvider.isVerified ? 'active' : 'pending'} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Availability</span>
                  <StatusBadge status={selectedProvider.isAvailable ? 'active' : 'blocked'} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                Performance Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bookings</span>
                  <span className="text-sm font-medium">{selectedProvider.totalBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Revenue</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedProvider.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Available Balance</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedProvider.availableBalance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Rating</span>
                  <span className="text-sm font-medium">
                    {selectedProvider.ratingAverage.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Cancellation Rate</span>
                  <span className="text-sm font-medium">{selectedProvider.cancellationRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                Description
              </h4>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>{selectedProvider.shortDescription || 'No short description provided.'}</p>
                <p>{selectedProvider.bio || 'No bio provided.'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                Documents
              </h4>
              <div className="space-y-2">
                {selectedProvider.documents.length === 0 ? (
                  <p className="text-sm text-slate-500">No documents available.</p>
                ) : (
                  selectedProvider.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {document.documentName || document.documentType}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{document.documentType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={document.isVerified ? 'active' : 'pending'} />
                        <a
                          href={document.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-teal-600 hover:text-teal-700"
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Provider"
        maxWidth="xl"
        footer={
          <>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => void submitEdit()}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-70"
            >
              Save changes
            </button>
          </>
        }
      >
        {editTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={editForm.businessName || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    businessName: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.firstName || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    firstName: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.lastName || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    lastName: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={editTarget.email}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editTarget.phone || ''}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Short Description
                </label>
                <textarea
                  value={editForm.shortDescription || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    shortDescription: event.target.value
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    bio: event.target.value
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={editForm.addressLine1 || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    addressLine1: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={editForm.addressLine2 || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    addressLine2: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={editForm.city || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    city: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={editForm.stateProvince || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    stateProvince: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={editForm.postalCode || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    postalCode: event.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Country Code
                </label>
                <input
                  type="text"
                  value={editForm.countryCode || ''}
                  onChange={(event) => setEditForm((value) => ({
                    ...value,
                    countryCode: event.target.value.toUpperCase()
                  }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Change Provider Status"
        footer={
          <>
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => void submitStatusChange()}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-70"
            >
              Apply
            </button>
          </>
        }
      >
        {statusTarget && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {statusTarget.displayName}
              </p>
              <p className="text-xs text-slate-500">{statusTarget.email}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Action
              </label>
              <select
                value={statusAction}
                onChange={(event) => setStatusAction(event.target.value as AdminProviderStatusAction)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
              >
                {getStatusActions(statusTarget.status).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Reason
              </label>
              <textarea
                value={statusReason}
                onChange={(event) => setStatusReason(event.target.value)}
                rows={4}
                placeholder="Optional reason for audit and moderation follow-up..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Provider"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => void submitDelete()}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-70"
            >
              Delete provider
            </button>
          </>
        }
      >
        {deleteTarget && (
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>
              This will soft-delete <strong>{deleteTarget.displayName}</strong> and deactivate
              the linked user account.
            </p>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              The provider will disappear from active admin reads, but the record remains
              recoverable through backend data retention workflows.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
