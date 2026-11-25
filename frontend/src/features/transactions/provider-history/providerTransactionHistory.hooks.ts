import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { getBookingPaymentDisplay } from '@/features/bookings';
import {
  providerPaymentHistoryOptions,
  providerPaymentHistorySortOptions,
  providerPaymentHistoryStatsOptions,
} from '@/features/transactions/provider-history/options';
import type {
  ProviderPaymentHistoryItem,
  ProviderPaymentHistoryStatus,
} from '@/features/transactions/provider-history/schema';
import { formatCurrency } from '@/shared/lib/i18n/formatting';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

const PROVIDER_TRANSACTION_PAGE_SIZE = 10;

const KNOWN_PROVIDER_PAYMENT_STATUSES: ProviderPaymentHistoryStatus[] = [
  'pending',
  'processing',
  'reserved',
  'settled',
  'failed',
  'cancelled',
  'expired',
];

export interface ProviderTransactionHistoryStat {
  label: string;
  value: string;
  iconName: 'revenue' | 'pending' | 'completed' | 'average';
}

export interface ProviderTransactionStatusOption {
  value: ProviderPaymentHistoryStatus;
  label: string;
}

function formatAmount(value: number, currency: string): string {
  return formatCurrency(value, currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function getStatusLabel(status: ProviderPaymentHistoryStatus): string {
  return getBookingPaymentDisplay({
    paymentMethod: 'cash',
    paymentStatus: status,
  }).statusLabel;
}

export function useProviderTransactionHistoryScreen() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [settledSearchQuery, setSettledSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProviderPaymentHistoryStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const debouncedSearch = debouncedSearchQuery.trim();
  const searchPending = searchQuery.trim() !== settledSearchQuery;

  useEffect(() => {
    setSettledSearchQuery(debouncedSearch);
    setCurrentPage(1);
  }, [debouncedSearch]);

  const transactionsQuery = useQuery({
    ...providerPaymentHistoryOptions({
      page: currentPage,
      limit: PROVIDER_TRANSACTION_PAGE_SIZE,
      sort: providerPaymentHistorySortOptions.createdAtDesc,
      ...(settledSearchQuery.length ? { search: settledSearchQuery } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    }),
    placeholderData: keepPreviousData,
  });
  const statsQuery = useQuery(providerPaymentHistoryStatsOptions());

  const response = transactionsQuery.data ?? null;
  const filteredTransactions = useMemo(() => response?.items ?? [], [response]);
  const currency = statsQuery.data?.currency ?? filteredTransactions[0]?.currency ?? 'TND';

  const statCards = useMemo<ProviderTransactionHistoryStat[]>(() => {
    const stats = statsQuery.data;

    return [
      {
        label: t.provider.totalRevenue,
        value: formatAmount(stats?.totalRevenue ?? 0, currency),
        iconName: 'revenue',
      },
      {
        label: t.provider.pendingAmount,
        value: formatAmount(stats?.pendingAmount ?? 0, currency),
        iconName: 'pending',
      },
      {
        label: t.provider.completedCount,
        value: String(stats?.completedCount ?? 0),
        iconName: 'completed',
      },
      {
        label: t.provider.average,
        value: formatAmount(stats?.averageTransaction ?? 0, currency),
        iconName: 'average',
      },
    ];
  }, [
    currency,
    statsQuery.data,
    t.provider.average,
    t.provider.completedCount,
    t.provider.pendingAmount,
    t.provider.totalRevenue,
  ]);

  const statusOptions = useMemo<ProviderTransactionStatusOption[]>(() => {
    return Array.from(
      new Set([
        ...KNOWN_PROVIDER_PAYMENT_STATUSES,
        ...filteredTransactions.map((item: ProviderPaymentHistoryItem) => item.status),
      ]),
    ).map((status) => ({
      value: status as ProviderPaymentHistoryStatus,
      label: getStatusLabel(status as ProviderPaymentHistoryStatus),
    }));
  }, [filteredTransactions]);

  const pagination = response?.pagination
    ? {
        ...response.pagination,
        hasNext: response.pagination.page < response.pagination.totalPages,
        hasPrev: response.pagination.page > 1,
      }
    : null;

  const hasFilters = searchQuery.trim().length > 0 || statusFilter !== 'all';
  const error = transactionsQuery.error ?? statsQuery.error;

  return {
    currentPage,
    error,
    filteredTransactions,
    hasFilters,
    pagination,
    searchQuery,
    searchPending,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter: (nextStatus: 'all' | ProviderPaymentHistoryStatus) => {
      setStatusFilter(nextStatus);
      setCurrentPage(1);
    },
    statCards,
    statsLoading: statsQuery.isLoading,
    statusFilter,
    statusOptions,
    transactionsFetching: transactionsQuery.isFetching,
    transactionsPlaceholderData: transactionsQuery.isPlaceholderData,
    transactionsLoading: transactionsQuery.isLoading,
    refetchAll: () => {
      void transactionsQuery.refetch();
      void statsQuery.refetch();
    },
  };
}
