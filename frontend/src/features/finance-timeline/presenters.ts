import type { FinanceTimelineItem } from '@/features/finance-timeline/schema';

export interface FinanceTimelineBadgeMeta {
  label: string;
  badgeClassName: string;
}

export interface FinanceTimelineIdEntry {
  label: string;
  value: string;
}

const neutralBadgeClassName = 'border-border bg-muted text-muted-foreground';
const activeBadgeClassName = 'border-primary/20 bg-primary/10 text-primary';
const successBadgeClassName = 'border-success/20 bg-success/10 text-success';
const warningBadgeClassName = 'border-warning/20 bg-warning/10 text-warning';
const destructiveBadgeClassName = 'border-destructive/20 bg-destructive/10 text-destructive';

const statusMetaMap: Record<string, FinanceTimelineBadgeMeta> = {
  credited: {
    label: 'Creditee',
    badgeClassName: successBadgeClassName,
  },
  reserved: {
    label: 'Reservee',
    badgeClassName: activeBadgeClassName,
  },
  settled: {
    label: 'Reglee',
    badgeClassName: successBadgeClassName,
  },
  posted: {
    label: 'Comptabilisee',
    badgeClassName: activeBadgeClassName,
  },
  failed: {
    label: 'Echouee',
    badgeClassName: destructiveBadgeClassName,
  },
  cancelled: {
    label: 'Annulee',
    badgeClassName: neutralBadgeClassName,
  },
  expired: {
    label: 'Expiree',
    badgeClassName: warningBadgeClassName,
  },
  pending: {
    label: 'En attente',
    badgeClassName: warningBadgeClassName,
  },
  processing: {
    label: 'En traitement',
    badgeClassName: activeBadgeClassName,
  },
  completed: {
    label: 'Finalisee',
    badgeClassName: successBadgeClassName,
  },
  refunded: {
    label: 'Remboursee',
    badgeClassName: neutralBadgeClassName,
  },
};

function humanizeToken(value: string): string {
  const normalized = value.replace(/[_-]+/g, ' ').trim();

  if (!normalized.length) {
    return '--';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getFinanceTimelineStatusMeta(status: string): FinanceTimelineBadgeMeta {
  return (
    statusMetaMap[status] ?? {
      label: humanizeToken(status),
      badgeClassName: neutralBadgeClassName,
    }
  );
}

export function getFinanceTimelineDirectionLabel(direction: string): string {
  switch (direction) {
    case 'credit':
      return 'Credit';
    case 'debit':
      return 'Debit';
    default:
      return humanizeToken(direction);
  }
}

export function isFinanceTimelineCredit(item: FinanceTimelineItem): boolean {
  return item.direction === 'credit';
}

export function getFinanceTimelineTypeLabel(item: FinanceTimelineItem): string {
  if (item.type === 'wallet_top_up') {
    switch (item.status) {
      case 'credited':
        return 'Rechargement credite';
      case 'failed':
        return 'Rechargement echoue';
      case 'cancelled':
        return 'Rechargement annule';
      case 'expired':
        return 'Rechargement expire';
      default:
        return 'Demande de rechargement';
    }
  }

  switch (item.type) {
    case 'wallet_movement':
      return 'Mouvement portefeuille';
    case 'cash_booking':
      return 'Prestation cash';
    case 'booking_payment':
      return 'Paiement reservation';
    case 'payment':
      return 'Paiement';
    case 'refund':
      return 'Remboursement';
    case 'subscription':
      return 'Abonnement';
    default:
      return humanizeToken(item.type);
  }
}

export function getFinanceTimelineCanonicalIdEntries(
  item: FinanceTimelineItem,
): FinanceTimelineIdEntry[] {
  return [
    item.referenceNumber ? { label: 'Reference', value: item.referenceNumber } : null,
    { label: 'Ligne', value: item.id },
    { label: 'Source', value: item.sourceId },
    item.providerId ? { label: 'Provider', value: item.providerId } : null,
    item.patientId ? { label: 'Patient', value: item.patientId } : null,
    item.bookingId ? { label: 'Booking', value: item.bookingId } : null,
    item.paymentId ? { label: 'Payment', value: item.paymentId } : null,
    item.paymentAttemptId ? { label: 'Payment attempt', value: item.paymentAttemptId } : null,
    item.providerWalletTopUpId
      ? { label: 'Wallet top-up', value: item.providerWalletTopUpId }
      : null,
    item.ledgerTransactionId
      ? { label: 'Ledger transaction', value: item.ledgerTransactionId }
      : null,
  ].filter((entry): entry is FinanceTimelineIdEntry => entry !== null);
}

export function getFinanceTimelinePrimaryReference(
  item: FinanceTimelineItem,
): FinanceTimelineIdEntry | null {
  return getFinanceTimelineCanonicalIdEntries(item)[0] ?? null;
}

export function buildFinanceTimelineSearchText(item: FinanceTimelineItem): string {
  return [
    item.title,
    item.description,
    item.referenceNumber,
    item.type,
    item.status,
    item.sourceType,
    ...getFinanceTimelineCanonicalIdEntries(item).map((entry) => entry.value),
  ]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ')
    .toLowerCase();
}

export function matchesFinanceTimelineSearch(item: FinanceTimelineItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery.length) {
    return true;
  }

  return buildFinanceTimelineSearchText(item).includes(normalizedQuery);
}
