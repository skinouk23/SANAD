import { Search } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import { Input } from '@/shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

import type { ProviderTransactionStatusOption } from '@/features/transactions/provider-history/providerTransactionHistory.hooks';

const ALL_TRANSACTION_STATUSES_VALUE = '__all_transaction_statuses__';

export function ProviderTransactionFilters({
  isUpdating,
  searchQuery,
  statusFilter,
  statusOptions,
  onSearchChange,
  onStatusChange,
}: {
  isUpdating: boolean;
  searchQuery: string;
  statusFilter: string;
  statusOptions: ProviderTransactionStatusOption[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      aria-busy={isUpdating || undefined}
      className="mb-4 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
    >
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              type="text"
              placeholder={t.provider.searchByIdPatient}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-8 border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        <Select
          value={statusFilter === 'all' ? ALL_TRANSACTION_STATUSES_VALUE : statusFilter}
          onValueChange={(value) =>
            onStatusChange(value === ALL_TRANSACTION_STATUSES_VALUE ? 'all' : value)
          }
        >
          <SelectTrigger
            aria-label={t.provider.allStatuses}
            className="w-full border-slate-200 bg-white text-sm text-slate-900 transition-all focus:border-cyan-500 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white md:w-auto"
          >
            <SelectValue placeholder={t.provider.allStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL_TRANSACTION_STATUSES_VALUE}>
                {t.provider.allStatuses}
              </SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {isUpdating ? (
        <span
          aria-live="polite"
          className="mt-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
        >
          Mise a jour...
        </span>
      ) : null}
    </div>
  );
}
