import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, MapPin, Phone, ShoppingCart, User } from 'lucide-react';
import { BookingSuccessPanel } from '@/features/bookings/flow/ui';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useAvailability,
  useBookingProvider,
  useBookingQuote,
  useBookingSubmission,
  useMonthAvailability,
  usePatientBookingAddressPrefill,
} from '@/features/bookings/hooks';
import {
  BookingFlowBodyLayout,
  BookingFlowChrome,
  type BookingFlowHeaderData,
  BookingFlowSummary,
  type BookingFlowSummarySection,
  BookingInlineState,
  BookingOptionListSkeleton,
  BookingPageErrorState,
  BookingPageLoader,
  BookingStepActions,
  SpecialBookingDateTimeStep,
  SpecialBookingPaymentSection,
  bookingAccentInactiveOptionClassName,
  bookingAccentSelectedOptionClassName,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
  useSpecialBookingAvailability,
} from './internal';
import {
  bookingCyanTotalClassName,
  bookingNeutralPanelClassName,
  bookingNeutralSuccessCardClassName,
} from './BookingFlowUi';
import { logBookingFlowWarning } from './bookingFlowLogger';
import { formatDailyStartTime, formatServicePrice } from './utils';
import { useAmbulanceServiceTypes } from '@/features/ambulance/hooks';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Field, FieldLabel } from '@/shared/ui/primitives/field';
import { TunisiaPhoneInput } from '@/shared/ui/primitives/tunisia-phone-input';
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
} from '@/features/services';
import { createDefaultTunisiaPhoneValue } from '@/utils/input-validation';
import type { AmbulanceServiceType } from '@/features/ambulance/service';
import type { BookingQuoteRequest } from '@/features/bookings/schema';

interface TransportOption {
  id: string;
  serviceId: string;
  serviceTypeCode: string | null;
  label: string;
  icon: string;
  description: string;
  price: number;
  currency: string;
}

interface PatientInfoState {
  name: string;
  age: string;
  phone: string;
  email: string;
  medicalCondition: string;
  mobility: 'walking' | 'wheelchair' | 'stretcher';
  oxygen: boolean;
  accompaniment: boolean;
}

const SUMMARY_REQUIRED_PLACEHOLDER = '_';
const SUMMARY_PRICE_PENDING = 'À confirmer';

const MOBILITY_OPTIONS: Array<{ id: PatientInfoState['mobility']; label: string }> = [
  { id: 'walking', label: 'Peut marcher' },
  { id: 'wheelchair', label: 'Fauteuil roulant' },
  { id: 'stretcher', label: 'Brancard' },
];

function getTodayDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function findEarliestAvailableDate(
  monthDays: Array<{ date: string; slotCount: number }>,
): string | null {
  const todayKey = getTodayDateKey();
  const todayAvailability = monthDays.find((day) => day.date === todayKey && day.slotCount > 0);

  if (todayAvailability) {
    return todayAvailability.date;
  }

  const nextAvailableDay = monthDays.find((day) => day.date > todayKey && day.slotCount > 0);

  return nextAvailableDay?.date ?? null;
}

function formatMobilityLabel(mobility: PatientInfoState['mobility']): string {
  switch (mobility) {
    case 'wheelchair':
      return 'Fauteuil roulant';
    case 'stretcher':
      return 'Brancard';
    default:
      return 'Peut marcher';
  }
}

function getAmbulanceServiceTypeCodes(typeConfig: unknown): string[] {
  if (!typeConfig || typeof typeConfig !== 'object' || Array.isArray(typeConfig)) {
    return [];
  }

  const serviceTypes = (typeConfig as Record<string, unknown>).serviceTypes;
  if (!Array.isArray(serviceTypes)) {
    return [];
  }

  return serviceTypes.reduce<string[]>((codes, value) => {
    if (typeof value !== 'string') {
      return codes;
    }

    const normalizedCode = value.trim().toLowerCase();
    if (!normalizedCode || codes.includes(normalizedCode)) {
      return codes;
    }

    codes.push(normalizedCode);
    return codes;
  }, []);
}

