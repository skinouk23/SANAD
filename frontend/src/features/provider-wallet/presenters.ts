import { providerWalletManualTopUpConfig } from '@/features/provider-wallet/manualTopUp.config';

import type {
  ProviderWalletMovementStatus,
  ProviderWalletLedgerDirection,
  ProviderWalletLedgerEntryType,
  ProviderWalletPaymentChannel,
  ProviderWalletTopUpStatus,
} from '@/features/provider-wallet/schema';

interface ProviderWalletBadgeMeta {
  label: string;
  badgeClassName: string;
  hint?: string;
}

const topUpStatusMeta: Record<ProviderWalletTopUpStatus, ProviderWalletBadgeMeta> = {
  credited: {
    label: 'Credite',
    badgeClassName: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    hint: 'Le montant a ete ajoute au portefeuille.',
  },
  failed: {
    label: 'Echoue',
    badgeClassName: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    hint: 'Le rechargement n a pas pu etre traite.',
  },
  cancelled: {
    label: 'Annule',
    badgeClassName:
      'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
    hint: 'La demande a ete annulee.',
  },
  expired: {
    label: 'Expire',
    badgeClassName: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    hint: 'La demande a expire.',
  },
};

const ledgerEntryTypeMeta: Record<ProviderWalletLedgerEntryType, ProviderWalletBadgeMeta> = {
  topup_credit: {
    label: 'Credit de rechargement',
    badgeClassName: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  },
  cash_booking_hold: {
    label: 'Reservation cash',
    badgeClassName: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  cash_booking_hold_release: {
    label: 'Liberation de reservation',
    badgeClassName: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  cash_booking_debit: {
    label: 'Debit prestation cash',
    badgeClassName: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  },
  admin_adjustment_credit: {
    label: 'Ajustement admin +',
    badgeClassName: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  },
  admin_adjustment_debit: {
    label: 'Ajustement admin -',
    badgeClassName: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  },
  topup_reversal: {
    label: 'Reversal de rechargement',
    badgeClassName: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
};

const ledgerDirectionMeta: Record<ProviderWalletLedgerDirection, ProviderWalletBadgeMeta> = {
  credit: {
    label: 'Credit',
    badgeClassName: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  },
  debit: {
    label: 'Debit',
    badgeClassName: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  },
};

const movementStatusMeta: Record<ProviderWalletMovementStatus, ProviderWalletBadgeMeta> = {
  credited: topUpStatusMeta.credited,
  failed: topUpStatusMeta.failed,
  cancelled: topUpStatusMeta.cancelled,
  expired: topUpStatusMeta.expired,
  completed: {
    label: 'Finalise',
    badgeClassName: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    hint: 'Mouvement de portefeuille finalise et deja applique.',
  },
};

export function getProviderWalletTopUpStatusMeta(
  status: ProviderWalletTopUpStatus,
): ProviderWalletBadgeMeta {
  return topUpStatusMeta[status];
}

export function getProviderWalletLedgerEntryTypeMeta(
  entryType: ProviderWalletLedgerEntryType,
): ProviderWalletBadgeMeta {
  return ledgerEntryTypeMeta[entryType];
}

export function getProviderWalletLedgerDirectionMeta(
  direction: ProviderWalletLedgerDirection,
): ProviderWalletBadgeMeta {
  return ledgerDirectionMeta[direction];
}

export function getProviderWalletMovementStatusMeta(
  status: ProviderWalletMovementStatus,
): ProviderWalletBadgeMeta {
  return movementStatusMeta[status];
}

export function getProviderWalletPaymentChannelLabel(
  paymentChannel: ProviderWalletPaymentChannel,
): string {
  return providerWalletManualTopUpConfig.channels[paymentChannel].label;
}
