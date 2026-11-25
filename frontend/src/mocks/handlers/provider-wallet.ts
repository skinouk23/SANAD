/**
 * Provider Wallet MSW Handlers
 *
 * Intercepts provider wallet v1 requests during development and returns
 * realistic mock data shaped to match the canonical frontend schemas.
 */

import { HttpResponse, http } from 'msw';

import { providerWalletManualTopUpConfig } from '@/features/provider-wallet/manualTopUp.config';
import type {
  ProviderWalletLedgerEntry,
  ProviderWalletMovement,
  ProviderWalletPaymentChannel,
  ProviderWalletStats,
  ProviderWalletSummary,
  ProviderWalletTopUpRequest,
} from '@/features/provider-wallet/schema';
import { apiOk, randomId } from '@/mocks/utils';

function apiBadRequest(message: string, field: string = 'request') {
  return HttpResponse.json(
    {
      success: false,
      data: null,
      status: 'error',
      message,
      errors: {
        [field]: [message],
      },
    },
    { status: 400 },
  );
}

const walletCurrency = providerWalletManualTopUpConfig.defaultCurrency;

const mockWalletState = {
  availableBalance: 240,
  reservedBalance: 55,
  currency: walletCurrency,
};

const mockWalletTopUps: ProviderWalletTopUpRequest[] = [
  {
    id: '1c7bf7d0-8780-4e5c-92e5-5f80e17cc077',
    topUpNumber: 'TUP-20260422-CREDIT001',
    amount: 120,
    currency: walletCurrency,
    paymentChannel: 'd17',
    platformReference: 'PREF-20260422140000-CREDIT001',
    providerTransferReference: 'D17-4471',
    status: 'credited',
    requestedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    markedTransferredAt: new Date(Date.now() - 3 * 86400000 + 3600000).toISOString(),
    expiresAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    paymentId: '44444444-4444-4444-4444-444444444441',
    paymentStatus: 'settled',
    paymentMethodType: 'd17',
    paymentReferenceNumber: 'PMT-20260422-001',
    creditedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    failedAt: undefined,
    cancelledAt: undefined,
    evidenceUrl: undefined,
  },
  {
    id: '11c5bfa2-df8e-4b4e-bcbf-c40f357de593',
    topUpNumber: 'TUP-20260416-FAILED001',
    amount: 75,
    currency: walletCurrency,
    paymentChannel: 'bank_transfer',
    platformReference: 'PREF-20260416103000-FAILED001',
    providerTransferReference: 'VIR-7731',
    status: 'failed',
    requestedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    markedTransferredAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    paymentId: undefined,
    paymentStatus: undefined,
    paymentMethodType: undefined,
    paymentReferenceNumber: undefined,
    creditedAt: undefined,
    failedAt: new Date(Date.now() - 8 * 86400000 + 5400000).toISOString(),
    cancelledAt: undefined,
    evidenceUrl: undefined,
  },
  {
    id: 'b243c60a-bc9f-41e6-ae69-6c05308656f2',
    topUpNumber: 'TUP-20260412-CANCELLED',
    amount: 60,
    currency: walletCurrency,
    paymentChannel: 'd17',
    platformReference: 'PREF-20260412121500-CANCEL01',
    providerTransferReference: undefined,
    status: 'cancelled',
    requestedAt: new Date(Date.now() - 13 * 86400000).toISOString(),
    markedTransferredAt: undefined,
    expiresAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    paymentId: undefined,
    paymentStatus: undefined,
    paymentMethodType: undefined,
    paymentReferenceNumber: undefined,
    creditedAt: undefined,
    failedAt: undefined,
    cancelledAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    evidenceUrl: undefined,
  },
];

