import { Calendar, DollarSign, User } from 'lucide-react';

import { getBookingPaymentDisplay } from '@/features/bookings';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { formatCurrency, formatDateTime } from '@/shared/lib/i18n/formatting';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton } from '@/shared/ui/composites/loading';

import type {
  ProviderPaymentHistoryItem,
  ProviderPaymentHistoryStatus,
} from '@/features/transactions/provider-history/schema';

function getProviderPaymentStatusBadgeClass(status: ProviderPaymentHistoryStatus): string {
  switch (status) {
    case 'settled':
      return 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400';
    case 'pending':
    case 'reserved':
    case 'expired':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'processing':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400';
    case 'failed':
      return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
    case 'cancelled':
      return 'border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400';
    default:
      return 'border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400';
  }
}

function ProviderTransactionCard({ transaction }: { transaction: ProviderPaymentHistoryItem }) {
  const { t } = useLanguage();
  const paymentDisplay = getBookingPaymentDisplay({
    paymentMethod: transaction.paymentMethod,
    paymentReferenceNumber: transaction.paymentReferenceNumber,
    paymentStatus: transaction.status,
  });
  const formattedDate = formatDateTime(transaction.createdAt, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const amountLabel = formatCurrency(transaction.amount, transaction.currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const commissionLabel = formatCurrency(transaction.commission, transaction.currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const netAmountLabel = formatCurrency(transaction.netAmount, transaction.currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const patientName = transaction.patientName.trim().length ? transaction.patientName : 'Patient';
  const serviceName = transaction.serviceName.trim().length ? transaction.serviceName : 'Service';
  const referenceLabel =
    transaction.paymentReferenceNumber ?? transaction.bookingNumber ?? transaction.id;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/50 lg:p-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 sm:text-xs">
              {transaction.bookingNumber}
            </span>
            <span
              className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${getProviderPaymentStatusBadgeClass(transaction.status)}`}
            >
              {paymentDisplay.statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <User className="h-3 w-3" />
            </div>
            <span className="text-xs font-semibold sm:text-sm">{patientName}</span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <span className="text-slate-600 dark:text-slate-300">{serviceName}</span>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
            {paymentDisplay.methodLabel}
            {referenceLabel ? ` | ${referenceLabel}` : ''}
          </div>
        </div>

        <div className="space-y-0.5 lg:min-w-[190px] lg:text-right">
          <div className="flex items-baseline gap-1 lg:justify-end">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
              {t.provider.amount}:
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
              {amountLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-1 lg:justify-end">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
              {t.provider.commission}:
            </span>
            <span className="text-[10px] font-semibold text-red-500 sm:text-xs">
              -{commissionLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-1 border-t border-slate-200 pt-0.5 dark:border-slate-700 lg:justify-end">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
              {t.provider.net}:
            </span>
            <span className="text-sm font-bold text-green-500 sm:text-base">{netAmountLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderTransactionCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 lg:p-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="flex items-center gap-1.5">
            <Skeleton className="h-6 w-6 flex-shrink-0 rounded-md" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
            <Skeleton className="h-3 w-20 rounded" />
          </div>

          <Skeleton className="h-3 w-44 max-w-full rounded" />
        </div>

        <div className="space-y-0.5 lg:min-w-[190px] lg:text-right">
          <div className="flex items-baseline gap-1 lg:justify-end">
            <Skeleton className="h-3 w-12 rounded" />
            <Skeleton className="h-3.5 w-20 rounded" />
          </div>

          <div className="flex items-baseline gap-1 lg:justify-end">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>

          <div className="flex items-baseline gap-1 border-t border-slate-200 pt-0.5 dark:border-slate-700 lg:justify-end">
            <Skeleton className="h-3 w-8 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderTransactionCardSkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <ProviderTransactionCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProviderTransactionsList({
  emptyHint,
  isUpdating,
  loading,
  transactions,
}: {
  emptyHint: string;
  isUpdating: boolean;
  loading: boolean;
  transactions: ProviderPaymentHistoryItem[];
}) {
  if (loading) {
    return <ProviderTransactionCardSkeletonList />;
  }

  if (!transactions.length) {
    return (
      <EmptyState
        className="rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 [&_h3]:text-slate-700 dark:[&_h3]:text-slate-300 [&_p]:text-slate-500"
        icon={<DollarSign className="h-8 w-8 text-cyan-500/80 dark:text-cyan-400/70" />}
        title="Aucune transaction trouvee"
        description={emptyHint}
      />
    );
  }

  return (
    <div aria-busy={isUpdating || undefined} className="space-y-3">
      {isUpdating ? (
        <span
          aria-live="polite"
          className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
        >
          Mise a jour...
        </span>
      ) : null}
      {transactions.map((transaction) => (
        <ProviderTransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
