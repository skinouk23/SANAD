import type { LoaderFunctionArgs } from 'react-router-dom';

import { queryClient } from '@/shared/lib/query/client';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import {
  providerPaymentHistoryOptions,
  providerPaymentHistorySortOptions,
  providerPaymentHistoryStatsOptions,
} from './options';
import { useProviderTransactionHistoryScreen } from './providerTransactionHistory.hooks';
import {
  ProviderTransactionFilters,
  ProviderTransactionHistoryHeader,
  ProviderTransactionsList,
  ProviderTransactionsPagination,
  ProviderTransactionStats,
} from './providerTransactionHistory.sections';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void Promise.all([
    queryClient.prefetchQuery(
      providerPaymentHistoryOptions({
        page: 1,
        limit: 10,
        sort: providerPaymentHistorySortOptions.createdAtDesc,
      }),
    ),
    queryClient.prefetchQuery(providerPaymentHistoryStatsOptions()),
  ]).catch(() => undefined);

  return null;
};

export function ProviderTransactionHistoryScreen() {
  const screen = useProviderTransactionHistoryScreen();
  const isUpdating =
    screen.searchPending || screen.transactionsPlaceholderData || screen.transactionsFetching;

  if (screen.error && !screen.filteredTransactions.length && !screen.statsLoading) {
    return (
      <div className="min-h-screen pb-20">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
          <EmptyState
            className="w-full rounded-2xl border border-rose-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:bg-rose-950/20 [&_h3]:text-rose-700 dark:[&_h3]:text-rose-200 [&_p]:text-rose-600/80 dark:[&_p]:text-rose-200/70"
            title="Historique indisponible"
            description={getApiErrorMessage(
              screen.error,
              'Impossible de charger les transactions du prestataire pour le moment.',
            )}
            action={
              <button
                type="button"
                onClick={screen.refetchAll}
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/30"
              >
                Reessayer
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderTransactionHistoryHeader />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <ProviderTransactionStats loading={screen.statsLoading} stats={screen.statCards} />
        <ProviderTransactionFilters
          isUpdating={isUpdating && !screen.transactionsLoading}
          searchQuery={screen.searchQuery}
          statusFilter={screen.statusFilter}
          statusOptions={screen.statusOptions}
          onSearchChange={screen.setSearchQuery}
          onStatusChange={screen.setStatusFilter}
        />
        <ProviderTransactionsList
          isUpdating={isUpdating && !screen.transactionsLoading}
          loading={screen.transactionsLoading}
          transactions={screen.filteredTransactions}
          emptyHint={
            screen.hasFilters
              ? 'Essayez de modifier vos filtres.'
              : 'Vos transactions apparaitront ici.'
          }
        />
        <ProviderTransactionsPagination
          currentPage={screen.pagination?.page ?? screen.currentPage}
          hasNext={screen.pagination?.hasNext ?? false}
          hasPrev={screen.pagination?.hasPrev ?? false}
          total={screen.pagination?.total ?? screen.filteredTransactions.length}
          totalPages={screen.pagination?.totalPages ?? 1}
          onNext={() => screen.setCurrentPage((page) => page + 1)}
          onPrevious={() => screen.setCurrentPage((page) => Math.max(1, page - 1))}
        />
      </div>
    </div>
  );
}
