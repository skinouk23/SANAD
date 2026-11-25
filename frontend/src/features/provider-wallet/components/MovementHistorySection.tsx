import { useMemo } from 'react';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  History,
  RefreshCcw,
  Search,
} from 'lucide-react';

import {
  getProviderWalletMovementStatusMeta,
  getProviderWalletPaymentChannelLabel,
} from '@/features/provider-wallet/presenters';
import { formatCurrency, formatDateTime } from '@/shared/lib/i18n/formatting';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonTransactionTableRows } from '@/shared/ui/composites/loading';
import { Alert, AlertDescription } from '@/shared/ui/primitives/alert';
import { Badge } from '@/shared/ui/primitives/badge';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { Pagination, PaginationContent, PaginationItem } from '@/shared/ui/primitives/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { Separator } from '@/shared/ui/primitives/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/primitives/table';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/primitives/toggle-group';

import type {
  ProviderWalletMovement,
  ProviderWalletMovementType,
} from '@/features/provider-wallet/schema';
import type { PaginationMetadata } from '@/shared/schemas';

const MOVEMENT_MONTHS = [
  { value: '0', label: 'Janvier' },
  { value: '1', label: 'Février' },
  { value: '2', label: 'Mars' },
  { value: '3', label: 'Avril' },
  { value: '4', label: 'Mai' },
  { value: '5', label: 'Juin' },
  { value: '6', label: 'Juillet' },
  { value: '7', label: 'Août' },
  { value: '8', label: 'Septembre' },
  { value: '9', label: 'Octobre' },
  { value: '10', label: 'Novembre' },
  { value: '11', label: 'Décembre' },
];

const DEFAULT_ITEMS_PER_PAGE = 10;
const ALL_MOVEMENT_MONTHS_VALUE = '__all_movement_months__';
const ALL_MOVEMENT_YEARS_VALUE = '__all_movement_years__';

interface ProviderWalletMovementHistorySectionProps {
  availableYears: number[];
  error: unknown;
  filterType: ProviderWalletMovementType | 'all';
  isFetching: boolean;
  loading: boolean;
  movements: ProviderWalletMovement[];
  onCopy: (value: string, successMessage?: string) => void;
  onFilterTypeChange: (value: ProviderWalletMovementType | 'all') => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onSearchQueryChange: (value: string) => void;
  onSelectedMonthChange: (value: string) => void;
  onSelectedYearChange: (value: string) => void;
  pagination: PaginationMetadata | null;
  searchQuery: string;
  searchPending: boolean;
  selectedMonth: string;
  selectedYear: string;
}

interface ProviderWalletMovementRecord {
  isDeposit: boolean;
  movement: ProviderWalletMovement;
}

