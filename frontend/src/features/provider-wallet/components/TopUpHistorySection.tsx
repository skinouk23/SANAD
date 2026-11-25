import { ArrowUpFromLine, Clock3, Copy, RefreshCcw } from 'lucide-react';

import {
  getProviderWalletPaymentChannelLabel,
  getProviderWalletTopUpStatusMeta,
} from '@/features/provider-wallet/presenters';
import { formatCurrency, formatDateTime } from '@/shared/lib/i18n/formatting';
import { Button } from '@/shared/ui/primitives/button';
import { SkeletonCompactList } from '@/shared/ui/composites/loading';

import type { ProviderWalletTopUpRequest } from '@/features/provider-wallet/schema';

interface ProviderWalletTopUpHistorySectionProps {
  error: unknown;
  loading: boolean;
  onCopy: (value: string, successMessage?: string) => void;
  onRetry: () => void;
  topUps: ProviderWalletTopUpRequest[];
}

function formatAmount(value: number, currency: string) {
  return formatCurrency(value, currency, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function getTopUpFinalEventLabel(topUp: ProviderWalletTopUpRequest): string | null {
  if (topUp.creditedAt) {
    return `Credite le ${formatDateTime(topUp.creditedAt)}`;
  }

  if (topUp.failedAt) {
    return `Echoue le ${formatDateTime(topUp.failedAt)}`;
  }

  if (topUp.cancelledAt) {
    return `Annulee le ${formatDateTime(topUp.cancelledAt)}`;
  }

  return null;
}

function TopUpCard({
  onCopy,
  topUp,
}: {
  onCopy: (value: string, successMessage?: string) => void;
  topUp: ProviderWalletTopUpRequest;
}) {
  const statusMeta = getProviderWalletTopUpStatusMeta(topUp.status);
  const finalEventLabel = getTopUpFinalEventLabel(topUp);

  return (
    <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{topUp.topUpNumber}</h3>
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusMeta.badgeClassName}`}
            >
              {statusMeta.label}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatAmount(topUp.amount, topUp.currency)}
          </p>
          {statusMeta.hint ? (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{statusMeta.hint}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
          <p>Canal: {getProviderWalletPaymentChannelLabel(topUp.paymentChannel)}</p>
          <p className="mt-1">Demandee le {formatDateTime(topUp.requestedAt)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-muted p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Reference plateforme
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-foreground">
                {topUp.platformReference}
              </p>
            </div>
            <button
              className="text-primary transition-colors hover:text-primary/80"
              onClick={() => onCopy(topUp.platformReference, 'Reference plateforme copiee.')}
              type="button"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {topUp.providerTransferReference ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Ref prestataire: <strong>{topUp.providerTransferReference}</strong>
            </p>
          ) : null}
        </div>

        <div className="space-y-2 rounded-2xl border border-border bg-muted p-3 text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
            Expire le {formatDateTime(topUp.expiresAt)}
          </p>
          {topUp.markedTransferredAt ? (
            <p className="flex items-start gap-2">
              <ArrowUpFromLine className="mt-0.5 h-4 w-4 text-muted-foreground" />
              Transfert declare le {formatDateTime(topUp.markedTransferredAt)}
            </p>
          ) : null}
          {finalEventLabel ? <p>{finalEventLabel}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ProviderWalletTopUpHistorySection({
  error,
  loading,
  onCopy,
  onRetry,
  topUps,
}: ProviderWalletTopUpHistorySectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Historique des demandes de rechargement
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les demandes de rechargement historisees et leurs references.
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
        {loading && topUps.length === 0 ? <SkeletonCompactList items={3} /> : null}

        {!loading && error && topUps.length === 0 ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Impossible de charger les demandes de rechargement pour le moment.
          </div>
        ) : null}

        {!loading && !error && topUps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            Aucune demande de rechargement pour l instant.
          </div>
        ) : null}

        {topUps.map((topUp) => (
          <TopUpCard key={topUp.id} onCopy={onCopy} topUp={topUp} />
        ))}
      </div>
    </section>
  );
}
