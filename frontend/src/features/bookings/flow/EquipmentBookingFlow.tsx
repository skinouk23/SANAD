import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Calendar, Map, MapPin, ShoppingCart } from 'lucide-react';
import { BookingSuccessPanel, MonthCalendar } from '@/features/bookings/flow/ui';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useAvailability,
  useBookingQuote,
  useBookingSubmission,
  useMonthAvailability,
  usePatientBookingAddressPrefill,
} from '@/features/bookings/hooks';
import {
  AddressPickerModalSkeleton,
  BookingFlowBodyLayout,
  BookingFlowChrome,
  type BookingFlowHeaderData,
  BookingFlowSummary,
  type BookingFlowSummarySection,
  BookingInlineState,
  BookingPageErrorState,
  BookingPageLoader,
  BookingStepActions,
  SpecialBookingPaymentSection,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
} from './internal';
import { logBookingFlowError, logBookingFlowWarning } from './bookingFlowLogger';
import { formatDailyStartTime, formatDateValue } from './utils';
import { useEquipmentItem } from '@/features/equipment';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Field, FieldContent, FieldLabel } from '@/shared/ui/primitives/field';
import { Skeleton } from '@/shared/ui/composites/loading';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { EquipmentDetailResponse } from '@/features/equipment/schema';

const LazyAddressPickerModal = lazy(() =>
  loadAddressPickerModal().then((module) => ({
    default: module.AddressPickerModal,
  })),
);

type AddressPickerPreloadWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function loadAddressPickerModal() {
  return import('@/integrations/maps/AddressPickerModal');
}

function preloadAddressPickerModal() {
  void loadAddressPickerModal();
}

function scheduleAddressPickerPreload() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const preloadWindow = window as AddressPickerPreloadWindow;

  if (preloadWindow.requestIdleCallback) {
    const idleHandle = preloadWindow.requestIdleCallback(preloadAddressPickerModal, {
      timeout: 1_000,
    });

    return () => preloadWindow.cancelIdleCallback?.(idleHandle);
  }

  const timeoutHandle = window.setTimeout(preloadAddressPickerModal, 250);

  return () => window.clearTimeout(timeoutHandle);
}

type RentalDuration = 'daily' | 'weekly' | 'monthly';

type DeliveryWindow = 'morning' | 'afternoon' | 'evening';

const MILLISECONDS_PER_DAY = 86_400_000;

