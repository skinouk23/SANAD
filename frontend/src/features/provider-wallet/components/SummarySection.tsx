import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Coins,
  Plus,
  Wallet,
} from 'lucide-react';

import { formatCurrency } from '@/shared/lib/i18n/formatting';
import { Skeleton } from '@/shared/ui/composites/loading';
import { Button } from '@/shared/ui/primitives/button';

import type { ProviderWalletStats, ProviderWalletSummary } from '@/features/provider-wallet/schema';

interface ProviderWalletSummarySectionProps {
  currency: string;
  isLowBalance: boolean;
  loading: boolean;
  lowBalanceThreshold: number;
  onPrimaryAction: () => void;
  primaryActionDisabled: boolean;
  primaryActionLabel: string;
  stats: ProviderWalletStats | null;
  statsError?: unknown;
  statsLoading: boolean;
  statsRefreshing: boolean;
  summary: ProviderWalletSummary | null;
  summaryRefreshing: boolean;
}

function formatAmount(value: number, currency: string) {
  return formatCurrency(value, currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function ProviderWalletSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.35fr_0.65fr] md:items-start">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10 animate-pulse space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-4 w-36 rounded bg-white/20" />
              <div className="h-10 w-48 rounded bg-white/20" />
              <div className="h-3 w-72 max-w-full rounded bg-white/15" />
            </div>
            <div className="h-9 w-9 rounded-lg bg-white/20" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-16 w-44 rounded-xl bg-white/15" />
            <div className="h-9 w-full rounded-lg bg-white/80 sm:w-36" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50" />
          <div className="h-10 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

function MonthlyStatsSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
      <Skeleton className="h-3 w-24 rounded" />
      <div className="mt-3 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ProviderWalletSummarySection({
  currency,
  isLowBalance,
  loading,
  lowBalanceThreshold,
  onPrimaryAction,
  primaryActionDisabled,
  primaryActionLabel,
  stats,
  statsError,
  statsLoading,
  statsRefreshing,
  summary,
  summaryRefreshing,
}: ProviderWalletSummarySectionProps) {
  if (loading && !summary) {
    return <ProviderWalletSummarySkeleton />;
  }

  const reservedBalance = summary?.reservedBalance ?? 0;
  const usableBalance = summary?.usableBalance ?? 0;
  const currentMonthDeposits = stats?.currentMonthDeposits ?? 0;
  const currentMonthDeductions = stats?.currentMonthDeductions ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.35fr_0.65fr] md:items-start">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10">
          {summaryRefreshing ? (
            <span className="mb-3 inline-flex rounded-full border border-white/25 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90">
              Mise à jour...
            </span>
          ) : null}

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-cyan-100">
                <Coins className="h-3.5 w-3.5" />
                Solde utilisable
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {formatAmount(usableBalance, currency)}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-cyan-100/90">
                Consultez le solde disponible pour vos prochaines reservations cash.
              </p>
            </div>

            <div className="rounded-lg bg-white/20 p-1.5 backdrop-blur-md">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="mb-0.5 text-[10px] uppercase tracking-wider text-cyan-100">
                  Solde reserve
                </p>
                <p className="flex items-center gap-1.5 text-lg font-bold text-white">
                  {formatAmount(reservedBalance, currency)}
                  <Clock className="h-3.5 w-3.5 text-amber-300" />
                </p>
              </div>

              <div>
                <p className="mb-0.5 text-[10px] uppercase tracking-wider text-cyan-100">Devise</p>
                <p className="font-mono text-base font-bold text-white">{currency}</p>
              </div>
            </div>

            <Button
              className="w-full bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-lg transition-all hover:scale-105 hover:bg-blue-50 hover:text-blue-600 sm:w-auto disabled:hover:scale-100"
              disabled={primaryActionDisabled}
              onClick={onPrimaryAction}
              variant="ghost"
            >
              <Plus className="h-4 w-4" />
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLowBalance ? (
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 shadow-sm backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <h3 className="text-xs font-bold text-red-500">Seuil de portefeuille atteint</h3>
                <p className="mt-0.5 text-[10px] leading-5 text-red-600 dark:text-red-300">
                  Le solde utilisable est inferieur au seuil de{' '}
                  {formatAmount(lowBalanceThreshold, currency)}. Pensez a lancer un rechargement
                  pour eviter le blocage des futures reservations cash.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {statsLoading && !stats ? (
          <MonthlyStatsSkeleton />
        ) : statsError && !stats ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-700 shadow-sm backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Les statistiques mensuelles sont indisponibles pour le moment.
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ce mois-ci
              </h3>
              {statsRefreshing ? (
                <span className="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                  Mise à jour...
                </span>
              ) : null}
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Dépôts</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Total du mois</p>
                  </div>
                </div>

                <span className="text-sm font-bold text-green-500">
                  +{formatAmount(currentMonthDeposits, currency)}
                </span>
              </div>

              <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Déductions</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Total du mois</p>
                  </div>
                </div>

                <span className="text-sm font-bold text-red-500">
                  -{formatAmount(currentMonthDeductions, currency)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
