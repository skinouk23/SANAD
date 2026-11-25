import { useEffect, useMemo, useRef, useState } from 'react';

import { providerWalletManualTopUpConfig } from '@/features/provider-wallet/manualTopUp.config';
import { defaultProviderWalletMovementFilters } from '@/features/provider-wallet/options';
import { useCreateAndSubmitProviderWalletTopUp } from '@/features/provider-wallet/hooks/useProviderWalletMutations';
import {
  useProviderWalletMovements,
  useProviderWalletStats,
  useProviderWalletSummary,
} from '@/features/provider-wallet/hooks/useProviderWalletQueries';
import { showSuccessToast } from '@/shared/lib/notifications/toast';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import type {
  ProviderWalletMovementType,
  ProviderWalletPaymentChannel,
} from '@/features/provider-wallet/schema';

type ProviderWalletMovementFilter = ProviderWalletMovementType | 'all';

function parseTopUpAmount(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (!normalized.length) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function useProviderWalletScreen() {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentChannel, setSelectedPaymentChannel] =
    useState<ProviderWalletPaymentChannel>('bank_transfer');
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [createTopUpIdempotencyKey, setCreateTopUpIdempotencyKey] = useState<string | null>(null);
  const [providerTransferReference, setProviderTransferReference] = useState('');
  const [movementFilterType, setMovementFilterType] = useState<ProviderWalletMovementFilter>('all');
  const [movementSearchQuery, setMovementSearchQuery] = useState('');
  const [movementSelectedMonth, setMovementSelectedMonth] = useState('all');
  const [movementSelectedYear, setMovementSelectedYear] = useState('all');
  const [movementPage, setMovementPage] = useState(defaultProviderWalletMovementFilters.page);
  const [settledMovementSearchQuery, setSettledMovementSearchQuery] = useState('');
  const createTopUpIdempotencyKeyRef = useRef<string | null>(null);
  const debouncedMovementSearchQuery = useDebouncedValue(movementSearchQuery, 300);
  const debouncedMovementSearch = debouncedMovementSearchQuery.trim();
  const movementSearchPending = movementSearchQuery.trim() !== settledMovementSearchQuery;

  useEffect(() => {
    setSettledMovementSearchQuery(debouncedMovementSearch);
    setMovementPage(defaultProviderWalletMovementFilters.page);
  }, [debouncedMovementSearch]);

  const movementQueryFilters = useMemo(() => {
    const selectedMonth =
      movementSelectedMonth === 'all' ? undefined : Number(movementSelectedMonth) + 1;
    const selectedYear = movementSelectedYear === 'all' ? undefined : Number(movementSelectedYear);

    return {
      page: movementPage,
      limit: defaultProviderWalletMovementFilters.limit,
      ...(movementFilterType !== 'all' ? { type: movementFilterType } : {}),
      ...(settledMovementSearchQuery.length ? { search: settledMovementSearchQuery } : {}),
      ...(Number.isInteger(selectedMonth) ? { month: selectedMonth } : {}),
      ...(Number.isInteger(selectedYear) ? { year: selectedYear } : {}),
    };
  }, [
    movementFilterType,
    movementPage,
    movementSelectedMonth,
    movementSelectedYear,
    settledMovementSearchQuery,
  ]);

  const summaryQuery = useProviderWalletSummary();
  const statsQuery = useProviderWalletStats();
  const movementsQuery = useProviderWalletMovements(movementQueryFilters);

  const createTopUpMutation = useCreateAndSubmitProviderWalletTopUp();

  const summary = summaryQuery.data;
  const stats = statsQuery.data;
  const movements = movementsQuery.data;
  const currency =
    summary?.currency ??
    stats?.currency ??
    movements[0]?.currency ??
    providerWalletManualTopUpConfig.defaultCurrency;
  const parsedTopUpAmount = parseTopUpAmount(topUpAmount);
  const trimmedProviderTransferReference = providerTransferReference.trim();
  const lowBalanceThreshold = providerWalletManualTopUpConfig.lowBalanceThreshold;
  const availableYears = useMemo(() => {
    const years = [...(stats?.availableYears ?? [])].sort((left, right) => right - left);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [stats]);

  const isLowBalance = (summary?.usableBalance ?? 0) < lowBalanceThreshold;
  const pageError =
    (!summary && summaryQuery.error) || (!stats && statsQuery.error)
      ? (summaryQuery.error ?? statsQuery.error)
      : null;
  const hasBlockingError = Boolean(pageError);

  const createTopUpErrorMessage = createTopUpMutation.error
    ? getApiErrorMessage(
        createTopUpMutation.error,
        'Impossible de recharger le portefeuille pour le moment.',
      )
    : null;

  const primaryActionLabel = 'Recharger le portefeuille';
  const primaryActionDisabled = summaryQuery.loading;

  function startFreshCreateTopUpIdempotencyWindow() {
    const nextKey = crypto.randomUUID();
    createTopUpIdempotencyKeyRef.current = nextKey;
    setCreateTopUpIdempotencyKey(nextKey);

    return nextKey;
  }

  function resetCreateTopUpIdempotencyWindow() {
    createTopUpIdempotencyKeyRef.current = null;
    setCreateTopUpIdempotencyKey(null);
  }

  function ensureCreateTopUpIdempotencyKey() {
    const currentKey = createTopUpIdempotencyKeyRef.current ?? createTopUpIdempotencyKey;
    if (currentKey) {
      createTopUpIdempotencyKeyRef.current = currentKey;
      return currentKey;
    }

    return startFreshCreateTopUpIdempotencyWindow();
  }

  function openCreateTopUpDialog() {
    createTopUpMutation.reset();
    startFreshCreateTopUpIdempotencyWindow();
    setTopUpAmount('');
    setProviderTransferReference('');
    setSelectedPaymentChannel('bank_transfer');
    setTopUpDialogOpen(true);
  }

  function closeTopUpDialog() {
    createTopUpMutation.reset();
    resetCreateTopUpIdempotencyWindow();
    setTopUpDialogOpen(false);
  }

  function handlePrimaryAction() {
    if (!summaryQuery.loading) {
      openCreateTopUpDialog();
    }
  }

  function handleMovementFilterTypeChange(value: ProviderWalletMovementFilter) {
    setMovementFilterType(value);
    setMovementPage(defaultProviderWalletMovementFilters.page);
  }

  function handleMovementSearchQueryChange(value: string) {
    setMovementSearchQuery(value);
  }

  function handleMovementSelectedMonthChange(value: string) {
    setMovementSelectedMonth(value);
    setMovementPage(defaultProviderWalletMovementFilters.page);
  }

  function handleMovementSelectedYearChange(value: string) {
    setMovementSelectedYear(value);
    setMovementPage(defaultProviderWalletMovementFilters.page);
  }

  function handleMovementPageChange(page: number) {
    setMovementPage(Math.max(1, page));
  }

  async function handleCopy(value: string, successMessage = 'Reference copiee.') {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showSuccessToast(successMessage);
    } catch {
      // Ignore clipboard failures silently.
    }
  }

  async function handleCreateTopUp() {
    if (
      !parsedTopUpAmount ||
      parsedTopUpAmount <= 0 ||
      trimmedProviderTransferReference.length === 0
    ) {
      return;
    }

    const idempotencyKey = ensureCreateTopUpIdempotencyKey();

    await createTopUpMutation.mutateAsync({
      idempotencyKey,
      input: {
        amount: parsedTopUpAmount,
        currency: providerWalletManualTopUpConfig.defaultCurrency,
        paymentChannel: selectedPaymentChannel,
        providerTransferReference: trimmedProviderTransferReference,
      },
    });

    resetCreateTopUpIdempotencyWindow();
    setTopUpAmount('');
    setProviderTransferReference('');
    setSelectedPaymentChannel('bank_transfer');
    setTopUpDialogOpen(false);
    showSuccessToast('Rechargement soumis. Votre portefeuille a ete credite.');
  }

  return {
    availableYears,
    closeTopUpDialog,
    createTopUpErrorMessage,
    createTopUpMutation,
    currency,
    handleCopy,
    handleCreateTopUp,
    handleMovementFilterTypeChange,
    handleMovementPageChange,
    handleMovementSearchQueryChange,
    handleMovementSelectedMonthChange,
    handleMovementSelectedYearChange,
    handlePrimaryAction,
    hasBlockingError,
    isLowBalance,
    lowBalanceThreshold,
    movementFilterType,
    movementSearchQuery,
    movementSearchPending,
    movementSelectedMonth,
    movementSelectedYear,
    movements,
    movementsError: movementsQuery.error,
    movementsFetching: movementsQuery.isFetching,
    movementsLoading: movementsQuery.loading,
    movementsPagination: movementsQuery.pagination,
    movementsRefreshing: movementsQuery.isRefreshing || movementsQuery.isPlaceholderData,
    movementsQuery,
    pageError,
    parsedTopUpAmount,
    primaryActionDisabled,
    primaryActionLabel,
    providerTransferReference,
    refetchAll: () => {
      void summaryQuery.refetch();
      void statsQuery.refetch();
      void movementsQuery.refetch();
    },
    selectedPaymentChannel,
    setProviderTransferReference,
    setSelectedPaymentChannel,
    setTopUpAmount,
    stats,
    statsError: statsQuery.error,
    statsLoading: statsQuery.loading,
    statsRefreshing: statsQuery.isRefreshing || statsQuery.isPlaceholderData,
    summary,
    summaryLoading: summaryQuery.loading,
    summaryRefreshing: summaryQuery.isRefreshing || summaryQuery.isPlaceholderData,
    topUpAmount,
    topUpDialogOpen,
  };
}
