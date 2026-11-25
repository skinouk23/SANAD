/**
 * Transaction Hooks
 * Custom React hooks for transaction data fetching and management
 */

import { useMemo } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import {
  transactionsService,
  TransactionFilters,
  TransactionStats,
  ProviderBalance } from
'../services/transactions.service';
import type {
  Transaction,
  TransactionStatus,
  PaymentMethod } from
'../types/api.types';

// ============================================
// FETCH HOOKS
// ============================================

/**
 * Hook for fetching transactions with filters
 */
export function useTransactions(filters?: TransactionFilters) {
  const filtersKey = JSON.stringify(filters);

  return useApi<Transaction[]>(
    () => transactionsService.getAll(filters),
    [filtersKey]
  );
}

/**
 * Hook for fetching paginated transactions
 */
export function usePaginatedTransactions(initialFilters?: TransactionFilters) {
  return usePaginatedApi<Transaction, TransactionFilters>(
    transactionsService.getPaginated,
    initialFilters || { page: 1, limit: 10 }
  );
}

/**
 * Hook for fetching a single transaction by ID
 */
export function useTransaction(transactionId: string | undefined) {
  return useApi<Transaction | null>(
    () =>
    transactionId ?
    transactionsService.getById(transactionId) :
    Promise.resolve(null),
    [transactionId],
    { immediate: !!transactionId }
  );
}

/**
 * Hook for fetching provider transactions
 */
export function useProviderTransactions(providerId: string) {
  return useApi<Transaction[]>(
    () => transactionsService.getByProvider(providerId),
    [providerId]
  );
}

/**
 * Hook for fetching patient transactions
 */
export function usePatientTransactions(patientId: string) {
  return useApi<Transaction[]>(
    () => transactionsService.getByPatient(patientId),
    [patientId]
  );
}

/**
 * Hook for fetching transaction stats
 */
export function useTransactionStats(providerId?: string, patientId?: string) {
  const stableProviderId = providerId || undefined;
  const stablePatientId = patientId || undefined;

  return useApi<TransactionStats>(
    () => transactionsService.getStats(stableProviderId, stablePatientId),
    [stableProviderId, stablePatientId]
  );
}

/**
 * Hook for fetching provider balance
 */
export function useProviderBalance(providerId: string) {
  return useApi<ProviderBalance>(
    () => transactionsService.getProviderBalance(providerId),
    [providerId]
  );
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Hook for creating a new transaction
 */
export function useCreateTransaction() {
  return useMutation(transactionsService.create);
}

/**
 * Hook for processing a transaction
 */
export function useProcessTransaction() {
  return useMutation(transactionsService.process);
}

/**
 * Hook for refunding a transaction
 */
export function useRefundTransaction() {
  return useMutation(({ id, reason }: {id: string;reason?: string;}) =>
  transactionsService.refund(id, reason)
  );
}

/**
 * Hook for requesting a payout
 */
export function useRequestPayout() {
  return useMutation(
    ({
      providerId,
      amount,
      method




    }: {providerId: string;amount: number;method: 'bank_transfer' | 'wallet';}) => transactionsService.requestPayout(providerId, amount, method)
  );
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook for transaction status helpers
 */
export function useTransactionStatus(status: TransactionStatus) {
  return useMemo(() => {
    const statusConfig: Record<
      TransactionStatus,
      {
        label: string;
        color: string;
        bgColor: string;
        borderColor: string;
      }> =
    {
      pending: {
        label: 'En attente',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/50'
      },
      processing: {
        label: 'En cours',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/50'
      },
      completed: {
        label: 'Complété',
        color: 'text-green-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/50'
      },
      failed: {
        label: 'Échoué',
        color: 'text-red-500',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50'
      },
      refunded: {
        label: 'Remboursé',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/50'
      }
    };

    return statusConfig[status] || statusConfig.pending;
  }, [status]);
}

/**
 * Hook for payment method helpers
 */
export function usePaymentMethod(method: PaymentMethod) {
  return useMemo(() => {
    const methodConfig: Record<
      PaymentMethod,
      {
        label: string;
        icon: string;
      }> =
    {
      card: { label: 'Carte bancaire', icon: '💳' },
      d17: { label: 'D17', icon: '📱' },
      cash: { label: 'Espèces', icon: '💵' },
      bank_transfer: { label: 'Virement', icon: '🏦' },
      wallet: { label: 'Portefeuille', icon: '👛' }
    };

    return methodConfig[method] || methodConfig.card;
  }, [method]);
}

/**
 * Hook for formatting currency
 */
export function useFormatCurrency(amount: number, currency: string = 'TND') {
  return useMemo(() => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }, [amount, currency]);
}

/**
 * Hook for transaction summary calculations
 */
export function useTransactionSummary(transactions: Transaction[]) {
  return useMemo(() => {
    const completed = transactions.filter(
      (t) => t.status === 'completed' && t.type === 'payment'
    );
    const pending = transactions.filter((t) => t.status === 'pending');

    return {
      totalRevenue: completed.reduce((sum, t) => sum + t.amount, 0),
      totalCommissions: completed.reduce(
        (sum, t) => sum + (t.commission || 0),
        0
      ),
      totalNet: completed.reduce(
        (sum, t) => sum + (t.netAmount || t.amount),
        0
      ),
      pendingAmount: pending.reduce((sum, t) => sum + t.amount, 0),
      completedCount: completed.length,
      pendingCount: pending.length,
      averageTransaction:
      completed.length > 0 ?
      Math.round(
        completed.reduce((sum, t) => sum + t.amount, 0) /
        completed.length
      ) :
      0
    };
  }, [transactions]);
}