const mockWalletLedger: ProviderWalletLedgerEntry[] = [
  {
    id: '555a6cf5-1146-4db9-a99c-a89b7f640c8d',
    entryType: 'cash_booking_hold',
    amount: 55,
    direction: 'debit',
    currentBalanceBefore: 240,
    currentBalanceAfter: 240,
    reservedBalanceBefore: 0,
    reservedBalanceAfter: 55,
    currency: walletCurrency,
    reference: 'LEDG-HOLD-20260425-0001',
    description: 'Reservation du portefeuille pour une prestation cash en cours.',
    topUpRequestId: undefined,
    bookingId: '2e27be7f-a1ab-4b60-b3d0-7cca40f6d277',
    adminId: undefined,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'e772b530-dcd7-43fd-9dd7-537dbf1c0a0a',
    entryType: 'topup_credit',
    amount: 120,
    direction: 'credit',
    currentBalanceBefore: 120,
    currentBalanceAfter: 240,
    reservedBalanceBefore: 0,
    reservedBalanceAfter: 0,
    currency: walletCurrency,
    reference: 'LEDG-TOPUP-20260422-0001',
    description: 'Credit portefeuille apres traitement final d un rechargement manuel.',
    topUpRequestId: '1c7bf7d0-8780-4e5c-92e5-5f80e17cc077',
    bookingId: undefined,
    adminId: '495df151-c667-4b65-878f-f7b8a89b6058',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'e3fba6f7-ac89-402b-824c-709e1d1bfe85',
    entryType: 'cash_booking_debit',
    amount: 35,
    direction: 'debit',
    currentBalanceBefore: 155,
    currentBalanceAfter: 120,
    reservedBalanceBefore: 35,
    reservedBalanceAfter: 0,
    currency: walletCurrency,
    reference: 'LEDG-DEBIT-20260420-0001',
    description: 'Debit du portefeuille apres reglement d une prestation cash.',
    topUpRequestId: undefined,
    bookingId: '36db59d0-4c52-43f2-ac3d-7d8e435aa4df',
    adminId: undefined,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const topUpsByIdempotencyKey = new Map<string, ProviderWalletTopUpRequest>();

function buildWalletSummary(): ProviderWalletSummary {
  return {
    reservedBalance: mockWalletState.reservedBalance,
    usableBalance: mockWalletState.availableBalance,
    currency: mockWalletState.currency,
  };
}

function buildWalletStats(): ProviderWalletStats {
  const movements = buildWalletMovements();
  const now = new Date();
  const availableYears = Array.from(
    new Set(movements.map((movement) => new Date(movement.occurredAt).getFullYear())),
  ).sort((left, right) => right - left);

  const currentMonthTotals = movements.reduce(
    (totals, movement) => {
      const occurredAt = new Date(movement.occurredAt);
      if (
        occurredAt.getMonth() !== now.getMonth() ||
        occurredAt.getFullYear() !== now.getFullYear()
      ) {
        return totals;
      }

      if (movement.type === 'deposit') {
        totals.currentMonthDeposits += movement.amount;
      } else {
        totals.currentMonthDeductions += movement.amount;
      }

      return totals;
    },
    {
      currentMonthDeposits: 0,
      currentMonthDeductions: 0,
    },
  );

  return {
    ...currentMonthTotals,
    currency: mockWalletState.currency,
    availableYears,
  };
}

function buildWalletMovements(): ProviderWalletMovement[] {
  const topUpRequestIds = new Set(mockWalletTopUps.map((topUp) => topUp.id));

  const topUpMovements: ProviderWalletMovement[] = mockWalletTopUps.map((topUp) => ({
    id: topUp.id,
    type: 'deposit',
    status: topUp.status,
    amount: topUp.amount,
    currency: topUp.currency,
    occurredAt: topUp.requestedAt,
    reference: topUp.platformReference,
    description: `Demande de rechargement via ${providerWalletManualTopUpConfig.channels[topUp.paymentChannel].label}.`,
    sourceType: 'topup_request',
    topUpNumber: topUp.topUpNumber,
    paymentChannel: topUp.paymentChannel,
    providerTransferReference: topUp.providerTransferReference,
    markedTransferredAt: topUp.markedTransferredAt,
    expiresAt: topUp.expiresAt,
  }));

  const ledgerMovements: ProviderWalletMovement[] = mockWalletLedger
    .filter((entry) => entry.entryType !== 'cash_booking_hold')
    .filter(
      (entry) =>
        entry.entryType !== 'topup_credit' ||
        !entry.topUpRequestId ||
        !topUpRequestIds.has(entry.topUpRequestId),
    )
    .map((entry) => ({
      id: entry.id,
      type: entry.direction === 'credit' ? 'deposit' : 'deduction',
      status: 'completed',
      amount: entry.amount,
      currency: entry.currency,
      occurredAt: entry.createdAt,
      reference: entry.reference,
      description: entry.description,
      sourceType: 'wallet_ledger',
      topUpNumber: undefined,
      paymentChannel: undefined,
      providerTransferReference: undefined,
      markedTransferredAt: undefined,
      expiresAt: undefined,
    }));

  return [...topUpMovements, ...ledgerMovements].sort(
    (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
  );
}

function buildWalletMovementSearchText(movement: ProviderWalletMovement): string {
  return [
    movement.description,
    movement.reference,
    movement.topUpNumber,
    movement.providerTransferReference,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function parsePositiveIntegerParam(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function createMockTopUpNumber(): string {
  return `TUP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomId().slice(0, 8).toUpperCase()}`;
}

function createMockPlatformReference(): string {
  return `PREF-${new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14)}-${randomId().slice(0, 10).toUpperCase()}`;
}

function createMockPaymentReferenceNumber(): string {
  return `PMT-${new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14)}-${randomId().slice(0, 8).toUpperCase()}`;
}

function createMockLedgerReference(): string {
  return `LEDG-TOPUP-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}-${randomId().slice(0, 4).toUpperCase()}`;
}

export const providerWalletHandlers = [
  http.get('*/api/v1/providers/me/wallet', () => {
    return apiOk(buildWalletSummary());
  }),

  http.get('*/api/v1/providers/me/wallet/stats', () => {
    return apiOk(buildWalletStats());
  }),

  http.get('*/api/v1/providers/me/wallet/movements', ({ request }) => {
    const url = new URL(request.url);
    const page = parsePositiveIntegerParam(url.searchParams.get('page'), 1);
    const limit = parsePositiveIntegerParam(url.searchParams.get('limit'), 10);
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search')?.trim().toLowerCase() ?? '';
    const monthValue = url.searchParams.get('month');
    const yearValue = url.searchParams.get('year');
    const month = monthValue ? Number(monthValue) : Number.NaN;
    const year = yearValue ? Number(yearValue) : Number.NaN;

    let items = buildWalletMovements();

    if (type === 'deposit' || type === 'deduction') {
      items = items.filter((movement) => movement.type === type);
    }

    if (search.length > 0) {
      items = items.filter((movement) => buildWalletMovementSearchText(movement).includes(search));
    }

    if (Number.isInteger(month) && month >= 1 && month <= 12) {
      items = items.filter((movement) => new Date(movement.occurredAt).getMonth() + 1 === month);
    }

    if (Number.isInteger(year)) {
      items = items.filter((movement) => new Date(movement.occurredAt).getFullYear() === year);
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;

    return apiOk({
      items: items.slice(startIndex, startIndex + limit),
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
      },
    });
  }),

  http.get('*/api/v1/providers/me/wallet/top-ups', () => {
    return apiOk([...mockWalletTopUps]);
  }),

  http.post('*/api/v1/providers/me/wallet/top-ups/submit', async ({ request }) => {
    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim();
    const existingTopUp = idempotencyKey ? topUpsByIdempotencyKey.get(idempotencyKey) : undefined;

    if (existingTopUp) {
      return apiOk(existingTopUp);
    }

    const body = (await request.json()) as {
      amount?: number;
      currency?: string;
      paymentChannel?: ProviderWalletPaymentChannel;
      providerTransferReference?: string;
      evidenceUrl?: string;
    };

    if (!body.amount || body.amount <= 0) {
      return apiBadRequest('Amount must be greater than zero.', 'amount');
    }

    if (!body.currency || typeof body.currency !== 'string' || body.currency.trim().length !== 3) {
      return apiBadRequest('Currency must be a 3-letter ISO code.', 'currency');
    }

    if (body.paymentChannel !== 'bank_transfer' && body.paymentChannel !== 'd17') {
      return apiBadRequest("PaymentChannel must be 'bank_transfer' or 'd17'.", 'paymentChannel');
    }

    const providerTransferReference = body.providerTransferReference?.trim() ?? '';
    if (providerTransferReference.length === 0) {
      return apiBadRequest('Provider transfer reference is required.', 'providerTransferReference');
    }

    if (providerTransferReference.length > 120) {
      return apiBadRequest(
        'Provider transfer reference must be 120 characters or fewer.',
        'providerTransferReference',
      );
    }

    const now = new Date().toISOString();
    const creditedTopUp: ProviderWalletTopUpRequest = {
      id: randomId(),
      topUpNumber: createMockTopUpNumber(),
      amount: body.amount,
      currency: body.currency.trim().toUpperCase(),
      paymentChannel: body.paymentChannel,
      platformReference: createMockPlatformReference(),
      providerTransferReference,
      status: 'credited',
      requestedAt: now,
      markedTransferredAt: now,
      expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
      paymentId: randomId(),
      paymentStatus: 'settled',
      paymentMethodType: body.paymentChannel,
      paymentReferenceNumber: createMockPaymentReferenceNumber(),
      creditedAt: now,
      failedAt: undefined,
      cancelledAt: undefined,
      evidenceUrl: body.evidenceUrl?.trim().length ? body.evidenceUrl.trim() : undefined,
    };
    const availableBalanceBefore = mockWalletState.availableBalance;

    mockWalletState.availableBalance += creditedTopUp.amount;
    mockWalletTopUps.unshift(creditedTopUp);
    mockWalletLedger.unshift({
      id: randomId(),
      entryType: 'topup_credit',
      amount: creditedTopUp.amount,
      direction: 'credit',
      currentBalanceBefore: availableBalanceBefore,
      currentBalanceAfter: mockWalletState.availableBalance,
      reservedBalanceBefore: mockWalletState.reservedBalance,
      reservedBalanceAfter: mockWalletState.reservedBalance,
      currency: creditedTopUp.currency,
      reference: createMockLedgerReference(),
      description: 'Credit portefeuille apres soumission directe du rechargement manuel.',
      topUpRequestId: creditedTopUp.id,
      bookingId: undefined,
      adminId: undefined,
      createdAt: now,
    });

    if (idempotencyKey) {
      topUpsByIdempotencyKey.set(idempotencyKey, creditedTopUp);
    }

    return apiOk(creditedTopUp);
  }),

  http.get('*/api/v1/providers/me/wallet/ledger', () => {
    return apiOk([...mockWalletLedger]);
  }),
];
