import type { LoaderFunctionArgs } from 'react-router-dom';

import { pastBookingsOptions } from '@/features/bookings';
import { myProviderProfileOptions } from '@/features/providers';
import {
  providerWalletStatsOptions,
  providerWalletSummaryOptions,
} from '@/features/provider-wallet';
import { queryClient } from '@/shared/lib/query/client';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import { useProviderBillingScreen } from './providerBilling.hooks';
import {
  BillingErrorState,
  BillingExpensesPanel,
  BillingInvoicesPanel,
  BillingLoadingState,
  BillingPageHeader,
  BillingPeriodSelector,
  BillingReportsPanel,
  BillingSummaryCards,
  BillingTabs,
  BillingTaxBanner,
  ExpenseDetailModal,
  InvoiceDetailModal,
  SelectOperationModal,
} from './providerBilling.sections';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  await Promise.all([
    queryClient.prefetchQuery(pastBookingsOptions()),
    queryClient.prefetchQuery(myProviderProfileOptions()),
    queryClient.prefetchQuery(providerWalletSummaryOptions()),
    queryClient.prefetchQuery(providerWalletStatsOptions()),
  ]);
  return null;
};

export function Billing() {
  const screen = useProviderBillingScreen();

  if (screen.loading) {
    return <BillingLoadingState />;
  }

  if (screen.error && !screen.hasRenderableData) {
    return (
      <BillingErrorState
        message={getApiErrorMessage(
          screen.error,
          'Impossible de charger les donnees de facturation pour le moment.',
        )}
        onRetry={screen.refetchAll}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <BillingPageHeader
          exportBusy={screen.exportBusy}
          onCreateOperation={() => screen.setShowSelectOperationModal(true)}
          onExport={screen.handleHeaderExport}
          onExportPreload={screen.preloadPdfModule}
        />
        <BillingPeriodSelector
          period={screen.period}
          periodLabel={screen.periodRangeLabel}
          onChange={screen.setPeriod}
        />
        <BillingSummaryCards summary={screen.summarySnapshot} />
        <BillingTabs
          activeTab={screen.activeTab}
          counts={{ invoices: screen.invoices.length, expenses: screen.expenses.length }}
          onChange={screen.setActiveTab}
        />

        {screen.activeTab === 'invoices' ? (
          <BillingInvoicesPanel
            exportBusy={screen.exportBusy}
            exportingInvoiceId={screen.exportingInvoiceId}
            invoices={screen.filteredInvoices}
            searchQuery={screen.invoiceSearchQuery}
            onSearchChange={screen.setInvoiceSearchQuery}
            onDownload={(invoice) => void screen.generateInvoicePDF(invoice)}
            onExportPreload={screen.preloadPdfModule}
            onOpen={screen.setInvoiceDetail}
          />
        ) : null}
        {screen.activeTab === 'expenses' ? (
          <BillingExpensesPanel
            expenses={screen.expenses}
            emptyMessage={screen.expensesUnavailableMessage}
            onOpen={screen.setExpenseDetail}
          />
        ) : null}
        {screen.activeTab === 'reports' ? (
          <BillingReportsPanel
            exportBusy={screen.exportBusy}
            exportingDocumentKey={screen.exportingDocumentKey}
            periodLabel={screen.periodLabel}
            onBalance={() => void screen.generateBilanPDF()}
            onCnss={() => void screen.generateCNSSPDF()}
            onExportPreload={screen.preloadPdfModule}
            onLedger={() => void screen.generateLivreRecettesPDF()}
            onTva={() => void screen.generateTVAPDF()}
          />
        ) : null}

        <BillingTaxBanner />
      </div>

      <SelectOperationModal
        additionalNotes={screen.additionalNotes}
        completedAppointments={screen.completedAppointments}
        exportBusy={screen.exportBusy}
        onClose={screen.closeSelectOperationModal}
        onGenerate={() => void screen.handleGenerateInvoice()}
        onExportPreload={screen.preloadPdfModule}
        onNotesChange={screen.setAdditionalNotes}
        onSelect={screen.setSelectedOperation}
        open={screen.showSelectOperationModal}
        selectedOperation={screen.selectedOperation}
      />
      <InvoiceDetailModal
        exportBusy={screen.exportBusy}
        invoice={screen.invoiceDetail}
        onClose={() => screen.setInvoiceDetail(null)}
        onDownload={(invoice) => void screen.generateInvoicePDF(invoice)}
        onExportPreload={screen.preloadPdfModule}
      />
      <ExpenseDetailModal
        expense={screen.expenseDetail}
        onClose={() => screen.setExpenseDetail(null)}
      />
    </div>
  );
}
