/**
 * Transactions Service
 * Handles all transaction and payment-related API calls
 */

import { api } from '../api/client';
import { env } from '../config/env';
import {
  generateTransactions,
  generateTransaction } from
'../data/mock/generators';
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
  PaymentMethod,
  PaginatedResponse,
  PaginationParams } from
'../types/api.types';

// ============================================
// MOCK DATA CACHE
// ============================================

let mockTransactions: Transaction[] | null = null;

function getMockTransactions(): Transaction[] {
  if (!mockTransactions) {
    // Generate base transactions
    const generated = generateTransactions(100);

    // Add provider-specific transactions for the balance page
    const providerTransactions: Transaction[] = [
    {
      id: 'txn_prov_001',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 80,
      currency: 'TND',
      commission: 12,
      netAmount: 68,
      paymentMethod: 'card' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_1',
      description: 'Consultation soins infirmiers - Mohamed Ali',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_002',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 45,
      currency: 'TND',
      commission: 7,
      netAmount: 38,
      paymentMethod: 'cash' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_2',
      description: 'Pansement complexe - Fatma Ben Said',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_003',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 120,
      currency: 'TND',
      commission: 18,
      netAmount: 102,
      paymentMethod: 'd17' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_3',
      description: 'Perfusion à domicile - Ahmed Trabelsi',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_004',
      type: 'payment' as TransactionType,
      status: 'pending' as TransactionStatus,
      amount: 60,
      currency: 'TND',
      commission: 9,
      netAmount: 51,
      paymentMethod: 'card' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_4',
      description: 'Injection IM - Sonia Khelifi',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_005',
      type: 'payout' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 350,
      currency: 'TND',
      commission: 0,
      netAmount: 350,
      paymentMethod: 'bank_transfer' as PaymentMethod,
      providerId: 'current-provider',
      description: 'Virement vers compte bancaire',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_006',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 35,
      currency: 'TND',
      commission: 5,
      netAmount: 30,
      paymentMethod: 'cash' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_5',
      description: 'Prélèvement sanguin - Karim Bouazizi',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_007',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 90,
      currency: 'TND',
      commission: 14,
      netAmount: 76,
      paymentMethod: 'card' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_6',
      description: 'Garde de nuit - Leila Mansouri',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(
        Date.now() - 8 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_008',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 55,
      currency: 'TND',
      commission: 8,
      netAmount: 47,
      paymentMethod: 'd17' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_7',
      description: 'Kinésithérapie respiratoire - Nadia Hamdi',
      createdAt: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedAt: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_009',
      type: 'payout' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 200,
      currency: 'TND',
      commission: 0,
      netAmount: 200,
      paymentMethod: 'bank_transfer' as PaymentMethod,
      providerId: 'current-provider',
      description: 'Virement vers compte bancaire',
      createdAt: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedAt: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction,
    {
      id: 'txn_prov_010',
      type: 'payment' as TransactionType,
      status: 'completed' as TransactionStatus,
      amount: 75,
      currency: 'TND',
      commission: 11,
      netAmount: 64,
      paymentMethod: 'card' as PaymentMethod,
      providerId: 'current-provider',
      patientId: 'patient_8',
      description: 'Surveillance post-opératoire - Youssef Chahed',
      createdAt: new Date(
        Date.now() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processedAt: new Date(
        Date.now() - 12 * 24 * 60 * 60 * 1000
      ).toISOString()
    } as Transaction];


    mockTransactions = [...providerTransactions, ...generated];
  }
  return mockTransactions;
}

// ============================================
// FILTERS
// ============================================

export interface TransactionFilters extends PaginationParams {
  status?: TransactionStatus | TransactionStatus[];
  type?: TransactionType | TransactionType[];
  paymentMethod?: PaymentMethod;
  patientId?: string;
  providerId?: string;
  appointmentId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================
// TRANSACTION ENDPOINTS
// ============================================

export async function getTransactions(
filters?: TransactionFilters)
: Promise<Transaction[]> {
  if (env.ENABLE_MOCK_DATA) {
    let transactions = getMockTransactions();

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ?
      filters.status :
      [filters.status];
      transactions = transactions.filter((t) => statuses.includes(t.status));
    }

    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      transactions = transactions.filter((t) => types.includes(t.type));
    }

    if (filters?.paymentMethod) {
      transactions = transactions.filter(
        (t) => t.paymentMethod === filters.paymentMethod
      );
    }

    if (filters?.patientId) {
      transactions = transactions.filter(
        (t) => t.patientId === filters.patientId
      );
    }

    if (filters?.providerId) {
      transactions = transactions.filter(
        (t) => t.providerId === filters.providerId
      );
    }

    if (filters?.startDate) {
      transactions = transactions.filter(
        (t) => new Date(t.createdAt) >= new Date(filters.startDate!)
      );
    }

    if (filters?.endDate) {
      transactions = transactions.filter(
        (t) => new Date(t.createdAt) <= new Date(filters.endDate!)
      );
    }

    if (filters?.minAmount) {
      transactions = transactions.filter((t) => t.amount >= filters.minAmount!);
    }

    if (filters?.maxAmount) {
      transactions = transactions.filter((t) => t.amount <= filters.maxAmount!);
    }

    // Sort by date descending
    transactions.sort(
      (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return transactions;
  }

  try {
    return await api.get<Transaction[]>('/transactions', { params: filters });
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockTransactions();
  }
}

export async function getTransactionsPaginated(
filters?: TransactionFilters)
: Promise<PaginatedResponse<Transaction>> {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  const allTransactions = await getTransactions(filters);
  const total = allTransactions.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = allTransactions.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function getTransactionById(
transactionId: string)
: Promise<Transaction | null> {
  if (env.ENABLE_MOCK_DATA) {
    return getMockTransactions().find((t) => t.id === transactionId) || null;
  }

  try {
    return await api.get<Transaction>(`/transactions/${transactionId}`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMockTransactions().find((t) => t.id === transactionId) || null;
  }
}

export async function getProviderTransactions(
providerId: string)
: Promise<Transaction[]> {
  return getTransactions({ providerId });
}

export async function getPatientTransactions(
patientId: string)
: Promise<Transaction[]> {
  return getTransactions({ patientId });
}

// ============================================
// TRANSACTION ACTIONS
// ============================================

export async function createTransaction(data: {
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  appointmentId?: string;
  patientId?: string;
  providerId?: string;
  description?: string;
}): Promise<Transaction | null> {
  if (env.ENABLE_MOCK_DATA) {
    const commission =
    data.type === 'payment' ? Math.round(data.amount * 0.15) : 0;
    const newTransaction = generateTransaction({
      ...data,
      id: `txn_${Date.now()}`,
      status: 'pending',
      currency: 'TND',
      commission,
      netAmount: data.amount - commission,
      createdAt: new Date().toISOString()
    });
    getMockTransactions().unshift(newTransaction);
    return newTransaction;
  }

  try {
    return await api.post<Transaction>('/transactions', data);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function processTransaction(
transactionId: string)
: Promise<Transaction | null> {
  if (env.ENABLE_MOCK_DATA) {
    const transactions = getMockTransactions();
    const index = transactions.findIndex((t) => t.id === transactionId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        status: 'processing'
      };
      // Simulate processing delay
      setTimeout(() => {
        transactions[index] = {
          ...transactions[index],
          status: 'completed',
          processedAt: new Date().toISOString()
        };
      }, 2000);
      return transactions[index];
    }
    return null;
  }

  try {
    return await api.post<Transaction>(`/transactions/${transactionId}/process`);
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

export async function refundTransaction(
transactionId: string,
reason?: string)
: Promise<Transaction | null> {
  if (env.ENABLE_MOCK_DATA) {
    const transactions = getMockTransactions();
    const original = transactions.find((t) => t.id === transactionId);
    if (original && original.status === 'completed') {
      const refund = generateTransaction({
        id: `txn_refund_${Date.now()}`,
        type: 'refund',
        status: 'completed',
        amount: original.amount,
        currency: 'TND',
        paymentMethod: original.paymentMethod,
        appointmentId: original.appointmentId,
        patientId: original.patientId,
        providerId: original.providerId,
        description: reason || `Refund for ${original.id}`,
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString()
      });
      transactions.unshift(refund);

      // Update original transaction
      const index = transactions.findIndex((t) => t.id === transactionId);
      transactions[index] = { ...transactions[index], status: 'refunded' };

      return refund;
    }
    return null;
  }

  try {
    return await api.post<Transaction>(
      `/transactions/${transactionId}/refund`,
      { reason }
    );
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

// ============================================
// TRANSACTION STATS
// ============================================

export interface TransactionStats {
  totalRevenue: number;
  totalCommissions: number;
  pendingAmount: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  averageTransaction: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  byPaymentMethod: Record<PaymentMethod, {count: number;amount: number;}>;
}

export async function getTransactionStats(
providerId?: string,
patientId?: string)
: Promise<TransactionStats> {
  const filters: TransactionFilters = {};
  if (providerId) filters.providerId = providerId;
  if (patientId) filters.patientId = patientId;

  const transactions = await getTransactions(filters);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const completed = transactions.filter(
    (t) => t.status === 'completed' && t.type === 'payment'
  );
  const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
  const totalCommissions = completed.reduce(
    (sum, t) => sum + (t.commission || 0),
    0
  );

  const byPaymentMethod: Record<string, {count: number;amount: number;}> = {
    card: { count: 0, amount: 0 },
    d17: { count: 0, amount: 0 },
    cash: { count: 0, amount: 0 },
    bank_transfer: { count: 0, amount: 0 },
    wallet: { count: 0, amount: 0 }
  };

  completed.forEach((t) => {
    if (byPaymentMethod[t.paymentMethod]) {
      byPaymentMethod[t.paymentMethod].count++;
      byPaymentMethod[t.paymentMethod].amount += t.amount;
    }
  });

  return {
    totalRevenue,
    totalCommissions,
    pendingAmount: transactions.
    filter((t) => t.status === 'pending').
    reduce((sum, t) => sum + t.amount, 0),
    completedCount: completed.length,
    pendingCount: transactions.filter((t) => t.status === 'pending').length,
    failedCount: transactions.filter((t) => t.status === 'failed').length,
    refundedCount: transactions.filter((t) => t.status === 'refunded').length,
    averageTransaction:
    completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0,
    thisWeekRevenue: completed.
    filter((t) => new Date(t.createdAt) >= weekAgo).
    reduce((sum, t) => sum + t.amount, 0),
    thisMonthRevenue: completed.
    filter((t) => new Date(t.createdAt) >= monthAgo).
    reduce((sum, t) => sum + t.amount, 0),
    byPaymentMethod: byPaymentMethod as Record<
      PaymentMethod,
      {count: number;amount: number;}>

  };
}

// ============================================
// PROVIDER BALANCE
// ============================================

export interface ProviderBalance {
  available: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
  lastPayout?: {
    amount: number;
    date: string;
    status: string;
  };
}

export async function getProviderBalance(
providerId: string)
: Promise<ProviderBalance> {
  if (env.ENABLE_MOCK_DATA) {
    const transactions = await getProviderTransactions(providerId);
    const completed = transactions.filter(
      (t) => t.status === 'completed' && t.type === 'payment'
    );
    const payouts = transactions.filter(
      (t) => t.type === 'payout' && t.status === 'completed'
    );

    const totalEarned = completed.reduce(
      (sum, t) => sum + (t.netAmount || t.amount),
      0
    );
    const totalWithdrawn = payouts.reduce((sum, t) => sum + t.amount, 0);
    const pending = transactions.
    filter((t) => t.status === 'pending' && t.type === 'payment').
    reduce((sum, t) => sum + (t.netAmount || t.amount), 0);

    return {
      available: totalEarned - totalWithdrawn - pending,
      pending,
      totalEarned,
      totalWithdrawn,
      lastPayout:
      payouts.length > 0 ?
      {
        amount: payouts[0].amount,
        date: payouts[0].processedAt || payouts[0].createdAt,
        status: payouts[0].status
      } :
      undefined
    };
  }

  try {
    return await api.get<ProviderBalance>(`/providers/${providerId}/balance`);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return {
      available: 245,
      pending: 85,
      totalEarned: 4250,
      totalWithdrawn: 3920
    };
  }
}

export async function requestPayout(
providerId: string,
amount: number,
method: 'bank_transfer' | 'wallet')
: Promise<Transaction | null> {
  if (env.ENABLE_MOCK_DATA) {
    const payout = generateTransaction({
      id: `txn_payout_${Date.now()}`,
      type: 'payout',
      status: 'pending',
      amount,
      currency: 'TND',
      paymentMethod: method,
      providerId,
      description: 'Payout request',
      createdAt: new Date().toISOString()
    });
    getMockTransactions().unshift(payout);
    return payout;
  }

  try {
    return await api.post<Transaction>(`/providers/${providerId}/payout`, {
      amount,
      method
    });
  } catch (error) {
    console.warn('API call failed:', error);
    return null;
  }
}

// ============================================
// SERVICE EXPORT
// ============================================

export const transactionsService = {
  getAll: getTransactions,
  getPaginated: getTransactionsPaginated,
  getById: getTransactionById,
  getByProvider: getProviderTransactions,
  getByPatient: getPatientTransactions,
  create: createTransaction,
  process: processTransaction,
  refund: refundTransaction,
  getStats: getTransactionStats,
  getProviderBalance,
  requestPayout
};

export default transactionsService;