function buildAmbulanceNotes(
  urgencyLevel: string,
  transportLabel: string,
  patientInfo: PatientInfoState,
  destinationAddress: string,
): string {
  const notes = [
    `Transport: ${transportLabel}`,
    `Urgency: ${urgencyLevel}`,
    `Mobility: ${formatMobilityLabel(patientInfo.mobility)}`,
    `Oxygen: ${patientInfo.oxygen ? 'Required' : 'Not required'}`,
    `Accompaniment: ${patientInfo.accompaniment ? 'Yes' : 'No'}`,
    `Destination: ${destinationAddress}`,
  ];

  if (patientInfo.age.trim()) {
    notes.push(`Age: ${patientInfo.age.trim()}`);
  }

  if (patientInfo.medicalCondition.trim()) {
    notes.push(`Condition: ${patientInfo.medicalCondition.trim()}`);
  }

  if (patientInfo.email.trim()) {
    notes.push(`Email: ${patientInfo.email.trim()}`);
  }

  return notes.join(' | ');
}

export function AmbulanceBookingFlow() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { address: patientAddressPrefill } = usePatientBookingAddressPrefill();
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useBookingProvider(providerId);
  const {
    items: providerServices,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'ambulance',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('ambulance');
  const accentVariables = createServiceAccentVariables(accent);
  const {
    data: ambulanceServiceTypes,
    loading: serviceTypesLoading,
    error: serviceTypesError,
    refetch: refetchServiceTypes,
  } = useAmbulanceServiceTypes();

  const [currentStep, setCurrentStep] = useState(1);
  const [transportType, setTransportType] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'scheduled' | 'immediate'>('scheduled');
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupAddressEdited, setPickupAddressEdited] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfoState>({
    name: '',
    age: '',
    phone: createDefaultTunisiaPhoneValue(),
    email: '',
    medicalCondition: '',
    mobility: 'walking',
    oxygen: false,
    accompaniment: false,
  });
  const [isAutoAssigned, setIsAutoAssigned] = useState(false);

  const ambulanceServiceTypesByCode = useMemo(
    () =>
      (ambulanceServiceTypes ?? []).reduce<Map<string, AmbulanceServiceType>>(
        (serviceTypesMap, serviceType) => {
          const normalizedCode = serviceType.code.trim().toLowerCase();
          if (!normalizedCode || serviceTypesMap.has(normalizedCode)) {
            return serviceTypesMap;
          }

          serviceTypesMap.set(normalizedCode, serviceType);
          return serviceTypesMap;
        },
        new Map(),
      ),
    [ambulanceServiceTypes],
  );

  const transportTypes: TransportOption[] = useMemo(
    () =>
      providerServices.map((service) => {
        const publishedServiceTypeCodes = getAmbulanceServiceTypeCodes(service.typeConfig);
        const serviceTypeCode =
          publishedServiceTypeCodes.find((code) => ambulanceServiceTypesByCode.has(code)) ?? null;
        const lookupServiceType = serviceTypeCode
          ? ambulanceServiceTypesByCode.get(serviceTypeCode)
          : null;

        return {
          id: service.id,
          serviceId: service.id,
          serviceTypeCode,
          label: service.name ?? lookupServiceType?.label ?? t.serviceListing.ambulanceTitle,
          icon: lookupServiceType?.icon ?? '🚑',
          description:
            service.shortDescription ??
            lookupServiceType?.label ??
            t.serviceListing.ambulanceSubtitle,
          price: service.price,
          currency: service.currency ?? 'TND',
        };
      }),
    [
      ambulanceServiceTypesByCode,
      providerServices,
      t.serviceListing.ambulanceSubtitle,
      t.serviceListing.ambulanceTitle,
    ],
  );

  const selectedTransport = transportTypes.find((type) => type.id === transportType) ?? null;
  const selectedTransportServiceId = selectedTransport?.serviceId ?? null;
  const selectedServiceIds = useMemo(
    () => (selectedTransportServiceId ? [selectedTransportServiceId] : []),
    [selectedTransportServiceId],
  );
  const defaultFailureMessage = t.bookingFlow.bookingErrorGeneric;

  const {
    days: monthAvailabilityDays,
    loading: monthLoading,
    timezone: providerTimezone,
    maxBookableDate: calendarMaxDate,
  } = useMonthAvailability(provider?.id, calendarYear, calendarMonth, selectedServiceIds);

  const availability = useAvailability(
    provider?.id,
    bookingDate && selectedServiceIds.length > 0
      ? {
          startDate: bookingDate,
          endDate: bookingDate,
          serviceIds: selectedServiceIds,
        }
      : null,
    defaultFailureMessage,
  );
  const {
    availableStartTimes,
    availabilityError,
    availabilityErrorMessage,
    availabilityLoading,
    bookingTime,
    setBookingTime,
  } = availability;

  const invalidateAvailabilityQueries = useCallback(() => {
    if (!provider?.id || selectedServiceIds.length === 0) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: providerKeys.monthAvailability(provider.id, {
        year: calendarYear,
        month: calendarMonth,
        serviceIds: [...selectedServiceIds],
      }),
    });

    if (!bookingDate) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: providerKeys.rangeAvailability(provider.id, {
        startDate: bookingDate,
        endDate: bookingDate,
        serviceIds: [...selectedServiceIds],
      }),
    });
  }, [bookingDate, calendarMonth, calendarYear, provider?.id, queryClient, selectedServiceIds]);

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(4),
    onSlotConflict: () => {
      logBookingFlowWarning(
        '[AmbulanceBooking] Slot conflict detected. Refreshing availability and recomputing the earliest immediate booking suggestion.',
      );
      setCurrentStep(1);
      setBookingDate('');
      setBookingTime('');
      invalidateAvailabilityQueries();
      setIsAutoAssigned(false);
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'AmbulanceBooking quote mismatch detected; refetching authoritative quote.',
        {
          hasMismatchDetails: Boolean(details),
        },
      );
      void refetchQuote();
    },
  });

  const { displaySlots, monthDays, selectedTimeLabel } = useSpecialBookingAvailability({
    availableStartTimes,
    bookingDate,
    bookingTime,
    monthAvailabilityDays,
    providerTimezone,
  });

  useEffect(() => {
    if (urgencyLevel === 'scheduled') {
      setIsAutoAssigned(false);
      return;
    }

    setBookingDate('');
    setBookingTime('');
    setIsAutoAssigned(false);
  }, [setBookingTime, urgencyLevel]);

  useEffect(() => {
    if (urgencyLevel !== 'immediate' || selectedServiceIds.length === 0) {
      return;
    }

    if (monthLoading) {
      if (monthDays.length > 0) {
        logBookingFlowWarning(
          '[AmbulanceBooking] Immediate auto-assignment is waiting for fresh month availability to avoid using stale calendar data.',
        );
      }
      return;
    }

    const currentBookingDay = bookingDate
      ? monthDays.find((day) => day.date === bookingDate)
      : null;
    const bookingDateHasAvailability = Boolean(
      currentBookingDay && currentBookingDay.slotCount > 0,
    );

    if (!isAutoAssigned && bookingDate && bookingDateHasAvailability) {
      return;
    }

    const candidateDate = findEarliestAvailableDate(monthDays);

    if (!candidateDate) {
      if (bookingDate && !bookingDateHasAvailability) {
        setBookingDate('');
        setBookingTime('');
      }
      return;
    }

    const [candidateYear, candidateMonth] = candidateDate.split('-').map(Number);

    if (candidateDate !== bookingDate) {
      setBookingDate(candidateDate);
      setBookingTime('');
    }

    setCalendarYear(candidateYear);
    setCalendarMonth(candidateMonth);
    setIsAutoAssigned(true);
  }, [
    bookingDate,
    isAutoAssigned,
    monthDays,
    monthLoading,
    selectedServiceIds,
    setBookingTime,
    urgencyLevel,
  ]);

  useEffect(() => {
    if (
      urgencyLevel !== 'immediate' ||
      !isAutoAssigned ||
      availabilityLoading ||
      bookingTime ||
      availableStartTimes.length === 0
    ) {
      return;
    }

    setBookingTime(availableStartTimes[0]);
  }, [
    availableStartTimes,
    availabilityLoading,
    bookingTime,
    isAutoAssigned,
    setBookingTime,
    urgencyLevel,
  ]);

  useEffect(() => {
    if (!patientAddressPrefill) {
      return;
    }

    if (!pickupAddressEdited) {
      setPickupAddress(patientAddressPrefill.displayAddress);
    }
  }, [patientAddressPrefill, pickupAddressEdited]);

  const stepLabels = [
    `${t.bookingFlow.stepDetails} & ${t.bookingFlow.selectDate}`,
    t.bookingFlow.stepInfo,
    t.bookingFlow.stepPayment,
    t.bookingFlow.bookingSuccess,
  ];

  const slotEmptyMessage = bookingDate
    ? t.bookingFlow.calendarNoAvailability
    : t.bookingFlow.calendarSelectDay;
  const todayDateKey = getTodayDateKey();
  const showNoAmbulanceServicesWarning =
    providerServices.length === 0 && !servicesLoading && !servicesError;
  const showImmediateAutoAssignmentBanner =
    urgencyLevel === 'immediate' && isAutoAssigned && Boolean(bookingDate);
  const showImmediateNextDayFallback =
    showImmediateAutoAssignmentBanner && bookingDate !== todayDateKey;
  const autoAssignedTimeLabel = selectedTimeLabel;
  const autoAssignedTimeValue =
    autoAssignedTimeLabel ||
    (availabilityLoading ? t.bookingFlow.calendarLoading : slotEmptyMessage);
  const serviceTypesErrorMessage =
    serviceTypesError instanceof Error ? serviceTypesError.message : t.common.loadingError;
  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    if (
      currentStep < 3 ||
      !provider ||
      !selectedTransport ||
      !bookingDate ||
      !bookingTime ||
      !pickupAddress.trim() ||
      !destinationAddress.trim() ||
      !patientInfo.name.trim() ||
      !patientInfo.phone.trim()
    ) {
      return null;
    }

    return {
      providerId: provider.id,
      serviceItems: [{ serviceId: selectedTransport.serviceId, quantity: 1 }],
      startDate: bookingDate,
      endDate: bookingDate,
      dailyStartTime: formatDailyStartTime(bookingTime),
      address: {
        line1: pickupAddress || undefined,
        city: pickupAddressEdited ? undefined : (patientAddressPrefill?.city ?? undefined),
        postalCode: pickupAddressEdited
          ? undefined
          : (patientAddressPrefill?.postalCode ?? undefined),
        latitude: pickupAddressEdited ? null : (patientAddressPrefill?.latitude ?? null),
        longitude: pickupAddressEdited ? null : (patientAddressPrefill?.longitude ?? null),
      },
      patientNotes: buildAmbulanceNotes(
        urgencyLevel,
        selectedTransport.label,
        patientInfo,
        destinationAddress,
      ),
      typeConfig: {
        serviceType: selectedTransport.serviceTypeCode ?? null,
        pickupAddress,
        destinationAddress,
        patientCondition: patientInfo.medicalCondition || undefined,
        requiresStretcher: patientInfo.mobility === 'stretcher',
        requiresOxygen: patientInfo.oxygen,
        requiresMedicalStaff: patientInfo.accompaniment,
        mobility: patientInfo.mobility,
        urgencyLevel,
      },
    };
  }, [
    bookingDate,
    bookingTime,
    currentStep,
    destinationAddress,
    patientInfo,
    patientAddressPrefill,
    pickupAddress,
    pickupAddressEdited,
    provider,
    selectedTransport,
    urgencyLevel,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);
  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const displayedBookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const displayedPlatformFee = quote?.pricing.platformFee ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? selectedTransport?.currency ?? 'TND';
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;
  const canContinueToInfo = Boolean(
    selectedTransport &&
    bookingDate &&
    bookingTime &&
    !availabilityLoading &&
    !availabilityError &&
    displaySlots.length > 0,
  );
  const canContinueToPayment = Boolean(
    pickupAddress.trim() &&
    destinationAddress.trim() &&
    patientInfo.name.trim() &&
    patientInfo.phone.trim(),
  );
  const confirmedAmount = submission.bookingResult?.pricing
    ? `${submission.bookingResult.pricing.totalAmount.toFixed(2)} ${submission.bookingResult.pricing.currency ?? quoteCurrency}`
    : `${totalPrice.toFixed(2)} ${quoteCurrency}`;

  useEffect(() => {
    if (currentStep !== 3 || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('AmbulanceBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentStep, quote, quoteError, quoteLoading, quoteRequest]);

  const handleDaySelect = useCallback((date: string) => {
    setIsAutoAssigned(false);
    setBookingDate(date);
  }, []);

  const handleSlotSelect = useCallback(
    (slot: string) => {
      setIsAutoAssigned(false);
      setBookingTime(slot);
    },
    [setBookingTime],
  );

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
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

  if (providerLoading) {
    return <BookingPageLoader iconClassName="text-muted-foreground" />;
  }

  if (providerError || !provider) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        description={t.serviceListing.errorLoading}
        actionLabel={t.common.back}
        onAction={() => navigate('/ambulance')}
      />
    );
  }

  const providerDisplayName = getProviderDisplayName(provider);
  const providerImageUrl = getProviderImageUrl(provider);
  const bookingHeader: BookingFlowHeaderData = {
    providerName: providerDisplayName,
    providerImageUrl,
    rating: {
      average: provider.ratingAverage,
      count: provider.ratingCount,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: t.serviceListing.ambulanceTitle,
    locationLabel: getProviderLocation(provider),
    subtitle: t.serviceListing.ambulanceSubtitle,
  };
  const inputClass =
    'w-full rounded-lg border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';
  const redGlassSurfaceClassName = bookingNeutralPanelClassName;
  const cyanGlassSurfaceClassName = bookingNeutralPanelClassName;
  const amberTintPanelClassName =
    'rounded-xl border border-amber-200/80 bg-amber-50/90 p-3 shadow-sm shadow-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/10';
  const redTintPanelClassName =
    'rounded-xl border border-red-200/80 bg-gradient-to-br from-red-50/90 to-orange-50/70 p-4 shadow-sm shadow-red-500/10 dark:border-red-500/30 dark:from-red-500/10 dark:to-orange-500/10';
  const redSummaryClassName = bookingNeutralPanelClassName;
  const redSummaryIconClassName = 'bg-transparent text-slate-500 dark:text-slate-400';
  const successRedCardClassName = bookingNeutralSuccessCardClassName;
  const urgencyLabel =
    urgencyLevel === 'immediate' ? t.bookingFlow.urgencyImmediate : t.bookingFlow.urgencyScheduled;
  const transportLabel = selectedTransport?.label ?? SUMMARY_REQUIRED_PLACEHOLDER;
  const transportDescription = selectedTransport?.description;
  const summaryTimeValue = selectedTimeLabel || bookingTime || SUMMARY_REQUIRED_PLACEHOLDER;
  const trimmedPickupAddress = pickupAddress.trim();
  const trimmedDestinationAddress = destinationAddress.trim();
  const patientName = patientInfo.name.trim();
  const patientPhone = patientInfo.phone.trim();
  const patientMedicalCondition = patientInfo.medicalCondition.trim();
  const patientTransportOptions = [
    patientInfo.oxygen ? 'Oxygène nécessaire' : null,
    patientInfo.accompaniment ? 'Accompagnant' : null,
  ].filter(Boolean);
  const hasQuote = Boolean(quote);
  const sideSubtotalValue = formatServicePrice(
    selectedTransport?.price ?? 0,
    selectedTransport?.currency ?? 'TND',
  );
  const summaryTotalValue = hasQuote
    ? formatServicePrice(totalPrice, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const paymentSubtotalValue = hasQuote
    ? formatServicePrice(displayedBookingSubtotal, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const bookingSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Transport',
      items: [
        {
          label: transportLabel,
          value: sideSubtotalValue,
          valueTitle: sideSubtotalValue,
          className: summaryServiceRowClassName,
          valueClassName: summaryServiceValueClassName,
        },
        {
          label: 'Description',
          value: transportDescription,
          valueTitle: transportDescription,
          className: 'border-t border-border/70 pt-2',
          hidden: !transportDescription,
        },
        {
          label: 'Urgence',
          value: urgencyLabel,
          className: transportDescription ? undefined : 'border-t border-border/70 pt-2',
        },
      ],
    },
    {
      title: 'Planning',
      items: [
        {
          label: 'Date',
          value: bookingDate || SUMMARY_REQUIRED_PLACEHOLDER,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Heure',
          value: summaryTimeValue,
          valueTitle: summaryTimeValue,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Affectation',
          value: showImmediateNextDayFallback
            ? t.bookingFlow.immediateNextDayFallback
            : t.bookingFlow.immediateAutoAssigned,
          hidden: !showImmediateAutoAssignmentBanner,
        },
      ],
    },
    {
      title: 'Trajet',
      hidden: currentStep < 2,
      items: [
        {
          label: 'Départ',
          value: trimmedPickupAddress || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: trimmedPickupAddress || undefined,
        },
        {
          label: 'Destination',
          value: trimmedDestinationAddress || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: trimmedDestinationAddress || undefined,
        },
      ],
    },
    {
      title: t.bookingFlow.patientInfo,
      hidden: currentStep < 2,
      items: [
        {
          label: t.bookingFlow.fullName,
          value: patientName || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: patientName || undefined,
        },
        {
          label: t.bookingFlow.phone,
          value: patientPhone || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: patientPhone || undefined,
        },
        {
          label: 'Mobilité',
          value: formatMobilityLabel(patientInfo.mobility),
        },
        {
          label: 'Options',
          value: patientTransportOptions.join(' · '),
          hidden: patientTransportOptions.length === 0,
        },
        {
          label: 'Condition',
          value: patientMedicalCondition,
          valueTitle: patientMedicalCondition,
          hidden: !patientMedicalCondition,
        },
      ],
    },
  ];
  const paymentSummarySections: BookingFlowSummarySection[] = [
    ...bookingSummarySections,
    {
      title: 'Tarification',
      items: [
        {
          label: t.bookingFlow.subtotal,
          value: paymentSubtotalValue,
        },
        {
          label: t.howItWorks.platformFee || 'Frais de plateforme',
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
        className={redSummaryClassName}
        iconClassName={redSummaryIconClassName}
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
  const paymentSummary = (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      icon={<ShoppingCart aria-hidden="true" />}
      className={redSummaryClassName}
      iconClassName={redSummaryIconClassName}
      sections={paymentSummarySections}
      total={{
        label: t.bookingFlow.totalToPay,
        value: summaryTotalValue,
        valueTitle: summaryTotalValue,
        valueClassName: hasQuote ? bookingCyanTotalClassName : undefined,
      }}
    />
  );

  return (
    <BookingFlowChrome
      className="px-6 py-4 pb-12 text-slate-900 dark:text-white"
      currentStep={currentStep}
      header={bookingHeader}
      headerClassName="relative overflow-hidden rounded-[20px] p-[2px] shadow-xl"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[18px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="max-w-5xl"
      showProgress={currentStep !== 4}
      stepLabels={stepLabels}
    >
      <BookingFlowBodyLayout summary={bookingSummary} mainClassName="space-y-3">
        <div className="space-y-3" style={accentVariables}>
          {urgencyLevel === 'immediate' ? (
            <div className={redTintPanelClassName}>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <h2 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                    {t.bookingFlow.urgencyImmediate}
                  </h2>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Le créneau choisi sera traité en priorité dès validation du paiement et de la
                    disponibilité.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-3">
              <div className={redGlassSurfaceClassName}>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.selectTransport}
                </h2>

                {showNoAmbulanceServicesWarning ? (
                  <div className={`${amberTintPanelClassName} mb-3`}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-100">
                        {t.bookingFlow.noAmbulanceServices}
                      </p>
                    </div>
                  </div>
                ) : null}

                {serviceTypesLoading && transportTypes.length === 0 ? (
                  <BookingOptionListSkeleton items={4} />
                ) : null}

                {serviceTypesLoading && transportTypes.length > 0 ? (
                  <BookingInlineState
                    tone="info"
                    title="Référentiel des transports en cours d'actualisation"
                    description="Les options déjà chargées restent visibles pendant la vérification en arrière-plan."
                    className="mb-3"
                  />
                ) : null}

                {!serviceTypesLoading && serviceTypesError ? (
                  <BookingInlineState
                    tone="danger"
                    title={t.common.loadingError}
                    description={serviceTypesErrorMessage}
                    className="mb-3"
                    action={
                      <button
                        type="button"
                        onClick={() => void refetchServiceTypes()}
                        className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                      >
                        {t.common.retry}
                      </button>
                    }
                  />
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {transportTypes.map((type) => {
                    const isSelected = transportType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setTransportType(type.id)}
                        className={`rounded-xl border-2 p-3 text-left transition-colors ${isSelected ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{type.icon}</span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {type.label}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                              {type.description}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-sm font-bold text-[color:var(--service-accent-from)]">
                            {type.price} {type.currency}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={redGlassSurfaceClassName}>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.serviceListing.urgencyLevel}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrgencyLevel('scheduled')}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${urgencyLevel === 'scheduled' ? 'border-cyan-500 bg-cyan-500/10 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-500/50 dark:border-cyan-400 dark:ring-cyan-400/70' : 'border-slate-200/80 bg-white/80 hover:border-cyan-300 hover:bg-cyan-50/70 dark:border-slate-700/80 dark:bg-slate-900/50 dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/10'}`}
                  >
                    <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                      {t.bookingFlow.urgencyScheduled}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Réservez un transport planifié avec créneau confirmé.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgencyLevel('immediate')}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${urgencyLevel === 'immediate' ? 'border-red-500 bg-red-500/10 shadow-sm shadow-red-500/10 ring-1 ring-red-500/50 dark:border-red-400 dark:ring-red-400/70' : 'border-slate-200/80 bg-white/80 hover:border-red-300 hover:bg-red-50/70 dark:border-slate-700/80 dark:bg-slate-900/50 dark:hover:border-red-500/50 dark:hover:bg-red-500/10'}`}
                  >
                    <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                      {t.bookingFlow.urgencyImmediate}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Choisissez le premier créneau disponible pour un départ prioritaire.
                    </p>
                  </button>
                </div>
              </div>

              <div className={redGlassSurfaceClassName}>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.dateAndTime}
                </h2>

                <SpecialBookingDateTimeStep
                  title={t.bookingFlow.dateAndTime}
                  dateLabel={t.bookingFlow.selectDate}
                  timeLabel={t.bookingFlow.selectTime}
                  bookingDate={bookingDate}
                  calendarYear={calendarYear}
                  calendarMonth={calendarMonth}
                  monthDays={monthDays}
                  onSelectDate={handleDaySelect}
                  onMonthChange={handleMonthChange}
                  monthLoading={monthLoading}
                  maxDate={calendarMaxDate ?? undefined}
                  selectedSlot={bookingTime || null}
                  slots={displaySlots}
                  onSelectSlot={handleSlotSelect}
                  slotLoading={availabilityLoading}
                  providerTimezone={providerTimezone}
                  slotEmptyMessage={slotEmptyMessage}
                  availabilityErrorTitle={t.bookingFlow.error}
                  availabilityErrorMessage={availabilityError ? availabilityErrorMessage : null}
                  disabled={selectedServiceIds.length === 0}
                  beforeCalendar={
                    showImmediateAutoAssignmentBanner ? (
                      <div className={redTintPanelClassName}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                          <div className="flex-1 space-y-3">
                            <div className="space-y-1.5">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {t.bookingFlow.immediateAutoAssigned}
                              </h3>
                              {showImmediateNextDayFallback ? (
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {t.bookingFlow.immediateNextDayFallback}
                                </p>
                              ) : null}
                              <p className="text-xs text-slate-700 dark:text-slate-300">
                                {t.bookingFlow.immediateAdjustHint}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <div className="rounded-lg border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-red-500/5 dark:border-slate-700/70 dark:bg-slate-900/60">
                                <span className="block text-[11px] font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
                                  {t.bookingFlow.selectDate}
                                </span>
                                <span className="block whitespace-nowrap text-right text-sm font-medium text-slate-900 dark:text-white">
                                  {bookingDate}
                                </span>
                              </div>
                              <div className="rounded-lg border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-red-500/5 dark:border-slate-700/70 dark:bg-slate-900/60">
                                <span className="block text-[11px] font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
                                  {t.bookingFlow.selectTime}
                                </span>
                                <span className="block whitespace-nowrap text-right text-sm font-medium text-slate-900 dark:text-white">
                                  {autoAssignedTimeValue}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null
                  }
                />

                <BookingStepActions
                  onNext={() => setCurrentStep(2)}
                  nextDisabled={!canContinueToInfo}
                  nextLabel={t.bookingFlow.next}
                  nextType="button"
                />
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-3">
              <div className={cyanGlassSurfaceClassName}>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.serviceAddress}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      Adresse de départ *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <textarea
                        value={pickupAddress}
                        onChange={(event) => {
                          setPickupAddressEdited(true);
                          setPickupAddress(event.target.value);
                        }}
                        placeholder="Adresse complète de prise en charge"
                        rows={3}
                        className={`${inputClass} pl-10 resize-none`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      Adresse de destination *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <textarea
                        value={destinationAddress}
                        onChange={(event) => {
                          setDestinationAddress(event.target.value);
                        }}
                        placeholder="Adresse complète de destination"
                        rows={3}
                        className={`${inputClass} pl-10 resize-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={cyanGlassSurfaceClassName}>
                <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.patientInfo}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                        {t.bookingFlow.fullName} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600 dark:text-cyan-400" />
                        <input
                          type="text"
                          value={patientInfo.name}
                          onChange={(event) =>
                            setPatientInfo((previous) => ({
                              ...previous,
                              name: event.target.value,
                            }))
                          }
                          placeholder="Nom du patient"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                        {t.bookingFlow.phone} *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600 dark:text-cyan-400" />
                        <TunisiaPhoneInput
                          value={patientInfo.phone}
                          onValueChange={(phone) =>
                            setPatientInfo((previous) => ({
                              ...previous,
                              phone,
                            }))
                          }
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                        Âge du patient
                      </label>
                      <input
                        type="text"
                        value={patientInfo.age}
                        onChange={(event) =>
                          setPatientInfo((previous) => ({
                            ...previous,
                            age: event.target.value,
                          }))
                        }
                        placeholder="Ex: 72"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        value={patientInfo.email}
                        onChange={(event) =>
                          setPatientInfo((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }))
                        }
                        placeholder="patient@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      État / condition médicale
                    </label>
                    <textarea
                      value={patientInfo.medicalCondition}
                      onChange={(event) =>
                        setPatientInfo((previous) => ({
                          ...previous,
                          medicalCondition: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Informations utiles pour l'équipe ambulancière"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-900 dark:text-white">
                      Mobilité du patient
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {MOBILITY_OPTIONS.map((option) => {
                        const isSelected = patientInfo.mobility === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setPatientInfo((previous) => ({
                                ...previous,
                                mobility: option.id,
                              }))
                            }
                            className={`rounded-lg border-2 p-2 text-xs font-medium transition-colors ${isSelected ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-500/50 dark:border-cyan-400 dark:text-cyan-300 dark:ring-cyan-400/70' : 'border-slate-200/80 bg-white/70 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/70 dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/10'}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Field orientation="horizontal" className="items-center gap-2">
                      <Checkbox
                        id="ambulance-oxygen"
                        checked={patientInfo.oxygen}
                        onCheckedChange={(checked) =>
                          setPatientInfo((previous) => ({
                            ...previous,
                            oxygen: checked === true,
                          }))
                        }
                      />
                      <FieldLabel
                        htmlFor="ambulance-oxygen"
                        className="text-sm text-slate-700 dark:text-slate-300"
                      >
                        Oxygène nécessaire
                      </FieldLabel>
                    </Field>

                    <Field orientation="horizontal" className="items-center gap-2">
                      <Checkbox
                        id="ambulance-accompaniment"
                        checked={patientInfo.accompaniment}
                        onCheckedChange={(checked) =>
                          setPatientInfo((previous) => ({
                            ...previous,
                            accompaniment: checked === true,
                          }))
                        }
                      />
                      <FieldLabel
                        htmlFor="ambulance-accompaniment"
                        className="text-sm text-slate-700 dark:text-slate-300"
                      >
                        Accompagnant
                      </FieldLabel>
                    </Field>
                  </div>
                </div>
              </div>

              <BookingStepActions
                backLabel={t.common.back}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
                nextDisabled={!canContinueToPayment}
                nextLabel={t.bookingFlow.continueToPayment}
                nextType="button"
              />
            </div>
          ) : null}

          {currentStep === 3 ? (
            <SpecialBookingPaymentSection
              backLabel={t.common.back}
              onBack={() => setCurrentStep(2)}
              quoteLoading={quoteLoading}
              quoteError={quoteError}
              quoteReady={Boolean(quote)}
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
              providerName={providerDisplayName}
              serviceName={selectedTransport?.label ?? t.serviceListing.ambulanceTitle}
              date={bookingDate}
              time={selectedTimeLabel}
              cashAvailable={quote?.cashAvailable ?? true}
              paymentSummary={paymentSummary}
            />
          ) : null}

          {currentStep === 4 ? (
            <BookingSuccessPanel
              bookingNumber={submission.bookingResult?.bookingNumber}
              onGoToDashboard={() => navigate('/patient-dashboard')}
              onViewServices={() => navigate('/ambulance')}
            >
              <div className={`${successRedCardClassName} grid grid-cols-1 gap-2 sm:grid-cols-3`}>
                <p>
                  <span className="font-semibold">Transport:</span>{' '}
                  {selectedTransport?.label ?? '—'}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectDate}:</span> {bookingDate}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectTime}:</span> {bookingTime}
                </p>
                <p>
                  <span className="font-semibold">Urgence:</span>{' '}
                  {urgencyLevel === 'immediate'
                    ? t.bookingFlow.urgencyImmediate
                    : t.bookingFlow.urgencyScheduled}
                </p>
                <p>
                  <span className="font-semibold">Mobilité:</span>{' '}
                  {formatMobilityLabel(patientInfo.mobility)}
                </p>
                <p>
                  <span className="font-semibold">Montant:</span>{' '}
                  <span className={`font-bold ${bookingCyanTotalClassName}`}>
                    {confirmedAmount}
                  </span>
                </p>
              </div>

              <div className={successRedCardClassName}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Détails du trajet
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  <p>
                    <span className="font-semibold">Départ:</span> {pickupAddress}
                  </p>
                  <p>
                    <span className="font-semibold">Destination:</span> {destinationAddress}
                  </p>
                  <p>
                    <span className="font-semibold">Patient:</span> {patientInfo.name} —{' '}
                    {patientInfo.phone}
                  </p>
                  {patientInfo.medicalCondition ? (
                    <p>
                      <span className="font-semibold">Condition:</span>{' '}
                      {patientInfo.medicalCondition}
                    </p>
                  ) : null}
                  <p>
                    <span className="font-semibold">Options:</span>{' '}
                    {patientInfo.oxygen ? 'Oxygène requis' : 'Sans oxygène'} •{' '}
                    {patientInfo.accompaniment ? 'Accompagnant prévu' : 'Sans accompagnant'}
                  </p>
                </div>
              </div>
            </BookingSuccessPanel>
          ) : null}
        </div>
      </BookingFlowBodyLayout>
    </BookingFlowChrome>
  );
}