function formatAmount(value: number, currency: string) {
  return formatCurrency(value, currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function getMovementSourceLabel(movement: ProviderWalletMovement): string {
  if (movement.sourceType === 'topup_request') {
    return 'Demande de rechargement';
  }

  return 'Mouvement finalise du portefeuille';
}

function MovementRow({
  onCopy,
  record,
}: {
  onCopy: (value: string, successMessage?: string) => void;
  record: ProviderWalletMovementRecord;
}) {
  const { isDeposit, movement } = record;
  const statusMeta = getProviderWalletMovementStatusMeta(movement.status);
  const amountClassName = isDeposit ? 'text-green-500' : 'text-red-500';

  return (
    <TableRow className="border-slate-200 align-top hover:bg-slate-50/80 dark:border-slate-700/50 dark:hover:bg-slate-900/30">
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${isDeposit ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          >
            {isDeposit ? (
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div>
            <p className={`text-xs font-medium ${amountClassName}`}>
              {isDeposit ? 'Dépôt' : 'Déduction'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {getMovementSourceLabel(movement)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 whitespace-normal">
        <p className="text-xs font-medium text-slate-900 dark:text-white">{movement.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
          {movement.topUpNumber ? <span>{movement.topUpNumber}</span> : null}
          {movement.paymentChannel ? (
            <span>{getProviderWalletPaymentChannelLabel(movement.paymentChannel)}</span>
          ) : null}
          {movement.providerTransferReference ? (
            <span>Ref transfert: {movement.providerTransferReference}</span>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="font-mono">Ref: {movement.reference}</span>
          <button
            className="inline-flex items-center gap-1 text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            onClick={() => onCopy(movement.reference, 'Reference copiee.')}
            type="button"
          >
            <Copy className="h-3 w-3" />
            Copier
          </button>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
        {formatDateTime(movement.occurredAt, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </TableCell>
      <TableCell className="px-4 py-3">
        <Badge variant="outline" className={statusMeta.badgeClassName}>
          {statusMeta.label}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 text-right">
        <span className={`text-sm font-bold ${amountClassName}`}>
          {isDeposit ? '+' : '-'}
          {formatAmount(movement.amount, movement.currency)}
        </span>
      </TableCell>
    </TableRow>
  );
}

function MovementCard({
  onCopy,
  record,
}: {
  onCopy: (value: string, successMessage?: string) => void;
  record: ProviderWalletMovementRecord;
}) {
  const { isDeposit, movement } = record;
  const statusMeta = getProviderWalletMovementStatusMeta(movement.status);
  const amountClassName = isDeposit ? 'text-green-500' : 'text-red-500';

  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${isDeposit ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          >
            {isDeposit ? (
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div>
            <p className={`text-xs font-medium ${amountClassName}`}>
              {isDeposit ? 'Dépôt' : 'Déduction'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {getMovementSourceLabel(movement)}
            </p>
          </div>
        </div>

        <span className={`text-sm font-bold ${amountClassName}`}>
          {isDeposit ? '+' : '-'}
          {formatAmount(movement.amount, movement.currency)}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs font-medium text-slate-900 dark:text-white">{movement.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
          {movement.topUpNumber ? <span>{movement.topUpNumber}</span> : null}
          {movement.paymentChannel ? (
            <span>{getProviderWalletPaymentChannelLabel(movement.paymentChannel)}</span>
          ) : null}
          {movement.providerTransferReference ? (
            <span>Ref transfert: {movement.providerTransferReference}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span>{formatDateTime(movement.occurredAt)}</span>
          <span className="font-mono">Ref: {movement.reference}</span>
          <button
            className="inline-flex items-center gap-1 text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            onClick={() => onCopy(movement.reference, 'Reference copiee.')}
            type="button"
          >
            <Copy className="h-3 w-3" />
            Copier
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="outline" className={statusMeta.badgeClassName}>
          {statusMeta.label}
        </Badge>
      </div>
    </div>
  );
}

function MovementCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="mb-1.5 h-3 w-14 rounded" />
            <Skeleton className="h-2.5 w-32 rounded" />
          </div>
        </div>

        <Skeleton className="h-4 w-24 rounded" />
      </div>

      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-48 max-w-full rounded" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-2.5 w-20 rounded" />
          <Skeleton className="h-2.5 w-24 rounded" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-2.5 w-28 rounded" />
          <Skeleton className="h-2.5 w-32 rounded" />
          <Skeleton className="h-2.5 w-12 rounded" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

function MovementCardSkeletonList({ items }: { items: number }) {
  return (
    <>
      {Array.from({ length: items }).map((_, index) => (
        <MovementCardSkeleton key={index} />
      ))}
    </>
  );
}

export function ProviderWalletMovementHistorySection({
  availableYears,
  error,
  filterType,
  isFetching,
  loading,
  movements,
  onCopy,
  onFilterTypeChange,
  onPageChange,
  onRetry,
  onSearchQueryChange,
  onSelectedMonthChange,
  onSelectedYearChange,
  pagination,
  searchQuery,
  searchPending,
  selectedMonth,
  selectedYear,
}: ProviderWalletMovementHistorySectionProps) {
  const records = useMemo<ProviderWalletMovementRecord[]>(() => {
    return [...movements]
      .sort(
        (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
      )
      .map((movement) => ({
        isDeposit: movement.type === 'deposit',
        movement,
      }));
  }, [movements]);

  const currentPage = pagination?.page ?? 1;
  const totalItems = pagination?.total ?? movements.length;
  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
  const itemsPerPage = pagination?.limit ?? DEFAULT_ITEMS_PER_PAGE;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(startItem + movements.length - 1, totalItems);
  const isUpdating = searchPending || (isFetching && !loading);

  return (
    <section
      aria-busy={isUpdating || undefined}
      className="overflow-hidden border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700/50">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900 dark:text-white">
              <History className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Historique des mouvements
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Les reservations actives restent dans le solde reserve, sans apparaitre dans cette
              liste.
            </p>
            {isUpdating ? (
              <span
                aria-live="polite"
                className="mt-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
              >
                {searchPending ? 'Recherche en cours...' : 'Mise a jour...'}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <Select
              onValueChange={(value) =>
                onSelectedMonthChange(value === ALL_MOVEMENT_MONTHS_VALUE ? 'all' : value)
              }
              value={selectedMonth === 'all' ? ALL_MOVEMENT_MONTHS_VALUE : selectedMonth}
            >
              <SelectTrigger
                aria-label="Filtrer par mois"
                className="w-full border-slate-200 bg-white text-slate-900 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 sm:w-auto dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
              >
                <SelectValue placeholder="Tous les mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL_MOVEMENT_MONTHS_VALUE}>Tous les mois</SelectItem>
                  {MOVEMENT_MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                onSelectedYearChange(value === ALL_MOVEMENT_YEARS_VALUE ? 'all' : value)
              }
              value={selectedYear === 'all' ? ALL_MOVEMENT_YEARS_VALUE : selectedYear}
            >
              <SelectTrigger
                aria-label="Filtrer par annee"
                className="w-full border-slate-200 bg-white text-slate-900 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 sm:w-auto dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
              >
                <SelectValue placeholder="Toutes les annees" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL_MOVEMENT_YEARS_VALUE}>Toutes les annees</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {error ? (
              <Button
                className="border-slate-200 bg-white text-slate-600 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:text-cyan-400"
                onClick={onRetry}
                size="sm"
                variant="outline"
              >
                <RefreshCcw className="h-4 w-4" />
                Recharger
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                className="h-8 border-slate-200 bg-white pl-8 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder="Rechercher par description, reference ou numero"
                type="text"
                value={searchQuery}
              />
            </div>

            <ToggleGroup
              aria-label="Filtrer les mouvements"
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50 max-[520px]:col-span-2 max-[520px]:w-full max-[520px]:justify-stretch"
              onValueChange={(value) => {
                if (value) {
                  onFilterTypeChange(value as ProviderWalletMovementType | 'all');
                }
              }}
              size="sm"
              type="single"
              value={filterType}
            >
              {[
                { key: 'all', label: 'Tout' },
                { key: 'deposit', label: 'Dépôts' },
                { key: 'deduction', label: 'Déductions' },
              ].map((item) => (
                <ToggleGroupItem
                  className="rounded-full px-3 text-[10px] text-slate-500 hover:text-slate-900 data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-sm dark:text-slate-400 dark:hover:text-white dark:data-[state=on]:bg-slate-700 dark:data-[state=on]:text-white max-[520px]:flex-1"
                  key={item.key}
                  value={item.key}
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Table className="text-left">
          <TableHeader className="text-[10px] uppercase tracking-wider">
            <TableRow className="!border-slate-200 !bg-slate-50 hover:!bg-slate-50 dark:!border-slate-700/50 dark:!bg-slate-900/50 dark:hover:!bg-slate-900/50">
              <TableHead className="px-4 py-3 text-slate-500 dark:text-slate-400">Type</TableHead>
              <TableHead className="px-4 py-3 text-slate-500 dark:text-slate-400">
                Details
              </TableHead>
              <TableHead className="px-4 py-3 text-slate-500 dark:text-slate-400">Date</TableHead>
              <TableHead className="px-4 py-3 text-slate-500 dark:text-slate-400">Statut</TableHead>
              <TableHead className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                Montant
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && movements.length === 0 ? (
              <SkeletonTransactionTableRows
                className="bg-white/80 dark:bg-slate-800/50"
                rows={itemsPerPage}
              />
            ) : (
              records.map((record) => (
                <MovementRow
                  key={`${record.movement.sourceType}-${record.movement.id}`}
                  onCopy={onCopy}
                  record={record}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {loading && movements.length === 0 ? (
          <MovementCardSkeletonList items={itemsPerPage} />
        ) : (
          records.map((record) => (
            <MovementCard
              key={`${record.movement.sourceType}-${record.movement.id}`}
              onCopy={onCopy}
              record={record}
            />
          ))
        )}
      </div>

      {!loading && error && movements.length === 0 ? (
        <>
          <Separator />
          <div className="p-4">
            <Alert className="border-red-200 bg-red-50/80 text-red-600 backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <AlertDescription className="text-red-600 dark:text-red-300">
                Impossible de charger l historique des mouvements pour le moment.
              </AlertDescription>
            </Alert>
          </div>
        </>
      ) : null}

      {!loading && !error && movements.length === 0 ? (
        <>
          <Separator />
          <div className="p-4 sm:p-8">
            <EmptyState
              className="border-0 bg-transparent px-0 py-4 text-slate-500 dark:text-slate-400"
              description="Essayez de modifier vos filtres ou votre recherche."
              icon={<Search className="h-6 w-6" />}
              title="Aucun mouvement trouve"
            />
          </div>
        </>
      ) : null}

      {totalItems > 0 ? (
        <>
          <Separator />
          <div className="flex items-center justify-between bg-slate-50 p-3 dark:bg-slate-800/80">
            <div className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Affichage de{' '}
              <span className="font-medium text-slate-900 dark:text-white">{startItem}</span> a{' '}
              <span className="font-medium text-slate-900 dark:text-white">{endItem}</span> sur{' '}
              <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
              Page {currentPage} / {totalPages}
            </div>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    aria-label="Page precedente"
                    className="border-slate-200 bg-white text-slate-600 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:text-cyan-400"
                    disabled={isFetching || currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    aria-label="Page suivante"
                    className="border-slate-200 bg-white text-slate-600 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:text-cyan-400"
                    disabled={isFetching || currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : null}
    </section>
  );
}
