import { ArrowDownLeft, ArrowUpRight, Copy, RefreshCcw } from 'lucide-react';

import {
  getProviderWalletLedgerDirectionMeta,
  getProviderWalletLedgerEntryTypeMeta,
} from '@/features/provider-wallet/presenters';
import { formatCurrency, formatDateTime } from '@/shared/lib/i18n/formatting';
import { Button } from '@/shared/ui/primitives/button';
import { SkeletonCompactList } from '@/shared/ui/composites/loading';

import type { ProviderWalletLedgerEntry } from '@/features/provider-wallet/schema';

interface ProviderWalletLedgerSectionProps {
  error: unknown;
  ledger: ProviderWalletLedgerEntry[];
  loading: boolean;
  onCopy: (value: string, successMessage?: string) => void;
  onRetry: () => void;
}

function formatAmount(value: number, currency: string) {
  return formatCurrency(value, currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function LedgerCard({
  entry,
  onCopy,
}: {
  entry: ProviderWalletLedgerEntry;
  onCopy: (value: string, successMessage?: string) => void;
}) {
  const directionMeta = getProviderWalletLedgerDirectionMeta(entry.direction);
  const typeMeta = getProviderWalletLedgerEntryTypeMeta(entry.entryType);
  const amountClassName = entry.direction === 'credit' ? 'text-success' : 'text-destructive';

  return (
    <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${typeMeta.badgeClassName}`}
            >
              {typeMeta.label}
            </span>
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${directionMeta.badgeClassName}`}
            >
              {directionMeta.label}
            </span>
          </div>

          <p className="mt-3 text-sm font-semibold text-foreground">{entry.description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Enregistre le {formatDateTime(entry.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          {entry.direction === 'credit' ? (
            <ArrowUpRight className="h-4 w-4 text-success" />
          ) : (
            <ArrowDownLeft className="h-4 w-4 text-destructive" />
          )}
          <span className={`text-lg font-bold ${amountClassName}`}>
            {entry.direction === 'credit' ? '+' : '-'}
            {formatAmount(entry.amount, entry.currency)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-muted p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Reference
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-foreground">
                {entry.reference}
              </p>
            </div>

            <button
              className="text-primary transition-colors hover:text-primary/80"
              onClick={() => onCopy(entry.reference, 'Reference du ledger copiee.')}
              type="button"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl border border-border bg-muted p-3 text-xs text-muted-foreground">
          <p>
            Solde utilisable: {formatAmount(entry.currentBalanceBefore, entry.currency)} to{' '}
            <strong>{formatAmount(entry.currentBalanceAfter, entry.currency)}</strong>
          </p>
          <p>
            Solde reserve: {formatAmount(entry.reservedBalanceBefore, entry.currency)} to{' '}
            <strong>{formatAmount(entry.reservedBalanceAfter, entry.currency)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProviderWalletLedgerSection({
  error,
  ledger,
  loading,
  onCopy,
  onRetry,
}: ProviderWalletLedgerSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Ledger du portefeuille</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Historique immuable des credits, reservations, debits et ajustements.
          </p>
        </div>

        {error ? (
          <Button onClick={onRetry} size="sm" variant="outline">
            <RefreshCcw className="h-4 w-4" />
            Recharger
          </Button>
        ) : null}
      </div>

      <div className="mt-4 max-h-[48rem] space-y-3 overflow-y-auto pr-1">
        {loading && ledger.length === 0 ? <SkeletonCompactList items={4} /> : null}

        {!loading && error && ledger.length === 0 ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Impossible de charger le ledger du portefeuille pour le moment.
          </div>
        ) : null}

        {!loading && !error && ledger.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            Aucun mouvement de ledger enregistre pour l instant.
          </div>
        ) : null}

        {ledger.map((entry) => (
          <LedgerCard entry={entry} key={entry.id} onCopy={onCopy} />
        ))}
      </div>
    </section>
  );
}
