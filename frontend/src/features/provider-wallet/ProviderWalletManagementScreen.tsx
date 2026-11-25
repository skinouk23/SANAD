import type { LoaderFunctionArgs } from 'react-router-dom';

import {
  ManualTopUpDialog,
  ProviderWalletMovementHistorySection,
  ProviderWalletPageErrorState,
  ProviderWalletPageHeader,
  ProviderWalletSummarySection,
} from '@/features/provider-wallet/components';
import { useProviderWalletScreen } from '@/features/provider-wallet/hooks/useProviderWalletScreen';
import {
  providerWalletMovementsOptions,
  providerWalletStatsOptions,
  providerWalletSummaryOptions,
} from '@/features/provider-wallet/options';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (_args: LoaderFunctionArgs) => {
  void Promise.all([
    queryClient.prefetchQuery(providerWalletSummaryOptions()),
    queryClient.prefetchQuery(providerWalletStatsOptions()),
    queryClient.prefetchQuery(providerWalletMovementsOptions()),
  ]).catch(() => undefined);

  return null;
};

export function ProviderWalletManagementScreen() {
  const screen = useProviderWalletScreen();

  if (screen.hasBlockingError) {
    return (
      <ProviderWalletPageErrorState
        message={getApiErrorMessage(
          screen.pageError,
          'Impossible de charger le portefeuille prestataire pour le moment.',
        )}
        onRetry={screen.refetchAll}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ProviderWalletPageHeader />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6">
        <ProviderWalletSummarySection
          currency={screen.currency}
          isLowBalance={screen.isLowBalance}
          loading={screen.summaryLoading}
          lowBalanceThreshold={screen.lowBalanceThreshold}
          onPrimaryAction={screen.handlePrimaryAction}
          primaryActionDisabled={screen.primaryActionDisabled}
          primaryActionLabel={screen.primaryActionLabel}
          stats={screen.stats}
          statsError={screen.statsError}
          statsLoading={screen.statsLoading}
          statsRefreshing={screen.statsRefreshing}
          summary={screen.summary}
          summaryRefreshing={screen.summaryRefreshing}
        />

        <ProviderWalletMovementHistorySection
          availableYears={screen.availableYears}
          error={screen.movementsError}
          filterType={screen.movementFilterType}
          isFetching={screen.movementsRefreshing}
          loading={screen.movementsLoading}
          movements={screen.movements}
          onCopy={screen.handleCopy}
          onFilterTypeChange={screen.handleMovementFilterTypeChange}
          onPageChange={screen.handleMovementPageChange}
          onRetry={() => {
            void screen.movementsQuery.refetch();
          }}
          onSearchQueryChange={screen.handleMovementSearchQueryChange}
          onSelectedMonthChange={screen.handleMovementSelectedMonthChange}
          onSelectedYearChange={screen.handleMovementSelectedYearChange}
          pagination={screen.movementsPagination}
          searchQuery={screen.movementSearchQuery}
          searchPending={screen.movementSearchPending}
          selectedMonth={screen.movementSelectedMonth}
          selectedYear={screen.movementSelectedYear}
        />
      </div>

      <ManualTopUpDialog
        currency={screen.currency}
        errorMessage={screen.createTopUpErrorMessage}
        onClose={screen.closeTopUpDialog}
        onCopy={screen.handleCopy}
        onCreate={() => {
          void screen.handleCreateTopUp();
        }}
        onPaymentChannelChange={screen.setSelectedPaymentChannel}
        onProviderTransferReferenceChange={screen.setProviderTransferReference}
        onTopUpAmountChange={screen.setTopUpAmount}
        open={screen.topUpDialogOpen}
        parsedTopUpAmount={screen.parsedTopUpAmount}
        providerTransferReference={screen.providerTransferReference}
        selectedPaymentChannel={screen.selectedPaymentChannel}
        submitting={screen.createTopUpMutation.loading}
        topUpAmount={screen.topUpAmount}
      />
    </div>
  );
}
