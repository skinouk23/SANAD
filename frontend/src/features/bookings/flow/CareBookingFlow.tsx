import { type FormEvent, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Check,
  Clock,
  FileText,
  Heart,
  Home,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  Zap,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookingMapButton,
  BookingSuccessPanel,
  DaySlotPicker,
  MonthCalendar,
  PrescriptionUploadGate,
  ServiceLocationToggle,
  PaymentStep,
} from '@/features/bookings/flow/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useBookingProvider,
  useBookingQuote,
  useBookingSubmission,
  useCareAvailability,
  useCareMonthAvailability,
  usePatientBookingAddressPrefill,
} from '@/features/bookings/hooks';
import { useServiceLocationChoice } from '@/features/bookings/hooks/useServiceLocationChoice';
import {
  AddressPickerModalSkeleton,
  BookingFlowBodyLayout,
  BookingFlowChrome,
  type BookingFlowHeaderData,
  BookingFlowSummary,
  type BookingFlowSummarySection,
  BookingInlineState,
  BookingOptionListSkeleton,
  BookingPageErrorState,
  BookingPageLoader,
  BookingQuotePanel,
  BookingStepActions,
  BookingSurface,
  bookingAccentInactiveOptionClassName,
  bookingAccentSelectedOptionClassName,
  bookingBothLocationBadgeClassName,
  bookingCyanTotalClassName,
  bookingDurationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingNeutralPanelClassName,
  bookingNeutralSuccessCardClassName,
  bookingPrescriptionRequiredBadgeClassName,
  bookingProviderLocationBadgeClassName,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
  useBookingAvailabilityPresentation,
} from './internal';
import { logBookingFlowWarning } from './bookingFlowLogger';
import {
  formatDailyStartTime,
  formatDateLabel,
  formatSelectedServicesDuration,
  formatServiceDuration,
  formatServicePrice,
  formatTimeLabel,
  getServiceLocationBadgeVariant,
} from './utils';
import {
  getProviderDisplayName,
  getProviderImageUrl,
  getProviderLocation,
  providerKeys,
} from '@/features/providers/public-api';
import {
  createServiceAccentVariables,
  useServiceAccent,
  useServiceCatalog,
  useServiceCategories,
} from '@/features/services';
import { cn } from '@/shared/lib/utils';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';
import { createDefaultTunisiaPhoneValue } from '@/utils/input-validation';
import type { BookingQuoteRequest } from '@/features/bookings/schema';

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

const SUMMARY_REQUIRED_PLACEHOLDER = '_';
const SUMMARY_PRICE_PENDING = 'À confirmer';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getInclusiveDayCount(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return null;
  }

  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }

  return Math.floor((end - start) / DAY_IN_MS) + 1;
}

