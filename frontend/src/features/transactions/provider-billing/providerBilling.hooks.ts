import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { getBookingPaymentDisplay, usePastAppointments } from '@/features/bookings';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import { isCompletedBookingStatus } from '@/features/bookings/status';
import { useMyProviderProfile } from '@/features/providers';
import { useProviderWalletStats, useProviderWalletSummary } from '@/features/provider-wallet';
import {
  saveBalanceSheetPdf,
  saveCnssDeclarationPdf,
  saveInvoicePdf,
  preloadBillingPdfModule,
  saveRevenueLedgerPdf,
  saveTvaDeclarationPdf,
  type BillingBalanceSheetData,
  type BillingBreakdownLine,
  type BillingDocumentContext,
  type BillingInvoice,
  type BillingSummarySnapshot,
} from '@/integrations/billing/pdf';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import { formatDate, formatTime } from '@/shared/lib/i18n/formatting';
import { showErrorToast } from '@/shared/lib/notifications/toast';

type BillingPeriod = 'month' | 'quarter' | 'year';
type BillingExportKey = 'balance' | 'cnss' | 'invoice' | 'ledger' | 'tva';

const DEFAULT_CURRENCY = 'TND';
const EXPENSES_UNAVAILABLE_MESSAGE =
  'Les depenses metier ne sont pas encore exposees par une source canonique.';
const PENDING_INVOICE_STATUSES = new Set(['pending', 'processing', 'reserved']);

export interface Invoice extends BillingInvoice {
  bookingId: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  receipt: boolean;
}

export interface CompletedAppointment {
  id: string;
  bookingId: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  patientPhone?: string;
  patientAddress?: string;
  invoice: Invoice;
}

export interface ProviderBillingSummary extends BillingSummarySnapshot {
  usableBalance: number;
  currentMonthDeposits: number;
  currentMonthDeductions: number;
}

interface BillingPeriodDescriptor {
  start: Date;
  end: Date;
  label: string;
  rangeLabel: string;
  fileLabel: string;
}

