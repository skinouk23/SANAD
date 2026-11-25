import { api } from '../api/client';
import type { AdminTransactionsOverview } from '../types/admin.types';

export async function getAdminTransactions(): Promise<AdminTransactionsOverview> {
  return api.get<AdminTransactionsOverview>('/admin/transactions');
}

export const adminTransactionsService = {
  getAdminTransactions
};