export function CareBookingFlow() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { address: patientAddressPrefill } = usePatientBookingAddressPrefill();
  const { serviceId, providerId } = useParams();
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useBookingProvider(providerId);
  const {
    items: providerServices,
    loading: servicesLoading,
    error: servicesError,
    refetch: refetchServiceCatalog,
  } = useServiceCatalog({
    category: serviceId,
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent(serviceId);
  const accentVariables = createServiceAccentVariables(accent);
  const { allCategories } = useServiceCategories();
  const queryClient = useQueryClient();
  const flowMessages = t.bookingFlow as Record<string, string>;
  const defaultFailureMessage = flowMessages['booking' + 'ErrorGeneric'];
  const currency = providerServices[0]?.currency ?? 'TND';
  const categoryLabel =
    allCategories.find((category) => category.code === serviceId)?.label ?? serviceId ?? '';

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [address, setAddress] = useState('');
  const [addressEdited, setAddressEdited] = useState(false);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [addressDetails, setAddressDetails] = useState<{
    city: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null>(null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [hasOpenedAddressPicker, setHasOpenedAddressPicker] = useState(false);
  const [prescriptionFileId, setPrescriptionFileId] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    phone: createDefaultTunisiaPhoneValue(),
    email: '',
    medicalNotes: '',
  });
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);

  const hasAvailabilitySelection = Boolean(
    bookingDate && bookingEndDate && selectedSubServices.length > 0,
  );
  const availability = useCareAvailability(
    provider?.id,
    hasAvailabilitySelection
      ? { startDate: bookingDate, endDate: bookingEndDate, serviceIds: selectedSubServices }
      : null,
    defaultFailureMessage,
    { pollingEnabled: currentStep === 1 },
  );
  const {
    days: monthAvailabilityDays,
    error: monthError,
    errorMessage: monthErrorMessage,
    loading: monthLoading,
    timezone: providerTimezone,
    maxBookableDate: calendarMaxDate,
  } = useCareMonthAvailability(provider?.id, calendarYear, calendarMonth, selectedSubServices, {
    errorFallback: defaultFailureMessage,
    pollingEnabled: currentStep === 1,
  });
  const selectedServices = useMemo(
    () => providerServices.filter((service) => selectedSubServices.includes(service.id)),
    [providerServices, selectedSubServices],
  );
  const locationAwareServices = useMemo(
    () =>
      servicesError
        ? selectedServices.map((service) => ({
            ...service,
            serviceLocation: 'home',
          }))
        : selectedServices,
    [selectedServices, servicesError],
  );
  const {
    needsLocationSelection,
    effectiveLocation,
    selectedLocation,
    setSelectedLocation,
    isLocationCompatible,
    requiresAddress,
  } = useServiceLocationChoice(locationAwareServices);
  const requiresPrescription =
    !servicesError && selectedServices.some((service) => Boolean(service.requiresPrescription));

  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    if (
      currentStep < 3 ||
      !provider ||
      !bookingDate ||
      !bookingEndDate ||
      !availability.bookingTime ||
      selectedSubServices.length === 0 ||
      !isLocationCompatible ||
      (needsLocationSelection && !effectiveLocation) ||
      (requiresPrescription && !prescriptionFileId)
    ) {
      return null;
    }

    return {
      providerId: provider.id,
      serviceItems: selectedSubServices.map((serviceItemId) => ({
        serviceId: serviceItemId,
        quantity: 1,
      })),
      startDate: bookingDate,
      endDate: bookingEndDate,
      dailyStartTime: formatDailyStartTime(availability.bookingTime),
      patientLocationChoice: effectiveLocation ?? undefined,
      address:
        requiresAddress && (address || addressCoords)
          ? {
              line1: address || null,
              city: addressDetails?.city ?? null,
              postalCode: addressDetails?.postalCode ?? null,
              latitude: addressDetails?.latitude ?? addressCoords?.lat ?? null,
              longitude: addressDetails?.longitude ?? addressCoords?.lng ?? null,
            }
          : undefined,
      patientNotes: patientInfo.medicalNotes || undefined,
      prescriptionFileId: prescriptionFileId ?? undefined,
    };
  }, [
    address,
    addressCoords,
    addressDetails,
    availability.bookingTime,
    bookingDate,
    bookingEndDate,
    currentStep,
    effectiveLocation,
    isLocationCompatible,
    needsLocationSelection,
    patientInfo.medicalNotes,
    prescriptionFileId,
    provider,
    requiresAddress,
    requiresPrescription,
    selectedSubServices,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);

  const invalidateAvailabilityQueries = () => {
    if (!provider?.id || selectedSubServices.length === 0) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: providerKeys.monthAvailability(provider.id, {
        year: calendarYear,
        month: calendarMonth,
        serviceIds: [...selectedSubServices],
      }),
    });

    if (!bookingDate || !bookingEndDate) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: providerKeys.rangeAvailability(provider.id, {
        startDate: bookingDate,
        endDate: bookingEndDate,
        serviceIds: [...selectedSubServices],
      }),
    });
  };

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccess,
    onSuccess: () => setCurrentStep(4),
    onSlotConflict: () => {
      setCurrentStep(1);
      availability.setBookingTime('');
      invalidateAvailabilityQueries();
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'CareBooking quote mismatch detected; refetching authoritative quote.',
        {
          hasMismatchDetails: Boolean(details),
        },
      );
      void refetchQuote();
      void refetchServiceCatalog();
    },
  });

  useEffect(() => {
    if (!user) return;

    setPatientInfo((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
      phone: user.phone ? createDefaultTunisiaPhoneValue(user.phone) : prev.phone,
    }));
  }, [user]);

  useEffect(() => {
    if (!requiresAddress || !patientAddressPrefill || addressEdited) {
      return;
    }

    setAddress(patientAddressPrefill.displayAddress);
    setAddressDetails({
      city: patientAddressPrefill.city,
      postalCode: patientAddressPrefill.postalCode,
      latitude: patientAddressPrefill.latitude,
      longitude: patientAddressPrefill.longitude,
    });

    if (patientAddressPrefill.latitude !== null && patientAddressPrefill.longitude !== null) {
      setAddressCoords({
        lat: patientAddressPrefill.latitude,
        lng: patientAddressPrefill.longitude,
      });
    } else {
      setAddressCoords(null);
    }
  }, [addressEdited, patientAddressPrefill, requiresAddress]);

  useEffect(() => {
    if (selectedSubServices.length === 0) {
      setAddressEdited(false);
    }
  }, [selectedSubServices.length]);

  useEffect(() => {
    if (!requiresPrescription) {
      setPrescriptionFileId(null);
    }
  }, [requiresPrescription]);

  useEffect(() => {
    if (currentStep !== 2 || !requiresAddress) {
      return undefined;
    }

    return scheduleAddressPickerPreload();
  }, [currentStep, requiresAddress]);

  useEffect(() => {
    if (currentStep !== 3 || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('CareBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentStep, quote, quoteError, quoteLoading, quoteRequest]);

  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const displayedBookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const displayedPlatformFee = quote?.pricing.platformFee ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? currency;
  const numberOfDays = quote?.dayCount ?? 1;
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const { displaySlots, monthDays } = useBookingAvailabilityPresentation({
    bookingDate,
    availableStartTimes: availability.availableStartTimes,
    monthAvailabilityDays,
    providerTimezone,
  });
  const slotEmptyMessage =
    bookingDate && !bookingEndDate
      ? t.bookingFlow.calendarSelectEndDay
      : hasAvailabilitySelection
        ? t.bookingFlow.rangeAvailabilityEmptyMessage
        : t.bookingFlow.calendarSelectDay;
  const rangeAvailabilitySummaryText = t.bookingFlow.rangeAvailabilitySummary.replace(
    '{count}',
    String(displaySlots.length),
  );
  const confirmedServiceItems = submission.bookingResult?.serviceItems ?? [];
  const bookingPricing = submission.bookingResult?.pricing ?? null;
  const confirmedCurrency = bookingPricing?.currency ?? currency;
  const confirmedTimeLabel = formatTimeLabel(
    submission.bookingResult?.dailyStartTime,
    availability.bookingTime,
  );

  const toggleSubService = (serviceItemId: string) => {
    setSelectedSubServices((prev) =>
      prev.includes(serviceItemId)
        ? prev.filter((id) => id !== serviceItemId)
        : [...prev, serviceItemId],
    );
  };

  const handleRangeSelect = (startDate: string, endDate: string | null) => {
    setBookingDate(startDate);
    setBookingEndDate(endDate ?? '');
    availability.setBookingTime('');
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const openAddressPicker = () => {
    setHasOpenedAddressPicker(true);
    setShowAddressPicker(true);
    preloadAddressPickerModal();
  };

  const handlePaymentComplete = (paymentMethod: 'card' | 'd17' | 'cash') => {
    if (!quoteRequest || !quote) {
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

  const canProceed = () => {
    if (currentStep === 1) {
      return Boolean(
        bookingDate &&
        bookingEndDate &&
        availability.bookingTime &&
        selectedSubServices.length > 0 &&
        isLocationCompatible &&
        !availability.availabilityLoading &&
        !availability.availabilityError &&
        availability.availableStartTimes.length > 0 &&
        (!needsLocationSelection || effectiveLocation) &&
        (!requiresPrescription || prescriptionFileId),
      );
    }

    if (currentStep === 2) {
      return Boolean(
        isLocationCompatible &&
        patientInfo.name.trim() &&
        patientInfo.phone.trim() &&
        (!requiresAddress || address.trim()),
      );
    }

    return true;
  };

  if (providerLoading) {
    return <BookingPageLoader />;
  }

  if (providerError || !provider) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate(serviceId ? `/care/${serviceId}` : '/services')}
      />
    );
  }

  const providerDisplayName = getProviderDisplayName(provider);
  const providerImageUrl = getProviderImageUrl(provider);
  const providerLocation = getProviderLocation(provider);
  const stepLabels = [t.bookingFlow.stepDetails, t.bookingFlow.stepInfo, t.bookingFlow.stepPayment];
  const bookingHeader: BookingFlowHeaderData = {
    providerName: providerDisplayName,
    providerImageUrl,
    rating: {
      average: provider.ratingAverage,
      count: provider.ratingCount,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: categoryLabel,
    locationLabel: providerLocation,
  };
  const inputClassName =
    'w-full rounded-lg border border-slate-200 bg-white py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';
  const careSuccessCardClassName = bookingNeutralSuccessCardClassName;

  const selectedTimeLabel =
    displaySlots.find((slot) => slot.value === availability.bookingTime)?.label ??
    availability.bookingTime;
  const effectiveLocationLabel =
    effectiveLocation === 'home'
      ? t.bookingFlow.atHome
      : effectiveLocation === 'provider_site'
        ? t.bookingFlow.atProviderSite
        : SUMMARY_REQUIRED_PLACEHOLDER;
  const serviceSummaryRows: NonNullable<BookingFlowSummarySection['items']> =
    selectedServices.length > 0
      ? selectedServices.map((service) => {
          const serviceName = service.name ?? service.id;
          const priceLabel = formatServicePrice(service.price, service.currency ?? currency);

          return {
            label: serviceName,
            value: priceLabel,
            valueTitle: priceLabel,
            className: summaryServiceRowClassName,
            valueClassName: summaryServiceValueClassName,
          };
        })
      : [
          {
            label: t.bookingFlow.serviceLabel,
            value: SUMMARY_REQUIRED_PLACEHOLDER,
          },
        ];
  const selectedServicesDurationLabel = formatSelectedServicesDuration(selectedServices, null);
  const selectedServicesDayCount =
    bookingDate && bookingEndDate ? (availability.rangeAvailability?.dayCount ?? null) : null;
  const selectedServicesBaseSubtotal = selectedServices.reduce(
    (total, service) => total + service.price,
    0,
  );
  const localSubtotalDayCount = getInclusiveDayCount(bookingDate, bookingEndDate);
  const sideSubtotal =
    selectedServices.length > 0 ? selectedServicesBaseSubtotal * (localSubtotalDayCount ?? 1) : 0;
  const sideSubtotalValue = formatServicePrice(sideSubtotal, currency);
  const selectedServicesDurationSummary = [
    selectedServicesDurationLabel
      ? selectedServicesDayCount && selectedServicesDayCount > 1
        ? `${selectedServicesDurationLabel} ${t.bookingFlow.perDay}`
        : selectedServicesDurationLabel
      : null,
    selectedServicesDayCount ? `${selectedServicesDayCount} ${t.bookingFlow.daysLabel}` : null,
  ]
    .filter(Boolean)
    .join(' × ');
  const patientName = patientInfo.name.trim();
  const patientPhone = patientInfo.phone.trim();
  const medicalNotes = patientInfo.medicalNotes.trim();
  const hasQuote = Boolean(quote);
  const summaryPriceValue = hasQuote
    ? formatServicePrice(totalPrice, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const selectedServicesSummarySection: BookingFlowSummarySection = {
    title: t.bookingFlow.selectedServices,
    items: [
      ...serviceSummaryRows,
      {
        label: 'Durée',
        value: selectedServicesDurationSummary,
        valueTitle: selectedServicesDurationSummary,
        className: 'border-t border-border/70 pt-2',
        valueClassName: 'font-normal text-muted-foreground',
        hidden: selectedServices.length === 0 || !selectedServicesDurationSummary,
      },
      {
        label: t.bookingFlow.serviceLocation,
        value: effectiveLocationLabel,
        hidden: selectedServices.length === 0 || (!needsLocationSelection && !effectiveLocation),
      },
    ],
  };
  const dateRangeSummaryValue = `${bookingDate || SUMMARY_REQUIRED_PLACEHOLDER} → ${bookingEndDate || SUMMARY_REQUIRED_PLACEHOLDER}`;
  const dateTimeSummarySection: BookingFlowSummarySection = {
    title: t.bookingFlow.dateAndTime,
    items: [
      {
        label: 'Date',
        value: dateRangeSummaryValue,
        valueTitle: dateRangeSummaryValue,
        valueClassName: 'whitespace-nowrap text-right',
      },
      {
        label: 'Heure',
        value: selectedTimeLabel || SUMMARY_REQUIRED_PLACEHOLDER,
      },
    ],
  };
  const patientSummarySection: BookingFlowSummarySection = {
    title: t.bookingFlow.patientInfo,
    items: [
      {
        label: t.bookingFlow.fullName,
        value: patientName || SUMMARY_REQUIRED_PLACEHOLDER,
      },
      {
        label: t.bookingFlow.phone,
        value: patientPhone || SUMMARY_REQUIRED_PLACEHOLDER,
      },
      {
        label: t.bookingFlow.serviceAddress,
        value: address.trim() || SUMMARY_REQUIRED_PLACEHOLDER,
        hidden: !requiresAddress,
      },
      {
        label: t.bookingFlow.medicalNotes,
        value: medicalNotes,
        hidden: !medicalNotes,
      },
      {
        label: t.bookingFlow.prescriptionRequiredTitle,
        value: prescriptionFileId
          ? t.bookingFlow.prescriptionUploaded
          : SUMMARY_REQUIRED_PLACEHOLDER,
        hidden: !requiresPrescription,
      },
    ],
  };
  const bookingSummarySections: BookingFlowSummarySection[] = [
    selectedServicesSummarySection,
    dateTimeSummarySection,
    ...(currentStep >= 2 ? [patientSummarySection] : []),
  ];
  const paymentSummarySections: BookingFlowSummarySection[] = [
    ...bookingSummarySections,
    {
      title: t.bookingFlow.totalToPay,
      items: [
        {
          label: t.bookingFlow.subtotal,
          value: hasQuote
            ? formatServicePrice(displayedBookingSubtotal, quoteCurrency)
            : SUMMARY_PRICE_PENDING,
        },
        {
          label: t.howItWorks.platformFee || 'Platform fee',
          value: hasQuote
            ? formatServicePrice(displayedPlatformFee, quoteCurrency)
            : SUMMARY_PRICE_PENDING,
        },
      ],
    },
  ];
  const bookingSummary =
    currentStep === 3 || currentStep === 4 ? null : (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart aria-hidden="true" />}
        className={bookingNeutralPanelClassName}
        iconClassName="bg-transparent text-slate-600 dark:text-slate-300"
        sections={bookingSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: sideSubtotalValue,
          valueTitle: sideSubtotalValue,
          variant: 'line',
          labelClassName: 'text-base font-extrabold uppercase tracking-wide text-foreground',
          valueClassName: 'text-sm font-semibold text-muted-foreground',
        }}
      />
    );

  const renderPaymentStep = () => (
    <BookingQuotePanel
      loading={quoteLoading}
      error={quoteError || !quote}
      errorTitle={t.bookingFlow.error}
      errorMessage={quoteErrorMessage}
      loadingLabel={t.common.loading}
      retryLabel={t.common.retry}
      onRetry={() => void refetchQuote()}
    >
      {quote ? (
        <PaymentStep
          totalPrice={totalPrice}
          onPaymentComplete={handlePaymentComplete}
          paymentSummary={
            <BookingFlowSummary
              title={t.bookingFlow.bookingSummary}
              icon={<ShoppingCart aria-hidden="true" />}
              className={bookingNeutralPanelClassName}
              iconClassName="bg-transparent text-slate-600 dark:text-slate-300"
              sections={paymentSummarySections}
              total={{
                label: t.bookingFlow.totalToPay,
                value: summaryPriceValue,
                valueTitle: summaryPriceValue,
                className:
                  'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50',
                labelClassName: 'text-slate-900 dark:text-white',
                valueClassName: bookingCyanTotalClassName,
                description:
                  hasQuote && numberOfDays > 1
                    ? `${formatServicePrice(displayedBookingSubtotal / numberOfDays, quoteCurrency)} ${t.bookingFlow.perDay} × ${numberOfDays} ${t.bookingFlow.daysLabel}`
                    : undefined,
              }}
            />
          }
          isSubmitting={submission.isSubmitting}
          providerName={providerDisplayName}
          serviceName={categoryLabel}
          date={`${bookingDate} → ${bookingEndDate}`}
          time={availability.bookingTime}
          cashAvailable={quote?.cashAvailable ?? true}
        />
      ) : null}
    </BookingQuotePanel>
  );

  return (
    <BookingFlowChrome
      header={bookingHeader}
      currentStep={currentStep}
      stepLabels={stepLabels}
      showProgress={currentStep !== 4}
      className="px-6 py-4 pb-12 text-slate-900 dark:text-white"
      headerClassName="relative overflow-hidden rounded-[20px] p-[2px] shadow-xl"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[18px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="relative z-10 max-w-6xl"
    >
      <BookingFlowBodyLayout summary={bookingSummary}>
        <form onSubmit={handleSubmit} style={accentVariables}>
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <BookingSurface className={bookingNeutralPanelClassName}>
                  <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <Heart className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                    {t.bookingFlow.selectedServices}
                  </h2>

                  {servicesError ? (
                    <BookingInlineState
                      tone="warning"
                      title={t.common.loadingError}
                      description={servicesErrorMessage}
                      className="mb-3"
                    />
                  ) : null}

                  {servicesLoading && providerServices.length === 0 ? (
                    <BookingOptionListSkeleton items={4} />
                  ) : providerServices.length > 0 ? (
                    <div className="space-y-2">
                      {providerServices.map((service) => {
                        const isSelected = selectedSubServices.includes(service.id);
                        const durationLabel = formatServiceDuration(service.durationMinutes);
                        const locationType = getServiceLocationBadgeVariant(
                          service.serviceLocation,
                        );
                        const locationLabel =
                          locationType === 'home'
                            ? t.bookingFlow.atHome
                            : locationType === 'both'
                              ? `${t.bookingFlow.atHome} / ${t.bookingFlow.atProviderSite}`
                              : t.bookingFlow.atProviderSite;

                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleSubService(service.id)}
                            className={cn(
                              'w-full rounded-xl border p-3 text-left transition-colors',
                              isSelected
                                ? bookingAccentSelectedOptionClassName
                                : bookingAccentInactiveOptionClassName,
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-medium text-slate-900 dark:text-white">
                                {service.name ?? service.id}
                              </span>
                              <span className="whitespace-nowrap text-xs font-bold text-[color:var(--service-accent-from)]">
                                {service.price} {service.currency ?? currency}
                              </span>
                            </div>
                            {service.shortDescription ? (
                              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                                {service.shortDescription}
                              </p>
                            ) : null}
                            {!servicesError ? (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {durationLabel ? (
                                  <span className={bookingDurationBadgeClassName}>
                                    <Clock className="h-3 w-3" />
                                    {durationLabel}
                                  </span>
                                ) : null}
                                <span
                                  className={
                                    locationType === 'home'
                                      ? bookingHomeLocationBadgeClassName
                                      : locationType === 'both'
                                        ? bookingBothLocationBadgeClassName
                                        : bookingProviderLocationBadgeClassName
                                  }
                                >
                                  {locationType === 'home' ? (
                                    <Home className="h-3 w-3" />
                                  ) : locationType === 'both' ? (
                                    <MapPin className="h-3 w-3" />
                                  ) : (
                                    <Building2 className="h-3 w-3" />
                                  )}
                                  {locationLabel}
                                </span>
                                {service.requiresPrescription ? (
                                  <span className={bookingPrescriptionRequiredBadgeClassName}>
                                    <FileText className="h-3 w-3" />
                                    {t.bookingFlow.prescriptionRequiredTitle}
                                  </span>
                                ) : null}
                                {service.isUrgent ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                                    <Zap className="h-3 w-3" />
                                    {t.home.emergency}
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <BookingInlineState tone="muted" title={t.services.noServicesFound} />
                  )}

                  {selectedServices.length > 0 && !isLocationCompatible ? (
                    <BookingInlineState
                      tone="warning"
                      title="Services incompatibles"
                      description="Les services sélectionnés ne partagent aucun lieu de prestation. Modifiez votre sélection pour poursuivre la réservation."
                      className="mt-3"
                    />
                  ) : null}
                </BookingSurface>
              </div>

              {selectedSubServices.length > 0 && needsLocationSelection ? (
                <ServiceLocationToggle
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                />
              ) : null}

              {requiresPrescription ? (
                <PrescriptionUploadGate
                  required={requiresPrescription}
                  onFileReady={setPrescriptionFileId}
                />
              ) : null}

              <BookingSurface className={bookingNeutralPanelClassName}>
                <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.dateAndTime}
                </h2>
                <div className="mb-3 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.selectDate} *
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
                      mode="range"
                      rangeStartDate={bookingDate || null}
                      rangeEndDate={bookingEndDate || null}
                      onRangeSelect={handleRangeSelect}
                      rangeHelperText={t.bookingFlow.calendarSelectEndDay}
                    />
                    {monthError ? (
                      <BookingInlineState
                        className="mt-3"
                        tone="danger"
                        title={t.bookingFlow.error}
                        description={monthErrorMessage ?? defaultFailureMessage}
                      />
                    ) : null}
                  </div>

                  {bookingDate && bookingEndDate ? (
                    <BookingInlineState
                      tone="info"
                      title={`${t.bookingFlow.selectDate}: ${bookingDate}`}
                      description={`${t.bookingFlow.selectEndDate}: ${bookingEndDate} × ${t.bookingFlow.daysBookedLabel}: ${availability.rangeAvailability?.dayCount ?? numberOfDays} ${t.bookingFlow.daysLabel}`}
                    />
                  ) : bookingDate ? (
                    <BookingInlineState tone="info" title={t.bookingFlow.calendarSelectEndDay} />
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                    {t.bookingFlow.selectTime} *
                  </label>
                  <DaySlotPicker
                    slots={displaySlots}
                    selectedSlot={availability.bookingTime}
                    onSelectSlot={availability.setBookingTime}
                    loading={availability.availabilityLoading}
                    providerTimezone={providerTimezone ?? undefined}
                    emptyMessage={slotEmptyMessage}
                  />
                </div>

                {availability.availabilityError ? (
                  <BookingInlineState
                    className="mt-3"
                    tone="danger"
                    title={t.bookingFlow.error}
                    description={availability.availabilityErrorMessage ?? undefined}
                  />
                ) : null}

                {hasAvailabilitySelection &&
                !availability.availabilityLoading &&
                !availability.availabilityError &&
                displaySlots.length > 0 ? (
                  <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400">
                    {rangeAvailabilitySummaryText}{' '}
                    {displaySlots.map((slot) => slot.label).join(', ')}
                  </p>
                ) : null}
              </BookingSurface>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <BookingSurface className={cn('mt-4', bookingNeutralPanelClassName)}>
              <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
                {t.bookingFlow.stepInfo}
              </h2>
              <div className="space-y-3">
                {requiresAddress ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.serviceAddress} *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                        <textarea
                          value={address}
                          onChange={(e) => {
                            setAddressEdited(true);
                            setAddress(e.target.value);
                            setAddressCoords(null);
                            setAddressDetails(null);
                          }}
                          placeholder={t.bookingFlow.fullAddressPlaceholder}
                          rows={2}
                          required={requiresAddress}
                          className={cn(inputClassName, 'resize-none pl-9 pr-3')}
                        />
                      </div>
                      <BookingMapButton
                        label={t.bookingFlow.selectAddressOnMap}
                        onClick={openAddressPicker}
                        onFocus={() => preloadAddressPickerModal()}
                        onPointerEnter={() => preloadAddressPickerModal()}
                      />
                    </div>
                    {patientAddressPrefill ? (
                      <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Check className="h-3 w-3 text-success" />
                        {t.bookingFlow.addressPrefilledFromProfile}
                      </p>
                    ) : null}
                  </div>
                ) : effectiveLocation === 'provider_site' ? (
                  <BookingInlineState
                    tone="info"
                    title={t.bookingFlow.serviceLocation}
                    description={t.bookingFlow.providerSiteDesc}
                  />
                ) : null}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.fullName} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500 dark:text-cyan-400" />
                      <input
                        type="text"
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                        required
                        className={cn(inputClassName, 'pl-9 pr-3')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500 dark:text-cyan-400" />
                      <TunisiaPhoneInput
                        value={patientInfo.phone}
                        onValueChange={(phone) => setPatientInfo({ ...patientInfo, phone })}
                        required
                        className={cn(inputClassName, 'pl-9 pr-3')}
                      />
                    </div>
                  </div>
                </div>
                {user ? (
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Check className="h-3 w-3 text-success" />
                    {t.bookingFlow.contactPrefilledFromAccount}
                  </p>
                ) : null}
              </div>
            </BookingSurface>
          ) : null}

          {currentStep === 3 ? renderPaymentStep() : null}

          {currentStep === 4 ? (
            <BookingSuccessPanel
              bookingNumber={submission.bookingResult?.bookingNumber}
              onGoToDashboard={() => navigate('/patient-dashboard')}
              onViewServices={() => navigate('/services')}
            >
              <div
                className={cn(
                  careSuccessCardClassName,
                  'inline-grid grid-cols-1 gap-2 sm:grid-cols-3',
                )}
              >
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {t.bookingFlow.selectDate}:
                  </span>{' '}
                  {formatDateLabel(submission.bookingResult?.startDate, bookingDate)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {t.bookingFlow.selectEndDate}:
                  </span>{' '}
                  {formatDateLabel(submission.bookingResult?.endDate, bookingEndDate)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {t.bookingFlow.selectTime}:
                  </span>{' '}
                  {confirmedTimeLabel}
                </p>
              </div>

              {confirmedServiceItems.length > 0 ? (
                <div className={careSuccessCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {t.bookingFlow.selectedServices}
                  </p>
                  <div className="mt-3 space-y-3">
                    {confirmedServiceItems.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {item.serviceName ?? item.serviceId}
                          </p>
                          <p>
                            {t.bookingFlow.quantity}: {item.quantity} · {t.bookingFlow.unitPrice}:{' '}
                            {item.unitPrice.toFixed(2)} {item.currency ?? confirmedCurrency}
                          </p>
                        </div>
                        <p
                          className={cn(
                            'whitespace-nowrap font-semibold',
                            'text-[color:var(--service-accent-from)]',
                          )}
                        >
                          {item.subtotal.toFixed(2)} {item.currency ?? confirmedCurrency}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {bookingPricing ? (
                <div className={careSuccessCardClassName}>
                  <div className="flex items-center justify-between gap-3">
                    <span>{t.bookingFlow.subtotal}</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {bookingPricing.bookingSubtotal.toFixed(2)} {confirmedCurrency}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.total}
                    </span>
                    <span className={cn('font-bold', bookingCyanTotalClassName)}>
                      {bookingPricing.totalAmount.toFixed(2)} {confirmedCurrency}
                    </span>
                  </div>
                </div>
              ) : null}
            </BookingSuccessPanel>
          ) : null}

          {currentStep < 3 ? (
            <BookingStepActions
              onBack={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
              backLabel={t.common.back}
              nextLabel={t.common.next}
              nextType="submit"
              nextDisabled={!canProceed()}
            />
          ) : null}
        </form>
      </BookingFlowBodyLayout>

      {hasOpenedAddressPicker ? (
        <Suspense fallback={<AddressPickerModalSkeleton />}>
          <LazyAddressPickerModal
            isOpen={showAddressPicker}
            onClose={() => setShowAddressPicker(false)}
            onSelectAddress={(selectedAddress) => {
              setAddressEdited(true);
              setAddress(selectedAddress.fullAddress);
              setAddressCoords({ lat: selectedAddress.latitude, lng: selectedAddress.longitude });
              setAddressDetails({
                city: selectedAddress.city || null,
                postalCode: selectedAddress.postalCode || null,
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude,
              });
            }}
            initialLatitude={addressCoords?.lat ?? patientAddressPrefill?.latitude ?? 36.8065}
            initialLongitude={addressCoords?.lng ?? patientAddressPrefill?.longitude ?? 10.1815}
          />
        </Suspense>
      ) : null}
    </BookingFlowChrome>
  );
}
