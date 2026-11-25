import { http } from 'msw';

import type { FinanceTimelineItem } from '@/features/finance-timeline';
import type {
  ProviderPaymentHistoryItem,
  ProviderPaymentHistoryStats,
} from '@/features/transactions/provider-history/schema';
import { apiOk } from '@/mocks/utils';

const CURRENT_PROVIDER_ID = '11111111-1111-1111-1111-111111111111';

function hoursAgo(value: number): string {
  return new Date(Date.now() - value * 60 * 60 * 1000).toISOString();
}

function normalizeParam(value: string | null): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

function parsePositiveIntegerParam(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDateBoundary(value: string | null, endOfDay: boolean = false): number {
  if (!value) {
    return Number.NaN;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return Date.parse(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
  }

  return Date.parse(value);
}

function applyTimelineFilters(items: FinanceTimelineItem[], requestUrl: string) {
  const url = new URL(requestUrl);
  const bookingId = normalizeParam(url.searchParams.get('bookingId'));
  const type = normalizeParam(url.searchParams.get('type'));
  const status = normalizeParam(url.searchParams.get('status'));
  const sort = url.searchParams.get('sort')?.trim();
  const dateFrom = url.searchParams.get('dateFrom');
  const dateTo = url.searchParams.get('dateTo');
  const page = parsePositiveIntegerParam(url.searchParams.get('page'), 1);
  const limit = parsePositiveIntegerParam(url.searchParams.get('limit'), 20);

  let filtered = [...items];

  if (bookingId) {
    filtered = filtered.filter((item) => item.bookingId?.toLowerCase() === bookingId);
  }

  if (type) {
    filtered = filtered.filter((item) => item.type === type);
  }

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  const minDate = dateFrom ? Date.parse(dateFrom) : Number.NaN;
  if (Number.isFinite(minDate)) {
    filtered = filtered.filter((item) => new Date(item.occurredAt).getTime() >= minDate);
  }

  const maxDate = dateTo ? Date.parse(dateTo) : Number.NaN;
  if (Number.isFinite(maxDate)) {
    filtered = filtered.filter((item) => new Date(item.occurredAt).getTime() <= maxDate);
  }

  filtered.sort((left, right) => {
    const leftValue =
      sort === 'createdAt desc'
        ? new Date(left.createdAt).getTime()
        : new Date(left.occurredAt).getTime();
    const rightValue =
      sort === 'createdAt desc'
        ? new Date(right.createdAt).getTime()
        : new Date(right.occurredAt).getTime();

    return rightValue - leftValue;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * limit;
  const pagedItems = filtered.slice(startIndex, startIndex + limit);

  return {
    items: pagedItems,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

function applyProviderPaymentHistoryFilters(
  items: ProviderPaymentHistoryItem[],
  requestUrl: string,
) {
  const url = new URL(requestUrl);
  const status = normalizeParam(url.searchParams.get('status'));
  const search = normalizeParam(url.searchParams.get('search'));
  const sort = url.searchParams.get('sort')?.trim();
  const dateFrom = parseDateBoundary(url.searchParams.get('dateFrom'));
  const dateTo = parseDateBoundary(url.searchParams.get('dateTo'), true);
  const page = parsePositiveIntegerParam(url.searchParams.get('page'), 1);
  const limit = parsePositiveIntegerParam(url.searchParams.get('limit'), 10);

  let filtered = [...items];

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (search) {
    filtered = filtered.filter((item) =>
      [
        item.bookingNumber,
        item.patientName,
        item.serviceName,
        item.paymentReferenceNumber,
        item.id,
      ].some((value) => value?.toLowerCase().includes(search)),
    );
  }

  if (Number.isFinite(dateFrom)) {
    filtered = filtered.filter((item) => new Date(item.createdAt).getTime() >= dateFrom);
  }

  if (Number.isFinite(dateTo)) {
    filtered = filtered.filter((item) => new Date(item.createdAt).getTime() <= dateTo);
  }

  filtered.sort((left, right) => {
    const leftValue =
      sort === 'processedAt desc'
        ? new Date(left.processedAt ?? left.createdAt).getTime()
        : new Date(left.createdAt).getTime();
    const rightValue =
      sort === 'processedAt desc'
        ? new Date(right.processedAt ?? right.createdAt).getTime()
        : new Date(right.createdAt).getTime();

    return rightValue - leftValue;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * limit;
  const pagedItems = filtered.slice(startIndex, startIndex + limit);

  return {
    items: pagedItems,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

function buildProviderPaymentHistoryStats(
  items: ProviderPaymentHistoryItem[],
): ProviderPaymentHistoryStats {
  const settledItems = items.filter((item) => item.status === 'settled');
  const pendingItems = items.filter((item) =>
    ['pending', 'processing', 'reserved'].includes(item.status),
  );
  const totalRevenue = settledItems.reduce((sum, item) => sum + item.netAmount, 0);
  const pendingAmount = pendingItems.reduce((sum, item) => sum + item.netAmount, 0);
  const completedCount = settledItems.length;

  return {
    totalRevenue,
    pendingAmount,
    completedCount,
    averageTransaction: completedCount > 0 ? totalRevenue / completedCount : 0,
    currency: items[0]?.currency ?? 'TND',
  };
}

function createProviderPaymentHistoryItem(
  item: Omit<
    ProviderPaymentHistoryItem,
    | 'paymentId'
    | 'patientId'
    | 'serviceCategory'
    | 'paymentMethodType'
    | 'paymentReferenceNumber'
    | 'processedAt'
  > &
    Partial<
      Pick<
        ProviderPaymentHistoryItem,
        | 'paymentId'
        | 'patientId'
        | 'serviceCategory'
        | 'paymentMethodType'
        | 'paymentReferenceNumber'
        | 'processedAt'
      >
    >,
): ProviderPaymentHistoryItem {
  return {
    paymentId: undefined,
    patientId: undefined,
    serviceCategory: undefined,
    paymentMethodType: undefined,
    paymentReferenceNumber: undefined,
    processedAt: undefined,
    ...item,
  };
}

const myFinanceTimelineItems: FinanceTimelineItem[] = [
  {
    id: '10101010-1010-1010-1010-101010101010',
    type: 'payment',
    direction: 'credit',
    status: 'completed',
    amount: 125,
    currency: 'TND',
    title: 'Consultation a domicile validee',
    description: 'Versement credite sur le portefeuille apres validation de la prestation.',
    occurredAt: hoursAgo(6),
    createdAt: hoursAgo(6),
    sourceType: 'booking',
    sourceId: '20202020-2020-2020-2020-202020202020',
    providerId: CURRENT_PROVIDER_ID,
    patientId: '30303030-3030-3030-3030-303030303030',
    bookingId: '40404040-4040-4040-4040-404040404040',
    paymentId: '50505050-5050-5050-5050-505050505050',
    paymentAttemptId: '60606060-6060-6060-6060-606060606060',
    providerWalletTopUpId: undefined,
    ledgerTransactionId: undefined,
    referenceNumber: 'FIN-20260429-001',
  },
  {
    id: '11111111-aaaa-bbbb-cccc-111111111111',
    type: 'commission',
    direction: 'debit',
    status: 'completed',
    amount: 18.75,
    currency: 'TND',
    title: 'Commission plateforme',
    description: 'Commission appliquee sur la prestation precedente.',
    occurredAt: hoursAgo(6),
    createdAt: hoursAgo(6),
    sourceType: 'payment',
    sourceId: '50505050-5050-5050-5050-505050505050',
    providerId: CURRENT_PROVIDER_ID,
    patientId: '30303030-3030-3030-3030-303030303030',
    bookingId: '40404040-4040-4040-4040-404040404040',
    paymentId: '50505050-5050-5050-5050-505050505050',
    paymentAttemptId: '60606060-6060-6060-6060-606060606060',
    providerWalletTopUpId: undefined,
    ledgerTransactionId: undefined,
    referenceNumber: 'FIN-20260429-002',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    type: 'payout',
    direction: 'debit',
    status: 'processing',
    amount: 90,
    currency: 'TND',
    title: 'Virement portefeuille',
    description: 'Demande de retrait en cours de traitement.',
    occurredAt: hoursAgo(24),
    createdAt: hoursAgo(24),
    sourceType: 'wallet',
    sourceId: '88888888-8888-8888-8888-888888888888',
    providerId: CURRENT_PROVIDER_ID,
    patientId: undefined,
    bookingId: undefined,
    paymentId: undefined,
    paymentAttemptId: undefined,
    providerWalletTopUpId: undefined,
    ledgerTransactionId: '99999999-9999-9999-9999-999999999999',
    referenceNumber: 'FIN-20260428-003',
  },
  {
    id: '12121212-1212-1212-1212-121212121212',
    type: 'refund',
    direction: 'debit',
    status: 'completed',
    amount: 42,
    currency: 'TND',
    title: 'Ajustement remboursement',
    description: 'Ajustement lie a une annulation validee.',
    occurredAt: hoursAgo(48),
    createdAt: hoursAgo(48),
    sourceType: 'booking',
    sourceId: '13131313-1313-1313-1313-131313131313',
    providerId: CURRENT_PROVIDER_ID,
    patientId: '14141414-1414-1414-1414-141414141414',
    bookingId: '15151515-1515-1515-1515-151515151515',
    paymentId: '16161616-1616-1616-1616-161616161616',
    paymentAttemptId: '17171717-1717-1717-1717-171717171717',
    providerWalletTopUpId: undefined,
    ledgerTransactionId: undefined,
    referenceNumber: 'FIN-20260427-004',
  },
];

const providerPaymentHistoryItems: ProviderPaymentHistoryItem[] = [
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000001',
    bookingId: '21000000-0000-4000-8000-000000000001',
    paymentId: '22000000-0000-4000-8000-000000000001',
    bookingNumber: 'BK-20260429-001',
    patientId: '23000000-0000-4000-8000-000000000001',
    patientName: 'Fatma Ben Ali',
    serviceName: 'Injection a domicile',
    serviceCategory: 'nursing',
    status: 'settled',
    amount: 120,
    commission: 18,
    netAmount: 102,
    currency: 'TND',
    paymentMethod: 'card',
    paymentReferenceNumber: 'PAY-20260429-001',
    createdAt: hoursAgo(6),
    processedAt: hoursAgo(4),
  }),
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000002',
    bookingId: '21000000-0000-4000-8000-000000000002',
    bookingNumber: 'BK-20260429-002',
    patientId: '23000000-0000-4000-8000-000000000002',
    patientName: 'Mohamed Trabelsi',
    serviceName: 'Pansement complexe',
    serviceCategory: 'nursing',
    status: 'pending',
    amount: 85,
    commission: 12.75,
    netAmount: 72.25,
    currency: 'TND',
    paymentMethod: 'cash',
    createdAt: hoursAgo(18),
  }),
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000003',
    bookingId: '21000000-0000-4000-8000-000000000003',
    paymentId: '22000000-0000-4000-8000-000000000003',
    bookingNumber: 'BK-20260428-003',
    patientId: '23000000-0000-4000-8000-000000000003',
    patientName: 'Leila Mansour',
    serviceName: 'Seance de kinesitherapie',
    serviceCategory: 'physiotherapy',
    status: 'processing',
    amount: 200,
    commission: 30,
    netAmount: 170,
    currency: 'TND',
    paymentMethod: 'bank_transfer',
    paymentReferenceNumber: 'TRF-20260428-003',
    createdAt: hoursAgo(28),
  }),
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000004',
    bookingId: '21000000-0000-4000-8000-000000000004',
    paymentId: '22000000-0000-4000-8000-000000000004',
    bookingNumber: 'BK-20260427-004',
    patientId: '23000000-0000-4000-8000-000000000004',
    patientName: 'Sami Kallel',
    serviceName: 'Analyse sanguine a domicile',
    serviceCategory: 'laboratory',
    status: 'settled',
    amount: 65,
    commission: 9.75,
    netAmount: 55.25,
    currency: 'TND',
    paymentMethod: 'd17',
    paymentReferenceNumber: 'D17-20260427-004',
    createdAt: hoursAgo(52),
    processedAt: hoursAgo(48),
  }),
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000005',
    bookingId: '21000000-0000-4000-8000-000000000005',
    paymentId: '22000000-0000-4000-8000-000000000005',
    bookingNumber: 'BK-20260426-005',
    patientId: '23000000-0000-4000-8000-000000000005',
    patientName: 'Noura Chaabane',
    serviceName: 'Perfusion a domicile',
    serviceCategory: 'nursing',
    status: 'reserved',
    amount: 150,
    commission: 22.5,
    netAmount: 127.5,
    currency: 'TND',
    paymentMethod: 'mobile_money',
    paymentReferenceNumber: 'MM-20260426-005',
    createdAt: hoursAgo(76),
  }),
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000006',
    bookingId: '21000000-0000-4000-8000-000000000006',
    bookingNumber: 'BK-20260425-006',
    patientId: '23000000-0000-4000-8000-000000000006',
    patientName: 'Yassine Jaziri',
    serviceName: 'Consultation infirmiere',
    serviceCategory: 'nursing',
    status: 'cancelled',
    amount: 40,
    commission: 0,
    netAmount: 0,
    currency: 'TND',
    paymentMethod: 'cash',
    createdAt: hoursAgo(100),
  }),
  createProviderPaymentHistoryItem({
    id: '20000000-0000-4000-8000-000000000007',
    bookingId: '21000000-0000-4000-8000-000000000007',
    paymentId: '22000000-0000-4000-8000-000000000007',
    bookingNumber: 'BK-20260424-007',
    patientId: '23000000-0000-4000-8000-000000000007',
    patientName: 'Amira Jebali',
    serviceName: 'Soins post-operatoires',
    serviceCategory: 'nursing',
    status: 'failed',
    amount: 95,
    commission: 0,
    netAmount: 0,
    currency: 'TND',
    paymentMethod: 'card',
    paymentReferenceNumber: 'PAY-20260424-007',
    createdAt: hoursAgo(124),
  }),
];

export const providerFinanceHandlers = [
  http.get('*/api/v1/me/finance/timeline', ({ request }) => {
    return apiOk(applyTimelineFilters(myFinanceTimelineItems, request.url));
  }),
  http.get('*/api/v1/providers/me/payment-history', ({ request }) => {
    return apiOk(applyProviderPaymentHistoryFilters(providerPaymentHistoryItems, request.url));
  }),
  http.get('*/api/v1/providers/me/payment-history/stats', () => {
    return apiOk(buildProviderPaymentHistoryStats(providerPaymentHistoryItems));
  }),
];