function humanizeToken(value: string): string {
  const normalized = value.replace(/[_-]+/g, ' ').trim();

  if (!normalized.length) {
    return 'Inconnu';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getBillingPeriodDescriptor(
  period: BillingPeriod,
  locale: string,
): BillingPeriodDescriptor {
  const now = new Date();
  const start = new Date(now);

  if (period === 'month') {
    start.setDate(1);
  } else if (period === 'quarter') {
    start.setMonth(Math.floor(now.getMonth() / 3) * 3, 1);
  } else {
    start.setMonth(0, 1);
  }

  start.setHours(0, 0, 0, 0);

  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const quarter = Math.floor(start.getMonth() / 3) + 1;
  const quarterLabel = locale.startsWith('en') ? `Q${quarter}` : `T${quarter}`;
  const label =
    period === 'month'
      ? formatDate(start, { month: 'long', year: 'numeric' }, locale)
      : period === 'quarter'
        ? `${quarterLabel} ${year}`
        : String(year);

  return {
    start,
    end: now,
    label,
    rangeLabel: `${formatDate(start, { day: '2-digit', month: 'short', year: 'numeric' }, locale)} - ${formatDate(now, { day: '2-digit', month: 'short', year: 'numeric' }, locale)}`,
    fileLabel:
      period === 'month'
        ? `${year}-${String(month).padStart(2, '0')}`
        : period === 'quarter'
          ? `${year}-${quarterLabel}`
          : String(year),
  };
}

function getBookingFinanceTimestamp(booking: BookingListItemResponse): string {
  return booking.validatedAt ?? booking.serviceCompletedAt ?? booking.scheduledAt;
}

function isTimestampWithinPeriod(timestamp: string, descriptor: BillingPeriodDescriptor): boolean {
  const value = new Date(timestamp).getTime();
  return value >= descriptor.start.getTime() && value <= descriptor.end.getTime();
}

function buildInvoiceFromBooking(
  booking: BookingListItemResponse,
  locale: string,
  fallbackCurrency: string,
): Invoice {
  const paymentDisplay = getBookingPaymentDisplay({
    paymentMethod: booking.paymentMethod,
    paymentMethodType: booking.paymentMethodType,
    paymentReferenceNumber: booking.paymentReferenceNumber,
    paymentStatus: booking.paymentStatus,
  });
  const amount = booking.providerAmount ?? 0;
  const currency = booking.currency?.trim() || fallbackCurrency;

  return {
    bookingId: booking.id,
    id: booking.bookingNumber?.trim() || booking.id,
    patientName: booking.patient?.name?.trim() || 'Patient',
    patientPhone: booking.patient?.phone ?? undefined,
    patientAddress: booking.address ?? undefined,
    service:
      booking.service?.name?.trim() || booking.lineItems?.[0]?.serviceName?.trim() || 'Service',
    date: formatDate(getBookingFinanceTimestamp(booking), { dateStyle: 'medium' }, locale),
    amount,
    currency,
    status: paymentDisplay.normalizedStatus,
    paymentMethod: paymentDisplay.methodLabel,
    paymentReferenceNumber: paymentDisplay.referenceNumber ?? undefined,
  };
}

function mapCompletedAppointment(
  booking: BookingListItemResponse,
  locale: string,
  fallbackCurrency: string,
): CompletedAppointment {
  const invoice = buildInvoiceFromBooking(booking, locale, fallbackCurrency);

  return {
    id: booking.id,
    bookingId: booking.id,
    patientName: invoice.patientName,
    service: invoice.service,
    date: invoice.date,
    time: formatTime(
      booking.scheduledAt,
      {
        hour: '2-digit',
        minute: '2-digit',
      },
      locale,
    ),
    amount: invoice.amount,
    currency: invoice.currency,
    patientPhone: invoice.patientPhone,
    patientAddress: invoice.patientAddress,
    invoice,
  };
}

function buildInvoiceSearchText(invoice: Invoice): string {
  return [
    invoice.id,
    invoice.patientName,
    invoice.service,
    invoice.paymentMethod,
    invoice.paymentReferenceNumber,
    invoice.status,
  ]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ')
    .toLowerCase();
}

function buildRevenueBreakdownLines(invoices: Invoice[]): BillingBreakdownLine[] {
  const totals = new Map<string, number>();

  invoices.forEach((invoice) => {
    totals.set(invoice.service, (totals.get(invoice.service) ?? 0) + invoice.amount);
  });

  return Array.from(totals.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((left, right) => right.amount - left.amount);
}

function buildDocumentContext(
  profile: ReturnType<typeof useMyProviderProfile>['data'],
  user: ReturnType<typeof useAuth>['user'],
  descriptor: BillingPeriodDescriptor,
): BillingDocumentContext {
  const displayName =
    profile?.businessName?.trim() ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim() ||
    user?.name?.trim() ||
    'Prestataire';

  return {
    provider: {
      displayName,
      businessName: profile?.businessName?.trim() || undefined,
      email: user?.email?.trim() || undefined,
      phone: user?.phone?.trim() || undefined,
      addressLine: profile?.address?.trim() || undefined,
      city: profile?.city?.trim() || undefined,
      postalCode: profile?.postalCode?.trim() || undefined,
      licenseNumber: profile?.licenseNumber?.trim() || undefined,
    },
    period: {
      label: descriptor.label,
      fileLabel: descriptor.fileLabel,
    },
  };
}

export function getInvoiceStatusMeta(status: string) {
  switch (status) {
    case 'settled':
      return {
        label: 'Regle',
        className: 'border-success/20 bg-success/10 text-success',
      };
    case 'reserved':
    case 'pending':
      return {
        label: 'En attente',
        className: 'border-warning/20 bg-warning/10 text-warning',
      };
    case 'processing':
      return {
        label: 'En traitement',
        className: 'border-primary/20 bg-primary/10 text-primary',
      };
    case 'refunded':
      return {
        label: 'Rembourse',
        className: 'border-border bg-muted text-muted-foreground',
      };
    case 'cancelled':
      return {
        label: 'Annule',
        className: 'border-border bg-muted text-muted-foreground',
      };
    case 'failed':
      return {
        label: 'Echoue',
        className: 'border-destructive/20 bg-destructive/10 text-destructive',
      };
    case 'expired':
      return {
        label: 'Expire',
        className: 'border-warning/20 bg-warning/10 text-warning',
      };
    default:
      return {
        label: humanizeToken(status),
        className: 'border-border bg-muted text-muted-foreground',
      };
  }
}

export function useProviderBillingScreen() {
  const [period, setPeriod] = useState<BillingPeriod>('month');
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses' | 'reports'>('invoices');
  const [showSelectOperationModal, setShowSelectOperationModal] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice | null>(null);
  const [expenseDetail, setExpenseDetail] = useState<Expense | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<CompletedAppointment | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [exportingDocumentKey, setExportingDocumentKey] = useState<BillingExportKey | null>(null);
  const [exportingInvoiceId, setExportingInvoiceId] = useState<string | null>(null);
  const exportInProgressRef = useRef(false);

  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage.code;

  const bookingsQuery = usePastAppointments();
  const summaryQuery = useProviderWalletSummary();
  const statsQuery = useProviderWalletStats();
  const profileQuery = useMyProviderProfile();

  const periodDescriptor = useMemo(
    () => getBillingPeriodDescriptor(period, locale),
    [locale, period],
  );

  const pastBookings = useMemo(() => bookingsQuery.data ?? [], [bookingsQuery.data]);
  const fallbackCurrency =
    summaryQuery.data?.currency ??
    statsQuery.data?.currency ??
    pastBookings.find((booking) => booking.currency?.trim())?.currency?.trim() ??
    DEFAULT_CURRENCY;

  const completedBookings = useMemo(
    () =>
      pastBookings.filter(
        (booking) => isCompletedBookingStatus(booking.status) && (booking.providerAmount ?? 0) > 0,
      ),
    [pastBookings],
  );

  const periodBookings = useMemo(
    () =>
      completedBookings
        .filter((booking) =>
          isTimestampWithinPeriod(getBookingFinanceTimestamp(booking), periodDescriptor),
        )
        .sort(
          (left, right) =>
            new Date(getBookingFinanceTimestamp(right)).getTime() -
            new Date(getBookingFinanceTimestamp(left)).getTime(),
        ),
    [completedBookings, periodDescriptor],
  );

  const invoices = useMemo(
    () =>
      periodBookings.map((booking) => buildInvoiceFromBooking(booking, locale, fallbackCurrency)),
    [fallbackCurrency, locale, periodBookings],
  );

  const filteredInvoices = useMemo(() => {
    const query = invoiceSearchQuery.trim().toLowerCase();

    if (!query.length) {
      return invoices;
    }

    return invoices.filter((invoice) => buildInvoiceSearchText(invoice).includes(query));
  }, [invoiceSearchQuery, invoices]);

  const completedAppointments = useMemo(
    () =>
      periodBookings.map((booking) => mapCompletedAppointment(booking, locale, fallbackCurrency)),
    [fallbackCurrency, locale, periodBookings],
  );

  useEffect(() => {
    if (
      selectedOperation &&
      !completedAppointments.some((item) => item.id === selectedOperation.id)
    ) {
      setSelectedOperation(null);
      setAdditionalNotes('');
    }
  }, [completedAppointments, selectedOperation]);

  useEffect(() => {
    if (invoiceDetail && !invoices.some((item) => item.bookingId === invoiceDetail.bookingId)) {
      setInvoiceDetail(null);
    }
  }, [invoiceDetail, invoices]);

  const pendingInvoices = useMemo(
    () => invoices.filter((invoice) => PENDING_INVOICE_STATUSES.has(invoice.status)),
    [invoices],
  );

  const summarySnapshot = useMemo<BillingSummarySnapshot>(() => {
    const revenue = invoices.reduce((total, invoice) => total + invoice.amount, 0);
    const pendingAmount = pendingInvoices.reduce((total, invoice) => total + invoice.amount, 0);

    return {
      revenue,
      expenses: 0,
      net: revenue,
      currency: fallbackCurrency,
      invoiceCount: invoices.length,
      pendingCount: pendingInvoices.length,
      pendingAmount,
    };
  }, [fallbackCurrency, invoices, pendingInvoices]);

  const billingSummary = useMemo<ProviderBillingSummary>(
    () => ({
      ...summarySnapshot,
      usableBalance: summaryQuery.data?.usableBalance ?? 0,
      currentMonthDeposits: statsQuery.data?.currentMonthDeposits ?? 0,
      currentMonthDeductions: statsQuery.data?.currentMonthDeductions ?? 0,
    }),
    [statsQuery.data, summaryQuery.data, summarySnapshot],
  );

  const balanceSheetData = useMemo<BillingBalanceSheetData>(
    () => ({
      revenueLines: buildRevenueBreakdownLines(invoices),
      expenseLines: [],
    }),
    [invoices],
  );

  const documentContext = useMemo(
    () => buildDocumentContext(profileQuery.data, user, periodDescriptor),
    [periodDescriptor, profileQuery.data, user],
  );

  const taxNotes = useMemo(
    () => [
      'Les identifiants fiscaux officiels ne sont pas exposes par les sources canoniques actuelles.',
      EXPENSES_UNAVAILABLE_MESSAGE,
      'Completez et verifiez ce document avant tout depot officiel.',
    ],
    [],
  );

  const cnssNotes = useMemo(
    () => [
      'Les identifiants et calculs CNSS officiels ne sont pas exposes par les sources canoniques actuelles.',
      'Completez et verifiez ce document avant tout depot officiel.',
    ],
    [],
  );

  const ledgerNotes = useMemo(
    () =>
      invoices.length > 0
        ? []
        : ['Aucune facture canonique n est disponible sur la periode selectionnee.'],
    [invoices.length],
  );

  const hasRenderableData =
    invoices.length > 0 || Boolean(summaryQuery.data || statsQuery.data || profileQuery.data);
  const loading =
    !hasRenderableData &&
    (bookingsQuery.loading || summaryQuery.loading || statsQuery.loading || profileQuery.loading);
  const error =
    bookingsQuery.error ?? summaryQuery.error ?? statsQuery.error ?? profileQuery.error ?? null;

  function refetchAll() {
    void bookingsQuery.refetch();
    void summaryQuery.refetch();
    void statsQuery.refetch();
    void profileQuery.refetch();
  }

  function handlePdfGenerationError(errorValue: unknown, documentLabel: string) {
    if (import.meta.env.DEV) {
      console.warn(`[Billing] PDF generation failed for ${documentLabel}.`);
    }

    showErrorToast(
      errorValue,
      `Erreur lors de la generation du document « ${documentLabel} ». Veuillez reessayer.`,
    );
  }

  function preloadPdfModule() {
    void preloadBillingPdfModule().catch(() => undefined);
  }

  async function createPdfDocument(
    documentLabel: string,
    buildDocument: () => Promise<void>,
    exportKey: BillingExportKey,
    invoiceId?: string,
  ) {
    if (exportInProgressRef.current) {
      return false;
    }

    exportInProgressRef.current = true;
    setExportingDocumentKey(exportKey);
    setExportingInvoiceId(invoiceId ?? null);

    try {
      await buildDocument();
      return true;
    } catch (errorValue) {
      handlePdfGenerationError(errorValue, documentLabel);
      return false;
    } finally {
      exportInProgressRef.current = false;
      setExportingDocumentKey(null);
      setExportingInvoiceId(null);
    }
  }

  async function generateInvoicePDF(invoice: Invoice, notes?: string) {
    return createPdfDocument(
      'facture',
      () =>
        saveInvoicePdf(
          {
            ...invoice,
            notes: notes?.trim() || undefined,
          },
          documentContext,
        ),
      'invoice',
      invoice.id,
    );
  }

  async function generateTVAPDF() {
    return createPdfDocument(
      'synthese TVA',
      () =>
        saveTvaDeclarationPdf(summarySnapshot, {
          ...documentContext,
          notes: taxNotes,
        }),
      'tva',
    );
  }

  async function generateBilanPDF() {
    return createPdfDocument(
      'bilan comptable',
      () =>
        saveBalanceSheetPdf(
          summarySnapshot,
          {
            ...documentContext,
            notes: [EXPENSES_UNAVAILABLE_MESSAGE],
          },
          balanceSheetData,
        ),
      'balance',
    );
  }

  async function generateCNSSPDF() {
    return createPdfDocument(
      'synthese CNSS',
      () =>
        saveCnssDeclarationPdf(summarySnapshot, {
          ...documentContext,
          notes: cnssNotes,
        }),
      'cnss',
    );
  }

  async function generateLivreRecettesPDF() {
    return createPdfDocument(
      'livre de recettes',
      () =>
        saveRevenueLedgerPdf(invoices, summarySnapshot, {
          ...documentContext,
          notes: ledgerNotes,
        }),
      'ledger',
    );
  }

  function closeSelectOperationModal() {
    setShowSelectOperationModal(false);
    setSelectedOperation(null);
    setAdditionalNotes('');
  }

  async function handleGenerateInvoice() {
    if (!selectedOperation) {
      return;
    }

    const generated = await generateInvoicePDF(selectedOperation.invoice, additionalNotes);
    if (generated) {
      closeSelectOperationModal();
    }
  }

  return {
    activeTab,
    additionalNotes,
    completedAppointments,
    error,
    expenseDetail,
    expenses: [] as Expense[],
    expensesUnavailableMessage: EXPENSES_UNAVAILABLE_MESSAGE,
    exportBusy: exportingDocumentKey !== null,
    exportingDocumentKey,
    exportingInvoiceId,
    filteredInvoices,
    generateBilanPDF,
    generateCNSSPDF,
    generateInvoicePDF,
    generateLivreRecettesPDF,
    generateTVAPDF,
    handleGenerateInvoice,
    handleHeaderExport: () => {
      void generateLivreRecettesPDF();
    },
    hasCanonicalExpenses: false,
    hasRenderableData,
    invoiceDetail,
    invoiceSearchQuery,
    invoices,
    loading,
    period,
    periodLabel: periodDescriptor.label,
    periodRangeLabel: periodDescriptor.rangeLabel,
    preloadPdfModule,
    refetchAll,
    selectedOperation,
    setActiveTab,
    setAdditionalNotes,
    setExpenseDetail,
    setInvoiceDetail,
    setInvoiceSearchQuery,
    setPeriod,
    setSelectedOperation,
    setShowSelectOperationModal,
    showSelectOperationModal,
    summarySnapshot: billingSummary,
    closeSelectOperationModal,
  };
}
