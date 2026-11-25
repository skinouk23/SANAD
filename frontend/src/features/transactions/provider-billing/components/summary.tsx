import { Clock, DollarSign, FileText, TrendingUp, Wallet } from 'lucide-react';

import type { ProviderBillingSummary } from '@/features/transactions/provider-billing/providerBilling.hooks';
import { formatCurrency } from '@/shared/lib/i18n/formatting';

export function BillingSummaryCards({ summary }: { summary: ProviderBillingSummary }) {
  const currency = summary.currency;
  const cards = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(summary.revenue, currency, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
      sub: `${summary.invoiceCount} factures`,
      tone: 'green',
      icon: TrendingUp,
    },
    {
      label: 'Montant en attente',
      value: formatCurrency(summary.pendingAmount, currency, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
      sub: `${summary.pendingCount} factures en attente`,
      tone: 'amber',
      icon: Clock,
    },
    {
      label: 'Solde utilisable',
      value: formatCurrency(summary.usableBalance, currency, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
      sub: 'Disponible pour reservations cash',
      tone: 'blue',
      icon: Wallet,
    },
    {
      label: 'Depots du mois',
      value: formatCurrency(summary.currentMonthDeposits, currency, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }),
      sub: `${formatCurrency(summary.currentMonthDeductions, currency, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} en deductions`,
      tone: 'red',
      icon: DollarSign,
    },
  ];

  const tones: Record<string, string> = {
    green: 'border-success/20 bg-success/10 text-success',
    red: 'border-destructive/20 bg-destructive/10 text-destructive',
    blue: 'border-primary/20 bg-primary/10 text-primary',
    amber: 'border-warning/20 bg-warning/10 text-warning',
  };

  const iconTones: Record<string, string> = {
    green: 'bg-success/10 text-success',
    red: 'bg-destructive/10 text-destructive',
    blue: 'bg-primary/10 text-primary',
    amber: 'bg-warning/10 text-warning',
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-4 ${tones[card.tone]}`}>
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl ${iconTones[card.tone]}`}
            >
              <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
          <p className="mb-1 text-xs font-medium sm:text-sm">{card.label}</p>
          <p className="text-xl font-bold sm:text-2xl lg:text-3xl">{card.value}</p>
          <p className="mt-1 text-xs">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function BillingTabs({
  activeTab,
  counts,
  onChange,
}: {
  activeTab: 'invoices' | 'expenses' | 'reports';
  counts: { invoices: number; expenses: number };
  onChange: (tab: 'invoices' | 'expenses' | 'reports') => void;
}) {
  const tabs = [
    {
      key: 'invoices' as const,
      label: `Factures (${counts.invoices})`,
      mobile: `(${counts.invoices})`,
      icon: FileText,
    },
    {
      key: 'expenses' as const,
      label: `Dépenses (${counts.expenses})`,
      mobile: `(${counts.expenses})`,
      icon: DollarSign,
    },
    { key: 'reports' as const, label: 'Rapports', mobile: 'Rap.', icon: TrendingUp },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative flex-1 px-3 py-3 text-xs font-semibold transition-colors sm:px-6 sm:py-4 sm:text-base ${activeTab === tab.key ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            <tab.icon className="inline-block h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.mobile}</span>
            {activeTab === tab.key ? (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
