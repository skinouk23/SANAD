import { Download } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers';
import { useLanguage } from '@/shared/lib/i18n/language-context';

export function ProviderTransactionHistoryHeader() {
  const { t } = useLanguage();

  return (
    <ProviderRouteHeader containerClassName="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
      <div>
        <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
          {t.provider.finances}
        </p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {t.provider.myTransactions}
        </h1>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          {t.provider.paymentHistory}
        </p>
      </div>
      <button
        type="button"
        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-all hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:border-cyan-500/50 dark:hover:bg-slate-700 dark:hover:text-cyan-300"
        title={t.provider.export}
      >
        <Download className="h-4 w-4" />
      </button>
    </ProviderRouteHeader>
  );
}