function formatDate(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDateParts(dateValue: string): [number, number, number] {
  const [year, month, day] = dateValue.split('-').map(Number);
  return [year, month, day];
}

function parseDate(dateValue: string): Date {
  const [year, month, day] = getDateParts(dateValue);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(dateValue: string, days: number): string {
  const nextDate = parseDate(dateValue);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return formatDate(nextDate);
}

function addCalendarMonths(dateValue: string, months: number): string {
  const nextDate = parseDate(dateValue);
  const originalDay = nextDate.getUTCDate();
  nextDate.setUTCMonth(nextDate.getUTCMonth() + months);

  if (nextDate.getUTCDate() !== originalDay) {
    nextDate.setUTCDate(0);
  }

  return formatDate(nextDate);
}

function getDayDifference(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return Math.floor((end.getTime() - start.getTime()) / MILLISECONDS_PER_DAY);
}

function getMinimumEndDate(startDate: string, duration: RentalDuration): string {
  switch (duration) {
    case 'daily':
      return addDays(startDate, 1);
    case 'weekly':
      return addDays(startDate, 7);
    case 'monthly':
      return addCalendarMonths(startDate, 1);
  }
}

function snapEndDate(startDate: string, clickedEnd: string, duration: RentalDuration): string {
  const minimumEndDate = getMinimumEndDate(startDate, duration);

  if (clickedEnd < minimumEndDate) {
    return minimumEndDate;
  }

  switch (duration) {
    case 'daily':
      return clickedEnd;
    case 'weekly': {
      const dayDiff = getDayDifference(startDate, clickedEnd);
      const snappedWeeks = Math.max(1, Math.ceil(dayDiff / 7));
      return addDays(startDate, snappedWeeks * 7);
    }
    case 'monthly': {
      let monthCount = 1;

      while (addCalendarMonths(startDate, monthCount) < clickedEnd) {
        monthCount += 1;
      }

      return addCalendarMonths(startDate, monthCount);
    }
  }
}

function computePeriodCount(startDate: string, endDate: string, duration: RentalDuration): number {
  const dayDiff = getDayDifference(startDate, endDate);

  switch (duration) {
    case 'daily':
      return Math.max(dayDiff, 1);
    case 'weekly':
      return Math.max(Math.ceil(dayDiff / 7), 1);
    case 'monthly': {
      const [startYear, startMonth, startDay] = getDateParts(startDate);
      const [endYear, endMonth, endDay] = getDateParts(endDate);
      const calendarMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

      return Math.max(endDay > startDay ? calendarMonths + 1 : calendarMonths, 1);
    }
  }
}

interface WindowBucket {
  id: DeliveryWindow;
  label: string;
  times: string[];
  firstTime: string;
}

interface DeliveryAddressState {
  label: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
}

function getDeliveryWindowId(time: string): DeliveryWindow {
  const hour = Number(time.slice(0, 2));

  if (hour < 12) {
    return 'morning';
  }

  if (hour < 17) {
    return 'afternoon';
  }

  return 'evening';
}

const DURATION_LABELS: Record<RentalDuration, string> = {
  daily: 'jour',
  weekly: 'semaine',
  monthly: 'mois',
};

const SUMMARY_REQUIRED_PLACEHOLDER = '_';
const SUMMARY_PRICE_PENDING = 'À confirmer';
const EQUIPMENT_GLASS_PANEL_CLASS_NAME =
  'rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none';
const EQUIPMENT_CYAN_PANEL_CLASS_NAME =
  'rounded-lg border border-cyan-200 bg-cyan-50/80 shadow-sm backdrop-blur-sm dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:shadow-none';
const EQUIPMENT_GRADIENT_BUTTON_CLASS_NAME =
  'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-[box-shadow,filter,transform] hover:scale-[1.02] hover:brightness-110 hover:shadow-cyan-500/40 disabled:scale-100 disabled:opacity-50 disabled:shadow-none';
const EQUIPMENT_SUMMARY_CLASS_NAME =
  'border-cyan-200/80 bg-white/85 shadow-sm shadow-cyan-500/10 backdrop-blur-sm dark:border-cyan-500/30 dark:bg-slate-800/70 dark:shadow-none';
const EQUIPMENT_SUMMARY_NOTICE_CLASS_NAME =
  'border-cyan-200 bg-cyan-50/80 text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-100 [&_svg]:text-cyan-600 [&>div>div]:text-cyan-800 dark:[&_svg]:text-cyan-300 dark:[&>div>div]:text-cyan-100';

function DeliveryWindowBucketsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <Skeleton className="mb-2 h-4 w-24 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

function formatSummaryPrice(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

function getDurationLabel(
  durationType: string | null | undefined,
  fallback: RentalDuration,
): string {
  if (durationType === 'daily' || durationType === 'weekly' || durationType === 'monthly') {
    return DURATION_LABELS[durationType];
  }

  return DURATION_LABELS[fallback];
}

export function EquipmentBookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { equipmentId } = useParams();
  const { t } = useLanguage();
  const { address: patientAddressPrefill } = usePatientBookingAddressPrefill();

  const routeState = (location.state as {
    equipment?: EquipmentDetailResponse;
    duration?: string;
  } | null) ?? { equipment: undefined, duration: undefined };

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow | ''>('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [hasOpenedAddressPicker, setHasOpenedAddressPicker] = useState(false);
  const [deliveryAddressEdited, setDeliveryAddressEdited] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddressState>({
    label: '',
    fullAddress: '',
    city: '',
    postalCode: '',
    latitude: null,
    longitude: null,
  });

  const stateEquipment = routeState.equipment ?? null;
  const {
    data: fetchedEquipment,
    loading: equipmentLoading,
    error: equipmentError,
  } = useEquipmentItem(stateEquipment ? undefined : equipmentId);
  const equipment = stateEquipment ?? fetchedEquipment;
  const duration = (routeState.duration ?? 'daily') as RentalDuration;
  const selectedServiceIds = useMemo(() => (equipment?.id ? [equipment.id] : []), [equipment?.id]);
  const [rentalEndDate, setRentalEndDate] = useState('');
  const debouncedBookingDate = useDebouncedValue(bookingDate, 300);
  const availabilityParams = useMemo(
    () =>
      bookingDate && selectedServiceIds.length > 0
        ? {
            startDate: bookingDate,
            endDate: bookingDate,
            serviceIds: selectedServiceIds,
          }
        : null,
    [bookingDate, selectedServiceIds],
  );

  const {
    days: monthAvailabilityDays,
    error: monthError,
    errorMessage: monthErrorMessage,
    loading: monthLoading,
    maxBookableDate: calendarMaxDate,
    refetch: refetchMonthAvailability,
  } = useMonthAvailability(
    equipment?.provider?.id,
    calendarYear,
    calendarMonth,
    selectedServiceIds,
    {
      errorFallback: t.bookingFlow.bookingErrorGeneric,
      pollingEnabled: currentStep === 1,
    },
  );
  const {
    availableStartTimes,
    availabilityErrorMessage: windowsErrorMessage,
    availabilityLoading: windowsLoading,
  } = useAvailability(
    equipment?.provider?.id,
    availabilityParams,
    t.bookingFlow.bookingErrorGeneric,
    { pollingEnabled: currentStep === 1 },
  );

  useEffect(() => {
    if (!patientAddressPrefill || deliveryAddressEdited) {
      return;
    }

    setDeliveryAddress({
      label: 'Domicile',
      fullAddress: patientAddressPrefill.displayAddress,
      city: patientAddressPrefill.city ?? '',
      postalCode: patientAddressPrefill.postalCode ?? '',
      latitude: patientAddressPrefill.latitude,
      longitude: patientAddressPrefill.longitude,
    });
  }, [deliveryAddressEdited, patientAddressPrefill]);

  const monthDays = useMemo(
    () =>
      monthAvailabilityDays.reduce<Array<{ date: string; slotCount: number }>>((days, day) => {
        const date = formatDateValue(day.date);

        if (!date) {
          return days;
        }

        days.push({ date, slotCount: day.slotCount });
        return days;
      }, []),
    [monthAvailabilityDays],
  );
  const windowsPending = Boolean(bookingDate) && bookingDate !== debouncedBookingDate;
  const showWindowLoading = Boolean(bookingDate) && (windowsPending || windowsLoading);
  const windowBuckets = useMemo<WindowBucket[]>(() => {
    if (!bookingDate || showWindowLoading || windowsErrorMessage) {
      return [];
    }

    const groupedTimes: Record<DeliveryWindow, string[]> = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    availableStartTimes.forEach((time) => {
      groupedTimes[getDeliveryWindowId(time)].push(time);
    });

    const buckets: Array<Omit<WindowBucket, 'firstTime'>> = [
      { id: 'morning', label: t.booking.morning, times: groupedTimes.morning },
      { id: 'afternoon', label: t.booking.afternoon, times: groupedTimes.afternoon },
      { id: 'evening', label: t.booking.evening, times: groupedTimes.evening },
    ];

    return buckets
      .filter((bucket) => bucket.times.length > 0)
      .map((bucket) => ({
        ...bucket,
        firstTime: bucket.times[0] ?? '',
      }));
  }, [
    availableStartTimes,
    bookingDate,
    showWindowLoading,
    t.booking.afternoon,
    t.booking.evening,
    t.booking.morning,
    windowsErrorMessage,
  ]);
  const selectedWindowBucket = windowBuckets.find((bucket) => bucket.id === selectedWindow) ?? null;
  const resolvedDeliveryTime = selectedWindowBucket?.firstTime ?? '';
  const resolvedDeliveryLabel = selectedWindowBucket?.label ?? '';
  const resolvedDeliveryDisplay =
    resolvedDeliveryTime && resolvedDeliveryLabel
      ? `${resolvedDeliveryLabel} (${resolvedDeliveryTime})`
      : '';
  const priceMap = {
    daily: equipment?.pricePerDay ?? 0,
    weekly: equipment?.pricePerWeek ?? 0,
    monthly: equipment?.pricePerMonth ?? 0,
  };
  const price = priceMap[duration] ?? equipment?.pricePerDay ?? 0;
  const hasSelectedRentalDates = Boolean(bookingDate && rentalEndDate);
  const periodCount = hasSelectedRentalDates
    ? computePeriodCount(bookingDate, rentalEndDate, duration)
    : 1;
  const rentalSubtotal = periodCount * price;
  const sideRentalSubtotal = hasSelectedRentalDates ? rentalSubtotal : 0;
  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    if (
      currentStep < 2 ||
      !equipment ||
      !bookingDate ||
      !rentalEndDate ||
      !resolvedDeliveryTime ||
      !deliveryAddress.fullAddress ||
      !agreedToTerms ||
      equipment.availableQuantity <= 0
    ) {
      return null;
    }

    return {
      providerId: equipment.provider.id,
      serviceItems: [{ serviceId: equipment.id, quantity: 1 }],
      startDate: bookingDate,
      endDate: bookingDate,
      dailyStartTime: formatDailyStartTime(resolvedDeliveryTime),
      address: {
        line1: deliveryAddress.fullAddress,
        city: deliveryAddress.city || null,
        postalCode: deliveryAddress.postalCode || null,
        latitude: deliveryAddress.latitude,
        longitude: deliveryAddress.longitude,
      },
      typeConfig: {
        endDate: rentalEndDate,
        rentalDurationType: duration,
        periodCount,
        periodRate: price,
      },
    };
  }, [
    agreedToTerms,
    bookingDate,
    currentStep,
    deliveryAddress,
    duration,
    equipment,
    periodCount,
    price,
    rentalEndDate,
    resolvedDeliveryTime,
  ]);
  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);
  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(3),
    onSlotConflict: () => {
      setCurrentStep(1);
      setBookingDate('');
      setRentalEndDate('');
      setSelectedWindow('');
      void refetchMonthAvailability();
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'EquipmentBooking quote mismatch detected; refetching authoritative quote.',
        {
          hasMismatchDetails: Boolean(details),
        },
      );
      void refetchQuote();
    },
  });

  useEffect(() => {
    setSelectedWindow('');
  }, [bookingDate]);

  useEffect(() => {
    if (!selectedWindow) {
      return;
    }

    if (!windowBuckets.some((bucket) => bucket.id === selectedWindow)) {
      setSelectedWindow('');
    }
  }, [selectedWindow, windowBuckets]);

  useEffect(() => {
    if (!windowsErrorMessage || !bookingDate) {
      return;
    }

    logBookingFlowError('[EquipmentBooking] Failed to load delivery windows.', {
      bookingDate,
      errorMessage: windowsErrorMessage,
      providerId: equipment?.provider?.id ?? null,
    });
  }, [bookingDate, equipment?.provider?.id, windowsErrorMessage]);

  useEffect(() => {
    if (!bookingDate || showWindowLoading || windowBuckets.length > 0) {
      return;
    }

    logBookingFlowError('[EquipmentBooking] No delivery windows available for selected date.', {
      availableSlotCount: availableStartTimes.length,
      bookingDate,
      providerId: equipment?.provider?.id ?? null,
    });
  }, [
    availableStartTimes,
    bookingDate,
    equipment?.provider?.id,
    showWindowLoading,
    windowBuckets.length,
  ]);

  useEffect(() => {
    if (currentStep !== 2 || quoteLoading) {
      return;
    }

    if (!quote) {
      logBookingFlowWarning('EquipmentBooking quote unavailable on payment step.', {
        errorMessage: quoteError instanceof Error ? quoteError.message : null,
        hasQuoteRequest: Boolean(quoteRequest),
      });
      return;
    }

    if (!quote.equipmentRental) {
      logBookingFlowWarning('EquipmentBooking quote missing equipmentRental on payment step.', {
        hasEquipmentRental: Boolean(quote.equipmentRental),
        hasQuoteRequest: Boolean(quoteRequest),
      });
    }
  }, [currentStep, quote, quoteError, quoteLoading, quoteRequest]);

  useEffect(() => {
    if (currentStep !== 1) {
      return undefined;
    }

    return scheduleAddressPickerPreload();
  }, [currentStep]);

  if (equipmentLoading) {
    return <BookingPageLoader />;
  }

  if (equipmentError || !equipment) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        description={t.serviceListing.errorLoading}
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/equipment')}
      />
    );
  }

  const displayPeriodRate = quote?.equipmentRental?.periodRate ?? price;
  const displayPeriodCount = quote?.equipmentRental?.periodCount ?? periodCount;
  const displayDeposit = quote?.equipmentRental?.depositAmount ?? equipment.deposit;
  const displayRentalDurationType = quote?.equipmentRental?.rentalDurationType ?? duration;
  const resolvedDisplayDurationType: RentalDuration =
    displayRentalDurationType === 'daily' ||
    displayRentalDurationType === 'weekly' ||
    displayRentalDurationType === 'monthly'
      ? displayRentalDurationType
      : duration;
  const displayDurationLabel = getDurationLabel(resolvedDisplayDurationType, duration);
  const rentalSubtotalDisplay = displayPeriodCount * displayPeriodRate;
  const quoteBackedPricing = quote?.equipmentRental ? quote.pricing : null;
  const isEquipmentQuoteInvalid = Boolean(quote && !quote.equipmentRental);
  const totalPrice =
    quote && quote.equipmentRental ? quote.pricing.totalAmount : rentalSubtotal + equipment.deposit;
  const quoteCurrency = quote?.pricing.currency ?? t.equipment.currency;
  const quoteErrorMessage =
    quoteError instanceof Error
      ? quoteError.message
      : isEquipmentQuoteInvalid
        ? 'Le devis de location renvoyé par le serveur est incomplet. Réessayez plus tard.'
        : t.bookingFlow.bookingErrorGeneric;
  const rentalDurationSummary =
    displayPeriodCount > 1
      ? `${displayPeriodCount} ${displayDurationLabel}${resolvedDisplayDurationType === 'monthly' ? '' : 's'}`
      : `1 ${displayDurationLabel}`;
  const rentalPricingBreakdown = `${displayPeriodCount} × ${displayPeriodRate.toFixed(2)} ${quoteCurrency}/${displayDurationLabel}`;
  const canContinueToPayment = Boolean(
    bookingDate &&
    rentalEndDate &&
    resolvedDeliveryTime &&
    deliveryAddress.fullAddress &&
    agreedToTerms &&
    equipment.availableQuantity > 0,
  );
  const confirmedStartDate = formatDateValue(submission.bookingResult?.startDate) ?? bookingDate;
  const confirmedEndDate =
    formatDateValue(submission.bookingResult?.equipmentRental?.endDate) ?? rentalEndDate;
  const confirmedCurrency = submission.bookingResult?.pricing?.currency ?? quoteCurrency;
  const confirmedPeriodRate =
    submission.bookingResult?.equipmentRental?.periodRate ?? displayPeriodRate;
  const confirmedPeriodCount =
    submission.bookingResult?.equipmentRental?.periodCount ?? displayPeriodCount;
  const confirmedDeposit =
    submission.bookingResult?.equipmentRental?.depositAmount ?? displayDeposit;
  const confirmedRentalDurationType =
    submission.bookingResult?.equipmentRental?.rentalDurationType ?? resolvedDisplayDurationType;
  const resolvedConfirmedDurationType: RentalDuration =
    confirmedRentalDurationType === 'daily' ||
    confirmedRentalDurationType === 'weekly' ||
    confirmedRentalDurationType === 'monthly'
      ? confirmedRentalDurationType
      : resolvedDisplayDurationType;
  const confirmedDurationLabel = getDurationLabel(
    resolvedConfirmedDurationType,
    resolvedDisplayDurationType,
  );
  const confirmedDurationSummary =
    confirmedPeriodCount > 1
      ? `${confirmedPeriodCount} ${confirmedDurationLabel}${resolvedConfirmedDurationType === 'monthly' ? '' : 's'}`
      : `1 ${confirmedDurationLabel}`;
  const confirmedPricingBreakdown = `${confirmedPeriodCount} × ${confirmedPeriodRate.toFixed(2)} ${confirmedCurrency}/${confirmedDurationLabel}`;
  const confirmedTotal = submission.bookingResult?.pricing?.totalAmount ?? totalPrice;
  const stepLabels = [
    t.bookingFlow.stepDetails,
    t.bookingFlow.stepPayment,
    t.bookingFlow.stepConfirmation,
  ];
  const hasQuoteBackedPricing = Boolean(quoteBackedPricing);
  const rentalSubtotalSummary = hasQuoteBackedPricing
    ? formatSummaryPrice(rentalSubtotalDisplay, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const depositSummary = hasQuoteBackedPricing
    ? formatSummaryPrice(displayDeposit, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const totalPriceSummary = hasQuoteBackedPricing
    ? formatSummaryPrice(totalPrice, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const sideRentalSubtotalSummary = formatSummaryPrice(sideRentalSubtotal, t.equipment.currency);
  const dateRangeSummary = `${bookingDate || SUMMARY_REQUIRED_PLACEHOLDER} → ${
    rentalEndDate || SUMMARY_REQUIRED_PLACEHOLDER
  }`;
  const equipmentSummarySection: BookingFlowSummarySection = {
    title: 'Matériel',
    items: [
      {
        label: equipment.name || SUMMARY_REQUIRED_PLACEHOLDER,
        value: sideRentalSubtotalSummary,
        valueTitle: sideRentalSubtotalSummary,
        className: summaryServiceRowClassName,
        valueClassName: summaryServiceValueClassName,
      },
      {
        label: 'Fournisseur',
        value: equipment.provider.name || SUMMARY_REQUIRED_PLACEHOLDER,
        valueTitle: equipment.provider.name || SUMMARY_REQUIRED_PLACEHOLDER,
        className: 'mt-3 border-t border-border/70 pt-3',
      },
      {
        label: 'Mode',
        value: `Location par ${displayDurationLabel}`,
      },
    ],
  };
  const detailSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Période',
      items: [
        {
          label: 'Date',
          value: dateRangeSummary,
          valueTitle: dateRangeSummary,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Durée',
          value:
            bookingDate && rentalEndDate ? rentalDurationSummary : SUMMARY_REQUIRED_PLACEHOLDER,
          valueClassName: 'font-normal',
        },
        {
          label: 'Créneau',
          value: resolvedDeliveryDisplay || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: resolvedDeliveryDisplay || SUMMARY_REQUIRED_PLACEHOLDER,
        },
      ],
    },
    {
      title: 'Adresse',
      items: [
        {
          label: t.bookingFlow.deliveryAddress,
          value: deliveryAddress.fullAddress || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: deliveryAddress.fullAddress || SUMMARY_REQUIRED_PLACEHOLDER,
        },
      ],
    },
  ];
  const bookingSummarySections: BookingFlowSummarySection[] = [
    equipmentSummarySection,
    ...(currentStep === 1 ? detailSummarySections : []),
  ];
  const pricingSummarySection: BookingFlowSummarySection = {
    title: 'Tarification',
    items: [
      {
        label: 'Location',
        value: rentalSubtotalSummary,
        valueTitle: rentalSubtotalSummary,
      },
      {
        label: 'Détail location',
        value: hasQuoteBackedPricing ? rentalPricingBreakdown : undefined,
        valueTitle: hasQuoteBackedPricing ? rentalPricingBreakdown : undefined,
        hidden: !hasQuoteBackedPricing,
      },
      {
        label: 'Livraison',
        value: 'Gratuit',
        valueClassName: 'text-success',
      },
      {
        label: t.equipment.depositGuarantee,
        value: depositSummary,
        valueTitle: depositSummary,
      },
      {
        label: t.bookingFlow.serviceFees,
        value: quoteBackedPricing
          ? formatSummaryPrice(quoteBackedPricing.platformFee, quoteCurrency)
          : undefined,
        hidden: !quoteBackedPricing,
      },
      {
        label: 'Devise',
        value: hasQuoteBackedPricing ? quoteCurrency : SUMMARY_PRICE_PENDING,
      },
    ],
  };
  const paymentSummarySections: BookingFlowSummarySection[] = [
    equipmentSummarySection,
    ...detailSummarySections,
    pricingSummarySection,
  ];
  const shouldShowSideSummary = currentStep !== 2 && currentStep !== 3;
  const bookingSummary = shouldShowSideSummary ? (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      icon={<ShoppingCart />}
      className={EQUIPMENT_SUMMARY_CLASS_NAME}
      iconClassName="bg-transparent text-cyan-700 dark:text-cyan-300"
      sections={bookingSummarySections}
      total={{
        label: t.bookingFlow.subtotal,
        value: sideRentalSubtotalSummary,
        valueTitle: sideRentalSubtotalSummary,
        variant: 'line',
        className: 'border-cyan-200/70 dark:border-cyan-500/30',
        labelClassName: 'text-base font-extrabold uppercase tracking-wide text-foreground',
        valueClassName: 'text-sm font-semibold text-muted-foreground',
      }}
      notice="Livraison sous 24-48h. Annulation gratuite jusqu'à 24h avant."
      noticeClassName={EQUIPMENT_SUMMARY_NOTICE_CLASS_NAME}
    />
  ) : null;
  const paymentSummary = (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      className={EQUIPMENT_SUMMARY_CLASS_NAME}
      sections={paymentSummarySections}
      total={{
        label: t.bookingFlow.totalToPay,
        value: totalPriceSummary,
        valueTitle: totalPriceSummary,
        className: 'border-cyan-200 bg-cyan-50/80 dark:border-cyan-500/30 dark:bg-cyan-500/10',
        valueClassName: hasQuoteBackedPricing ? 'text-cyan-600 dark:text-cyan-300' : undefined,
        description: hasQuoteBackedPricing
          ? `Dont ${formatSummaryPrice(displayDeposit, quoteCurrency)} de dépôt (remboursable)`
          : undefined,
      }}
      notice="Livraison sous 24-48h. Annulation gratuite jusqu'à 24h avant."
      noticeClassName={EQUIPMENT_SUMMARY_NOTICE_CLASS_NAME}
    />
  );
  const bookingHeader: BookingFlowHeaderData = {
    providerName: equipment.provider.name,
    providerImageUrl: null,
    rating: {
      average: equipment.provider.rating,
      count: null,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: t.equipment.rentalTitle,
    locationLabel: equipment.provider.city,
    subtitle: equipment.name,
  };

  const handleRangeSelect = (startDate: string, endDate: string | null) => {
    if (!endDate) {
      setBookingDate(startDate);
      setRentalEndDate('');
      setSelectedWindow('');
      return;
    }

    if (endDate === startDate) {
      setBookingDate(startDate);
      setRentalEndDate(getMinimumEndDate(startDate, duration));
      return;
    }

    setBookingDate(startDate);
    setRentalEndDate(snapEndDate(startDate, endDate, duration));
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const handlePaymentComplete = (paymentMethod: 'card' | 'd17' | 'cash') => {
    if (!quoteRequest || !quote || !quote.equipmentRental) {
      return;
    }

    void submission
      .submit({
        ...quoteRequest,
        paymentMethod,
        expectedTotalAmount: quote.pricing.totalAmount,
      })
      .catch(() => undefined);
  };

  const openAddressPicker = () => {
    setHasOpenedAddressPicker(true);
    setShowAddressPicker(true);
    preloadAddressPickerModal();
  };

  return (
    <BookingFlowChrome
      className="px-6 py-8 pb-24 text-foreground"
      currentStep={currentStep}
      header={bookingHeader}
      innerClassName="max-w-5xl"
      showProgress={currentStep !== 3}
      stepLabels={stepLabels}
    >
      <BookingFlowBodyLayout summary={bookingSummary} mainClassName="space-y-6">
        {currentStep === 1 ? (
          <div className={`${EQUIPMENT_GLASS_PANEL_CLASS_NAME} p-6`}>
            <h2 className={`text-2xl font-bold mb-6 text-foreground`}>{t.equipment.rentalTitle}</h2>

            <div className={`${EQUIPMENT_CYAN_PANEL_CLASS_NAME} mb-6 p-4`}>
              <h3 className={`font-bold text-foreground`}>{equipment.name}</h3>
              <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-200">
                Stock disponible : {equipment.availableQuantity}
              </p>
            </div>

            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 text-foreground`}>Durée de location</h3>
              <div className={`${EQUIPMENT_CYAN_PANEL_CLASS_NAME} p-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-700 dark:text-cyan-200">
                    Location par {DURATION_LABELS[duration]}
                  </span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300">
                    {price} {t.equipment.currency}/{DURATION_LABELS[duration]}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-3 text-foreground/80`}>
                  Date de livraison souhaitée *
                </label>
                <MonthCalendar
                  year={calendarYear}
                  month={calendarMonth}
                  days={monthDays}
                  selectedDate={null}
                  onSelectDate={() => undefined}
                  onMonthChange={handleMonthChange}
                  loading={monthLoading}
                  maxDate={calendarMaxDate ?? undefined}
                  disabled={equipment.availableQuantity <= 0}
                  mode="range"
                  rangeStartDate={bookingDate || null}
                  rangeEndDate={rentalEndDate || null}
                  onRangeSelect={handleRangeSelect}
                  rangeHelperText={
                    bookingDate && !rentalEndDate
                      ? `${t.bookingFlow.calendarSelectEndDay} (min. 1 ${DURATION_LABELS[duration]})`
                      : undefined
                  }
                />
                {monthError ? (
                  <BookingInlineState
                    className="mt-3"
                    tone="danger"
                    title="Impossible de charger les dates disponibles"
                    description={monthErrorMessage ?? t.bookingFlow.bookingErrorGeneric}
                  />
                ) : null}
              </div>

              <div className={`${EQUIPMENT_CYAN_PANEL_CLASS_NAME} flex items-center gap-3 p-4`}>
                <Calendar className="h-5 w-5 flex-shrink-0 text-cyan-600 dark:text-cyan-300" />
                <div>
                  <p className={`text-sm font-medium text-foreground`}>
                    {bookingDate && rentalEndDate
                      ? `${bookingDate} → ${rentalEndDate}`
                      : 'Sélectionnez une date de livraison'}
                  </p>
                  <p className={`text-xs text-muted-foreground`}>
                    Période de location : {rentalDurationSummary}
                  </p>
                  {bookingDate && rentalEndDate ? (
                    <p className={`text-xs text-muted-foreground`}>
                      Prix location : {rentalPricingBreakdown}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-4 text-foreground`}>
                  Créneau de livraison souhaité
                </h3>

                {!bookingDate ? (
                  <p className={`text-sm text-muted-foreground`}>
                    Sélectionnez d&apos;abord une date de livraison pour voir les créneaux
                    disponibles.
                  </p>
                ) : null}

                {showWindowLoading && windowBuckets.length === 0 ? (
                  <DeliveryWindowBucketsSkeleton />
                ) : null}

                {showWindowLoading && windowBuckets.length > 0 ? (
                  <BookingInlineState
                    tone="info"
                    title="Actualisation des créneaux de livraison"
                    description="Les disponibilités affichées restent visibles pendant la vérification en arrière-plan."
                    className="mb-3"
                  />
                ) : null}

                {!showWindowLoading && bookingDate && windowsErrorMessage ? (
                  <BookingInlineState
                    tone="danger"
                    title="Impossible de charger les créneaux de livraison"
                    description={windowsErrorMessage}
                  />
                ) : null}

                {!showWindowLoading &&
                bookingDate &&
                !windowsErrorMessage &&
                windowBuckets.length === 0 ? (
                  <BookingInlineState
                    tone="muted"
                    title="Aucun créneau de livraison disponible pour cette date."
                    description="Choisissez un autre jour pour afficher les fenêtres de livraison."
                  />
                ) : null}

                {!showWindowLoading && bookingDate && windowBuckets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {windowBuckets.map((bucket) => {
                      const lastTime = bucket.times[bucket.times.length - 1] ?? bucket.firstTime;
                      const isSelected = selectedWindow === bucket.id;

                      return (
                        <button
                          key={bucket.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedWindow(bucket.id)}
                          className={`rounded-xl border p-4 text-left shadow-sm backdrop-blur-sm transition-[background-color,border-color,box-shadow,transform] ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-50/90 shadow-cyan-500/15 dark:border-cyan-400/60 dark:bg-cyan-500/15'
                              : 'border-slate-200 bg-white/70 hover:border-cyan-300 hover:bg-cyan-50/70 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10'
                          }`}
                        >
                          <p className={`text-sm font-semibold text-foreground`}>{bucket.label}</p>
                          <p className={`text-xs mt-1 text-muted-foreground`}>
                            {bucket.firstTime} – {lastTime}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 text-foreground`}>
                {t.bookingFlow.deliveryAddress}
              </h3>
              <div className={`${EQUIPMENT_CYAN_PANEL_CLASS_NAME} flex items-start p-4`}>
                <MapPin className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-cyan-600 dark:text-cyan-300" />

                <div className="flex-grow min-w-0">
                  <p className={`font-medium text-foreground`}>
                    {deliveryAddress.label || 'Adresse de livraison'}
                  </p>
                  <p className={`text-sm truncate text-muted-foreground`}>
                    {deliveryAddress.fullAddress || 'Choisissez une adresse de livraison'}
                  </p>
                  <button
                    type="button"
                    onClick={openAddressPicker}
                    onFocus={() => preloadAddressPickerModal()}
                    onPointerEnter={() => preloadAddressPickerModal()}
                    className="mt-2 flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200"
                  >
                    <Map className="h-4 w-4" />
                    {t.booking.changeAddress}
                  </button>
                </div>
              </div>
            </div>

            {equipment.availableQuantity <= 0 ? (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300/70 bg-amber-50/90 p-4 shadow-sm backdrop-blur-sm dark:border-amber-400/40 dark:bg-amber-500/10">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-300" />
                <div className="text-sm text-amber-800 dark:text-amber-100">
                  <p className="font-semibold">Matériel indisponible</p>
                  <p className={`mt-1`}>
                    Ce matériel n&apos;a plus de stock disponible pour le moment.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mb-6 rounded-lg border border-cyan-200 bg-cyan-50/80 p-4 shadow-sm backdrop-blur-sm dark:border-cyan-500/30 dark:bg-cyan-500/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-600 dark:text-cyan-300" />

                <div className="text-sm text-cyan-800 dark:text-cyan-100">
                  <p className="font-semibold mb-2">Important</p>
                  <ul className={`space-y-1`}>
                    <li>
                      • {t.equipment.depositGuarantee} {equipment.deposit} {t.equipment.currency}
                    </li>
                    <li>• Matériel à restituer en bon état</li>
                    <li>• {t.equipment.installationIncluded}</li>
                  </ul>
                </div>
              </div>
            </div>

            <Field orientation="horizontal" className="mb-6 items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                className="mt-1"
              />

              <FieldContent>
                <FieldLabel htmlFor="terms" className="text-sm text-muted-foreground">
                  J&apos;accepte les{' '}
                  <a href="#" className="underline text-primary">
                    conditions générales
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="underline text-primary">
                    politique de confidentialité
                  </a>
                </FieldLabel>
              </FieldContent>
            </Field>

            <BookingStepActions
              onNext={() => setCurrentStep(2)}
              nextDisabled={!canContinueToPayment}
              nextLabel={t.bookingFlow.continueToPayment}
              nextType="button"
              nextButtonClassName={EQUIPMENT_GRADIENT_BUTTON_CLASS_NAME}
            />
          </div>
        ) : null}

        {currentStep === 2 ? (
          <SpecialBookingPaymentSection
            backLabel={t.bookingFlow.previous}
            onBack={() => setCurrentStep(1)}
            quoteLoading={quoteLoading}
            quoteError={quoteError}
            quoteReady={Boolean(quote?.equipmentRental)}
            quoteErrorMessage={quoteErrorMessage}
            loadingLabel={t.common.loading}
            retryLabel={t.common.retry}
            errorTitle={t.bookingFlow.error}
            onRetry={() => {
              void refetchQuote();
            }}
            totalPrice={totalPrice}
            onPaymentComplete={handlePaymentComplete}
            isSubmitting={submission.isSubmitting}
            serviceName={equipment.name}
            providerName={equipment.provider.name}
            date={bookingDate && rentalEndDate ? `${bookingDate} → ${rentalEndDate}` : bookingDate}
            time={resolvedDeliveryDisplay}
            cashAvailable={quote?.cashAvailable ?? true}
            paymentSummary={paymentSummary}
            backButtonClassName="border-cyan-200 bg-white/80 text-cyan-700 backdrop-blur-sm hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 dark:border-cyan-500/30 dark:bg-slate-800/50 dark:text-cyan-300 dark:hover:border-cyan-400/50 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-200"
            paymentPanelClassName={EQUIPMENT_SUMMARY_CLASS_NAME}
            paymentNoticeClassName={EQUIPMENT_SUMMARY_NOTICE_CLASS_NAME}
            paymentOptionClassName="border-slate-200 bg-white/70 backdrop-blur-sm hover:border-cyan-300 hover:bg-cyan-50/70 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10"
            paymentOptionSelectedClassName="border-cyan-400 bg-cyan-50/90 dark:border-cyan-400/60 dark:bg-cyan-500/15"
            paymentActionClassName={EQUIPMENT_GRADIENT_BUTTON_CLASS_NAME}
          />
        ) : null}

        {currentStep === 3 ? (
          <BookingSuccessPanel
            bookingNumber={submission.bookingResult?.bookingNumber}
            onGoToDashboard={() => navigate('/patient-dashboard')}
            onViewServices={() => navigate('/equipment')}
          >
            <p className={`text-sm text-muted-foreground`}>
              Votre demande de location a bien été enregistrée. Vous recevrez un SMS de confirmation
              avant la livraison.
            </p>

            <div
              className={`${EQUIPMENT_CYAN_PANEL_CLASS_NAME} grid grid-cols-1 gap-2 px-4 py-3 text-left text-xs text-foreground/80 sm:grid-cols-2`}
            >
              <p>
                <span className="font-semibold">Matériel:</span> {equipment.name}
              </p>
              <p>
                <span className="font-semibold">Durée:</span> {confirmedDurationSummary}
              </p>
              <p>
                <span className="font-semibold">{t.bookingFlow.selectDate}:</span>{' '}
                {confirmedStartDate}
              </p>
              <p>
                <span className="font-semibold">{t.bookingFlow.selectEndDate}:</span>{' '}
                {confirmedEndDate}
              </p>
              <p>
                <span className="font-semibold">Créneau de livraison:</span>{' '}
                {resolvedDeliveryDisplay || '—'}
              </p>
              <p>
                <span className="font-semibold">Montant:</span> {confirmedTotal.toFixed(2)}{' '}
                {confirmedCurrency}
              </p>
            </div>

            <div
              className={`${EQUIPMENT_CYAN_PANEL_CLASS_NAME} px-4 py-3 text-left text-xs text-foreground/80`}
            >
              <p className={`font-semibold text-foreground`}>{t.bookingFlow.deliveryAddress}</p>
              <p className="mt-2">{deliveryAddress.fullAddress}</p>
              <p className="mt-2">Prix location affiché : {confirmedPricingBreakdown}</p>
              <p className="mt-2">
                Dépôt de garantie affiché : {confirmedDeposit.toFixed(2)} {confirmedCurrency}
              </p>
            </div>
          </BookingSuccessPanel>
        ) : null}
      </BookingFlowBodyLayout>

      {hasOpenedAddressPicker ? (
        <Suspense fallback={<AddressPickerModalSkeleton />}>
          <LazyAddressPickerModal
            isOpen={showAddressPicker}
            onClose={() => setShowAddressPicker(false)}
            onSelectAddress={(selectedAddress) => {
              setDeliveryAddressEdited(true);
              setDeliveryAddress({
                label: 'Adresse sélectionnée',
                fullAddress: selectedAddress.fullAddress,
                city: selectedAddress.city,
                postalCode: selectedAddress.postalCode,
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude,
              });
            }}
            initialLatitude={deliveryAddress.latitude ?? patientAddressPrefill?.latitude ?? 36.8065}
            initialLongitude={
              deliveryAddress.longitude ?? patientAddressPrefill?.longitude ?? 10.1815
            }
          />
        </Suspense>
      ) : null}
    </BookingFlowChrome>
  );
}
