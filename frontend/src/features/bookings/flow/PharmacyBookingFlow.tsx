import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Clock,
  Home,
  Loader2,
  MapPin,
  ShoppingCart,
  Upload,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  bookingBothLocationBadgeClassName,
  bookingCyanTotalClassName,
  bookingDurationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingNeutralPanelClassName,
  bookingNeutralSuccessCardClassName,
  bookingNeutralSurfaceClassName,
  bookingPrescriptionRequiredBadgeClassName,
  bookingProviderLocationBadgeClassName,
  bookingUploadDropzoneClassName,
  bookingUploadErrorClassName,
  bookingUploadIconClassName,
  bookingUploadSuccessClassName,
} from './BookingFlowUi';
import { logBookingFlowWarning } from './bookingFlowLogger';
import {
  formatDailyStartTime,
  formatDateValue,
  formatServiceDuration,
  formatServicePrice,
  formatTimeLabel as formatBookingTimeLabel,
} from './utils';
import {
  getProviderDisplayName,
  getProviderImageUrl,
  getProviderLocation,
} from '@/features/providers/public-api';
import {
  createServiceAccentVariables,
  useServiceAccent,
  useServiceCatalog,
} from '@/features/services';
import { getUploadAcceptAttribute, useUploadFile, waitForFileReady } from '@/features/files';
import { Button } from '@/shared/ui/primitives/button';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Field, FieldLabel } from '@/shared/ui/primitives/field';
import type { ChangeEvent } from 'react';
import type { BookingPaymentMethod, BookingQuoteRequest } from '@/features/bookings/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';

// ============================================
// TYPES / CONSTANTS
// ============================================

type PharmacyLocationSelection = 'domicile' | 'pharmacie';
type PharmacyServiceLocation = PharmacyLocationSelection | 'both';

const PRESCRIPTION_ACCEPT = getUploadAcceptAttribute('Prescription');
const SUMMARY_REQUIRED_PLACEHOLDER = '_';
const SUMMARY_PRICE_PENDING = 'À confirmer';

function normalizeServiceLocation(
  serviceLocation: PatientServiceItemResponse['serviceLocation'],
): PharmacyServiceLocation {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'domicile';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'pharmacie';
}

// ============================================
// COMPONENT
// ============================================

export function PharmacyBookingFlow() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const { t } = useLanguage();
  const { address: patientAddressPrefill } = usePatientBookingAddressPrefill();
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useBookingProvider(providerId);
  const {
    items: pharmacyServices,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'pharmacy',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('pharmacy');
  const accentVariables = createServiceAccentVariables(accent);
  const {
    mutateAsync: uploadPrescription,
    isPending: prescriptionUploading,
    error: prescriptionUploadError,
    reset: resetUpload,
  } = useUploadFile();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PharmacyLocationSelection | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [hasPrescription, setHasPrescription] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [prescriptionFileName, setPrescriptionFileName] = useState('');
  const [prescriptionFileId, setPrescriptionFileId] = useState<string | null>(null);
  const [prescriptionProcessing, setPrescriptionProcessing] = useState(false);
  const [prescriptionProcessingError, setPrescriptionProcessingError] = useState<Error | null>(
    null,
  );
  const prescriptionInputRef = useRef<HTMLInputElement | null>(null);
  const prescriptionReadinessAbortRef = useRef<AbortController | null>(null);
  const prescriptionUploadSequenceRef = useRef(0);

  const selectedServiceData = useMemo(
    () => pharmacyServices.find((service) => service.id === selectedService) ?? null,
    [pharmacyServices, selectedService],
  );
  const selectedServiceId = selectedServiceData?.id ?? null;
  const selectedServiceLocation = selectedServiceData?.serviceLocation ?? null;
  const selectedServiceRequiresPrescription = Boolean(selectedServiceData?.requiresPrescription);
  const serviceLocationType = selectedServiceLocation
    ? normalizeServiceLocation(selectedServiceLocation)
    : selectedServiceData
      ? 'pharmacie'
      : null;
  const prescriptionRequired = selectedServiceRequiresPrescription;
  const needsLocationSelection = serviceLocationType === 'both';
  const effectiveLocation = useMemo(() => {
    if (!serviceLocationType) {
      return null;
    }

    if (serviceLocationType === 'both') {
      return selectedLocation;
    }

    return serviceLocationType;
  }, [selectedLocation, serviceLocationType]);
  const selectedServiceIds = selectedServiceData ? [selectedServiceData.id] : [];
  const totalSteps = needsLocationSelection ? 6 : 5;
  const datetimeStep = needsLocationSelection ? 3 : 2;
  const paymentStep = needsLocationSelection ? 5 : 4;

  const defaultFailureMessage = t.bookingFlow.bookingErrorGeneric;
  const {
    days: monthAvailabilityDays,
    loading: monthLoading,
    timezone: providerTimezone,
    maxBookableDate: calendarMaxDate,
    refetch: refetchMonthAvailability,
  } = useMonthAvailability(provider?.id, calendarYear, calendarMonth, selectedServiceIds);

  const availability = useAvailability(
    provider?.id,
    bookingDate && selectedServiceData
      ? {
          startDate: bookingDate,
          endDate: bookingDate,
          serviceIds: selectedServiceIds,
        }
      : null,
    defaultFailureMessage,
  );

  const handleNext = useCallback(() => {
    setStep((currentStep) => Math.min(currentStep + 1, totalSteps));
  }, [totalSteps]);

  const handleBack = useCallback(() => {
    setStep((currentStep) => Math.max(1, currentStep - 1));
  }, []);

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => handleNext(),
    onSlotConflict: () => {
      setStep(datetimeStep);
      availability.setBookingTime('');
      void refetchMonthAvailability();
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'PharmacyBooking quote mismatch detected; refetching authoritative quote.',
        {
          hasMismatchDetails: Boolean(details),
        },
      );
      void refetchQuote();
    },
  });

  const clearPrescriptionUpload = useCallback(() => {
    prescriptionUploadSequenceRef.current += 1;
    prescriptionReadinessAbortRef.current?.abort();
    prescriptionReadinessAbortRef.current = null;
    resetUpload();
    setPrescriptionFileName('');
    setPrescriptionFileId(null);
    setPrescriptionProcessing(false);
    setPrescriptionProcessingError(null);

    if (prescriptionInputRef.current) {
      prescriptionInputRef.current.value = '';
    }
  }, [resetUpload]);

  useEffect(() => {
    return () => {
      prescriptionReadinessAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedService && !pharmacyServices.some((service) => service.id === selectedService)) {
      setSelectedService(null);
    }
  }, [pharmacyServices, selectedService]);

  useEffect(() => {
    if (!selectedServiceId) {
      setSelectedLocation(null);
      return;
    }

    const nextLocation = normalizeServiceLocation(selectedServiceLocation);

    if (nextLocation === 'both') {
      setSelectedLocation(null);
      return;
    }

    setSelectedLocation(nextLocation);
  }, [selectedServiceId, selectedServiceLocation]);

  useEffect(() => {
    setStep((currentStep) => Math.min(currentStep, totalSteps));
  }, [totalSteps]);

  useEffect(() => {
    if (!selectedServiceId) {
      setHasPrescription(false);
      clearPrescriptionUpload();
      return;
    }

    setHasPrescription(selectedServiceRequiresPrescription);
    clearPrescriptionUpload();
  }, [clearPrescriptionUpload, selectedServiceId, selectedServiceRequiresPrescription]);

  const { displaySlots, monthDays, selectedTimeLabel } = useSpecialBookingAvailability({
    availableStartTimes: availability.availableStartTimes,
    bookingDate,
    bookingTime: availability.bookingTime,
    monthAvailabilityDays,
    providerTimezone,
  });
  const slotEmptyMessage = bookingDate
    ? t.bookingFlow.calendarNoAvailability
    : t.bookingFlow.calendarSelectDay;
  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    const domicileAddress =
      effectiveLocation === 'domicile' && patientAddressPrefill?.line1
        ? patientAddressPrefill
        : null;

    if (
      step < paymentStep ||
      !provider ||
      !selectedServiceData ||
      !bookingDate ||
      !availability.bookingTime ||
      !effectiveLocation ||
      (effectiveLocation === 'domicile' && !domicileAddress) ||
      ((prescriptionRequired || hasPrescription) && !prescriptionFileId)
    ) {
      return null;
    }

    return {
      providerId: provider.id,
      serviceItems: [{ serviceId: selectedServiceData.id, quantity: 1 }],
      startDate: bookingDate,
      endDate: bookingDate,
      dailyStartTime: formatDailyStartTime(availability.bookingTime),
      patientLocationChoice: effectiveLocation === 'domicile' ? 'home' : 'provider_site',
      address: domicileAddress
        ? {
            line1: domicileAddress.line1,
            city: domicileAddress.city ?? null,
            postalCode: domicileAddress.postalCode ?? null,
            latitude: domicileAddress.latitude ?? null,
            longitude: domicileAddress.longitude ?? null,
          }
        : undefined,
      patientNotes: patientNotes || undefined,
      prescriptionFileId: prescriptionFileId ?? undefined,
      typeConfig: {
        items: selectedServiceData.name ?? selectedServiceData.id,
        hasPrescription,
        notes: patientNotes || undefined,
      },
    };
  }, [
    availability.bookingTime,
    bookingDate,
    effectiveLocation,
    hasPrescription,
    patientNotes,
    patientAddressPrefill,
    paymentStep,
    prescriptionFileId,
    prescriptionRequired,
    provider,
    selectedServiceData,
    step,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);

  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? selectedServiceData?.currency ?? 'TND';
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;
  const providerDisplayName = provider ? getProviderDisplayName(provider) : '';
  const providerImageUrl = provider ? getProviderImageUrl(provider) : null;
  const providerLocation = provider ? getProviderLocation(provider) : '';
  const bookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const platformFee = quote?.pricing.platformFee ?? 0;
  const sideSubtotalSummary = formatServicePrice(
    selectedServiceData?.price ?? 0,
    selectedServiceData?.currency ?? 'TND',
  );
  const currentContent = (() => {
    if (step === 1) {
      return 'service';
    }

    if (needsLocationSelection) {
      if (step === 2) return 'location';
      if (step === 3) return 'datetime';
      if (step === 4) return 'details';
      if (step === 5) return 'payment';
      if (step === 6) return 'confirmation';
    } else {
      if (step === 2) return 'datetime';
      if (step === 3) return 'details';
      if (step === 4) return 'payment';
      if (step === 5) return 'confirmation';
    }

    return 'service';
  })();

  useEffect(() => {
    if (currentContent !== 'payment' || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('PharmacyBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentContent, quote, quoteError, quoteLoading, quoteRequest]);

  const stepLabels = needsLocationSelection
    ? [
        'Service',
        t.bookingFlow.locationLabel,
        t.bookingFlow.selectDate,
        t.bookingFlow.stepDetails,
        t.bookingFlow.stepPayment,
        t.bookingFlow.stepConfirmation,
      ]
    : [
        'Service',
        t.bookingFlow.selectDate,
        t.bookingFlow.stepDetails,
        t.bookingFlow.stepPayment,
        t.bookingFlow.stepConfirmation,
      ];

  const getLocationBadge = (locationType: PharmacyServiceLocation) => {
    if (locationType === 'domicile') {
      return (
        <span className={bookingHomeLocationBadgeClassName}>
          <Home className="h-3 w-3" />
          {t.bookingFlow.domicileLabel}
        </span>
      );
    }

    if (locationType === 'pharmacie') {
      return (
        <span className={bookingProviderLocationBadgeClassName}>
          <Building2 className="h-3 w-3" />
          {t.bookingFlow.pharmacieLabel}
        </span>
      );
    }

    return (
      <span className={bookingBothLocationBadgeClassName}>
        <MapPin className="h-3 w-3" />
        {t.bookingFlow.bothLabel}
      </span>
    );
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const handlePrescriptionFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      clearPrescriptionUpload();
      return;
    }

    const uploadSequence = prescriptionUploadSequenceRef.current + 1;
    prescriptionUploadSequenceRef.current = uploadSequence;
    prescriptionReadinessAbortRef.current?.abort();
    const readinessAbortController = new AbortController();
    prescriptionReadinessAbortRef.current = readinessAbortController;

    setPrescriptionFileName(file.name);
    setPrescriptionFileId(null);
    setPrescriptionProcessing(false);
    setPrescriptionProcessingError(null);

    const uploadedFile = await uploadPrescription({
      file,
      useCase: 'Prescription',
    }).catch(() => null);

    if (prescriptionUploadSequenceRef.current !== uploadSequence) {
      return;
    }

    if (!uploadedFile?.fileId) {
      setPrescriptionFileName('');
      setPrescriptionFileId(null);
      setPrescriptionProcessing(false);

      if (prescriptionInputRef.current) {
        prescriptionInputRef.current.value = '';
      }

      return;
    }

    setPrescriptionFileName(file.name);
    setPrescriptionProcessing(true);

    try {
      await waitForFileReady(uploadedFile.fileId, {
        signal: readinessAbortController.signal,
      });

      if (prescriptionUploadSequenceRef.current !== uploadSequence) {
        return;
      }

      setPrescriptionFileId(uploadedFile.fileId);
      setPrescriptionProcessingError(null);
    } catch (waitError) {
      if (prescriptionUploadSequenceRef.current !== uploadSequence) {
        return;
      }

      setPrescriptionFileId(null);

      if (waitError instanceof Error && waitError.name === 'AbortError') {
        return;
      }

      setPrescriptionProcessingError(
        waitError instanceof Error ? waitError : new Error('La verification du fichier a echoue.'),
      );
    } finally {
      if (prescriptionUploadSequenceRef.current === uploadSequence) {
        setPrescriptionProcessing(false);
      }
    }
  };

  const handlePaymentComplete = (method: BookingPaymentMethod) => {
    if (!quoteRequest || !quote) {
      return;
    }

    void submission
      .submit({
        ...quoteRequest,
        paymentMethod: method,
        expectedTotalAmount: quote.pricing.totalAmount,
      })
      .catch(() => undefined);
  };

  const canProceedToNextStep = () => {
    if (currentContent === 'service') {
      return Boolean(selectedServiceData) && !servicesLoading && !servicesError;
    }

    if (currentContent === 'location') {
      return Boolean(selectedLocation);
    }

    if (currentContent === 'datetime') {
      return Boolean(
        bookingDate &&
        availability.bookingTime &&
        !availability.availabilityLoading &&
        !availability.availabilityError &&
        displaySlots.length > 0,
      );
    }

    if (currentContent === 'details') {
      if (!effectiveLocation || prescriptionUploading || prescriptionProcessing) {
        return false;
      }

      if (effectiveLocation === 'domicile' && !patientAddressPrefill?.line1) {
        return false;
      }

      if (prescriptionRequired || hasPrescription) {
        return Boolean(prescriptionFileId);
      }

      return true;
    }

    return false;
  };

  if (providerLoading) {
    return <BookingPageLoader />;
  }

  if (providerError || !provider) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        description={t.serviceListing.errorLoading}
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/pharmacy')}
      />
    );
  }

  const confirmedDate = formatDateValue(submission.bookingResult?.startDate) ?? bookingDate;
  const confirmedTime =
    formatBookingTimeLabel(submission.bookingResult?.dailyStartTime, '') || selectedTimeLabel;
  const confirmedAmount = submission.bookingResult?.pricing
    ? `${submission.bookingResult.pricing.totalAmount.toFixed(2)} ${submission.bookingResult.pricing.currency || quoteCurrency}`
    : formatServicePrice(totalPrice, quoteCurrency);
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const bookingHeader: BookingFlowHeaderData = {
    providerName: providerDisplayName,
    providerImageUrl,
    rating: {
      average: provider.ratingAverage,
      count: provider.ratingCount,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: t.bookingFlow.pharmacyBooking,
    locationLabel: providerLocation,
  };
  const emeraldGlassSurfaceClassName = bookingNeutralSurfaceClassName;
  const emeraldSummaryClassName = bookingNeutralPanelClassName;
  const emeraldSummaryIconClassName = 'bg-transparent text-slate-500 dark:text-slate-400';
  const successEmeraldCardClassName = bookingNeutralSuccessCardClassName;
  const inputClassName =
    'w-full rounded-lg border border-emerald-200/80 bg-white/80 p-3 text-sm text-slate-900 shadow-sm shadow-emerald-500/5 backdrop-blur-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20';
  const emeraldSelectedIconTileClassName =
    'text-white shadow-sm shadow-[color:var(--service-accent-shadow)] bg-[linear-gradient(135deg,var(--service-accent-from)_0%,var(--service-accent-to)_100%)]';
  const emeraldInactiveIconTileClassName =
    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  const serviceNameSummary = selectedServiceData?.name ?? selectedServiceData?.id;
  const serviceDurationSummary = selectedServiceData
    ? formatServiceDuration(selectedServiceData.durationMinutes, SUMMARY_REQUIRED_PLACEHOLDER)
    : SUMMARY_REQUIRED_PLACEHOLDER;
  const effectiveLocationSummary =
    effectiveLocation === 'domicile'
      ? t.bookingFlow.atHome
      : effectiveLocation === 'pharmacie'
        ? t.bookingFlow.atPharmacy
        : SUMMARY_REQUIRED_PLACEHOLDER;
  const effectiveAddressSummary =
    effectiveLocation === 'domicile'
      ? patientAddressPrefill?.displayAddress || SUMMARY_REQUIRED_PLACEHOLDER
      : effectiveLocation === 'pharmacie'
        ? providerLocation || SUMMARY_REQUIRED_PLACEHOLDER
        : SUMMARY_REQUIRED_PLACEHOLDER;
  const trimmedPatientNotes = patientNotes.trim();
  const hasQuote = Boolean(quote);
  const totalPriceSummary = hasQuote
    ? formatServicePrice(totalPrice, quoteCurrency)
    : SUMMARY_PRICE_PENDING;
  const showLocationSummarySection =
    currentContent === 'location' || currentContent === 'datetime' || currentContent === 'details';
  const showDateTimeSummarySection = currentContent === 'datetime' || currentContent === 'details';
  const showDetailsSummarySection = currentContent === 'details';
  const serviceSummarySection: BookingFlowSummarySection = {
    title: 'Service',
    items: [
      {
        label: serviceNameSummary || t.bookingFlow.serviceLabel,
        value: selectedServiceData ? sideSubtotalSummary : SUMMARY_REQUIRED_PLACEHOLDER,
        valueTitle: selectedServiceData ? sideSubtotalSummary : SUMMARY_REQUIRED_PLACEHOLDER,
        className: selectedServiceData ? summaryServiceRowClassName : undefined,
        valueClassName: selectedServiceData ? summaryServiceValueClassName : undefined,
      },
      {
        label: 'Durée',
        value: serviceDurationSummary,
        className: 'border-t border-border/70 pt-3',
        valueClassName: 'font-normal text-muted-foreground',
      },
      {
        label: 'Pharmacie',
        value: providerDisplayName || SUMMARY_REQUIRED_PLACEHOLDER,
        valueTitle: providerDisplayName || SUMMARY_REQUIRED_PLACEHOLDER,
      },
    ],
  };
  const locationSummarySection: BookingFlowSummarySection = {
    title: t.bookingFlow.serviceLocation,
    items: [
      {
        label: 'Lieu',
        value: effectiveLocationSummary,
      },
      {
        label: effectiveLocation === 'domicile' ? 'Adresse' : 'Adresse pharmacie',
        value: effectiveAddressSummary,
        valueTitle: effectiveAddressSummary,
        hidden: !selectedServiceData,
      },
    ],
  };
  const dateTimeSummarySection: BookingFlowSummarySection = {
    title: t.bookingFlow.dateAndTime,
    items: [
      {
        label: 'Date',
        value: bookingDate || SUMMARY_REQUIRED_PLACEHOLDER,
        valueClassName: 'whitespace-nowrap text-right',
      },
      {
        label: 'Heure',
        value: selectedTimeLabel || SUMMARY_REQUIRED_PLACEHOLDER,
        valueClassName: 'whitespace-nowrap text-right',
      },
    ],
  };
  const detailsSummarySection: BookingFlowSummarySection = {
    title: t.bookingFlow.additionalDetails,
    items: [
      {
        label: 'Prescription',
        value: prescriptionRequired
          ? prescriptionFileId
            ? prescriptionFileName || t.bookingFlow.prescriptionUploaded
            : SUMMARY_REQUIRED_PLACEHOLDER
          : hasPrescription
            ? prescriptionFileId
              ? prescriptionFileName || t.bookingFlow.prescriptionUploaded
              : SUMMARY_REQUIRED_PLACEHOLDER
            : 'Non requise',
        valueTitle: prescriptionFileName || undefined,
        hidden: !selectedServiceData,
      },
      {
        label: 'Notes',
        value: trimmedPatientNotes,
        valueTitle: trimmedPatientNotes,
        hidden: !trimmedPatientNotes,
      },
    ],
  };
  const bookingSummarySections: BookingFlowSummarySection[] = [
    serviceSummarySection,
    { ...locationSummarySection, hidden: !showLocationSummarySection },
    { ...dateTimeSummarySection, hidden: !showDateTimeSummarySection },
    { ...detailsSummarySection, hidden: !showDetailsSummarySection },
  ];
  const paymentSummarySections: BookingFlowSummarySection[] = [
    serviceSummarySection,
    locationSummarySection,
    dateTimeSummarySection,
    detailsSummarySection,
    {
      title: 'Tarification',
      items: [
        {
          label: t.bookingFlow.subtotal,
          value: hasQuote
            ? formatServicePrice(bookingSubtotal, quoteCurrency)
            : SUMMARY_PRICE_PENDING,
        },
        {
          label: t.bookingFlow.serviceFees,
          value: hasQuote ? formatServicePrice(platformFee, quoteCurrency) : SUMMARY_PRICE_PENDING,
        },
      ],
    },
  ];
  const bookingSummary =
    currentContent !== 'payment' && currentContent !== 'confirmation' ? (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart />}
        className={emeraldSummaryClassName}
        iconClassName={emeraldSummaryIconClassName}
        sections={bookingSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: sideSubtotalSummary,
          valueTitle: sideSubtotalSummary,
          variant: 'line',
          labelClassName: 'text-base font-extrabold uppercase tracking-wide text-foreground',
          valueClassName: 'text-sm font-semibold text-muted-foreground',
        }}
      />
    ) : null;
  const paymentSummary = quote ? (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      icon={<ShoppingCart />}
      className={emeraldSummaryClassName}
      iconClassName={emeraldSummaryIconClassName}
      sections={paymentSummarySections}
      total={{
        label: t.bookingFlow.totalToPay,
        value: totalPriceSummary,
        valueTitle: totalPriceSummary,
        valueClassName: hasQuote ? bookingCyanTotalClassName : undefined,
      }}
    />
  ) : undefined;

  return (
    <BookingFlowChrome
      header={bookingHeader}
      currentStep={step}
      stepLabels={stepLabels}
      showProgress={currentContent !== 'confirmation'}
      className="px-6 py-6 pb-20 text-slate-900 dark:text-white"
      headerClassName="relative overflow-hidden rounded-[18px] p-[2px] shadow-lg"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[16px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="max-w-5xl"
      contentClassName="space-y-4"
    >
      <BookingFlowBodyLayout summary={bookingSummary} mainClassName="space-y-4">
        <div className="space-y-4" style={accentVariables}>
          <div className={emeraldGlassSurfaceClassName}>
            {currentContent === 'service' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.chooseService}
                </h2>

                {servicesLoading && pharmacyServices.length === 0 ? (
                  <BookingOptionListSkeleton items={4} />
                ) : null}

                {servicesError ? (
                  <BookingInlineState
                    tone="danger"
                    title={t.common.loadingError}
                    description={servicesErrorMessage}
                  />
                ) : null}

                {!servicesLoading && !servicesError && pharmacyServices.length === 0 ? (
                  <BookingInlineState tone="muted" title={t.services.noServicesFound} />
                ) : null}

                {!servicesLoading && !servicesError && pharmacyServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pharmacyServices.map((service) => {
                      const locationType = normalizeServiceLocation(service.serviceLocation);

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedService(service.id)}
                          className={`rounded-xl border p-4 text-left transition-colors ${selectedService === service.id ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                        >
                          <div className="flex justify-between items-start mb-2 gap-3">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {service.name ?? service.id}
                            </span>
                            <span className="whitespace-nowrap text-sm font-bold text-[color:var(--service-accent-from)]">
                              {formatServicePrice(service.price, service.currency)}
                            </span>
                          </div>

                          {service.shortDescription ? (
                            <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                              {service.shortDescription}
                            </p>
                          ) : null}

                          <div className="flex items-center justify-between gap-3">
                            <div className={bookingDurationBadgeClassName}>
                              <Clock className="h-3 w-3" />
                              <span>{formatServiceDuration(service.durationMinutes, '—')}</span>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                              {service.requiresPrescription ? (
                                <span className={bookingPrescriptionRequiredBadgeClassName}>
                                  <AlertCircle className="h-3 w-3" />
                                  {t.bookingFlow.prescriptionRequiredTitle}
                                </span>
                              ) : null}
                              {getLocationBadge(locationType)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            {currentContent === 'location' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.whereService}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.bookingFlow.serviceAvailableBoth}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedLocation('domicile')}
                    className={`rounded-xl border-2 p-6 text-left transition-colors ${selectedLocation === 'domicile' ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                  >
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${selectedLocation === 'domicile' ? emeraldSelectedIconTileClassName : emeraldInactiveIconTileClassName}`}
                    >
                      <Home className="h-7 w-7" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                      {t.bookingFlow.atHome}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t.bookingFlow.pharmacistComesToYou}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLocation('pharmacie')}
                    className={`rounded-xl border-2 p-6 text-left transition-colors ${selectedLocation === 'pharmacie' ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                  >
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${selectedLocation === 'pharmacie' ? emeraldSelectedIconTileClassName : emeraldInactiveIconTileClassName}`}
                    >
                      <Building2 className="h-7 w-7" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                      {t.bookingFlow.atPharmacy}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t.bookingFlow.goToPharmacy}
                    </p>
                    <p className="mt-2 text-xs text-[color:var(--service-accent-from)]">
                      {t.bookingFlow.noExtraFees}
                    </p>
                  </button>
                </div>
              </div>
            ) : null}

            {currentContent === 'datetime' ? (
              <SpecialBookingDateTimeStep
                title={t.bookingFlow.dateAndTime}
                dateLabel={t.bookingFlow.selectDate}
                timeLabel={t.bookingFlow.selectTime}
                bookingDate={bookingDate}
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                monthDays={monthDays}
                onSelectDate={setBookingDate}
                onMonthChange={handleMonthChange}
                monthLoading={monthLoading}
                maxDate={calendarMaxDate ?? undefined}
                selectedSlot={availability.bookingTime || null}
                slots={displaySlots}
                onSelectSlot={availability.setBookingTime}
                slotLoading={availability.availabilityLoading}
                providerTimezone={providerTimezone}
                slotEmptyMessage={slotEmptyMessage}
                availabilityErrorTitle={t.bookingFlow.error}
                availabilityErrorMessage={availability.availabilityErrorMessage}
              />
            ) : null}

            {currentContent === 'details' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.additionalDetails}
                </h2>

                {prescriptionRequired ? (
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 shadow-sm shadow-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/10">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />

                      <div>
                        <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                          {t.bookingFlow.prescriptionRequiredTitle}
                        </h3>
                        <p className="text-xs text-amber-800 dark:text-amber-100">
                          {t.bookingFlow.prescriptionRequiredDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className={bookingNeutralPanelClassName}>
                  <div className="flex items-center gap-3">
                    {effectiveLocation === 'domicile' ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <Home className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.bookingFlow.serviceLocation}
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {effectiveLocation === 'domicile'
                          ? t.bookingFlow.atHome
                          : t.bookingFlow.atPharmacy}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {effectiveLocation === 'domicile'
                          ? patientAddressPrefill?.displayAddress || 'Adresse du profil requise'
                          : providerLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field
                    data-disabled={prescriptionRequired || undefined}
                    orientation="horizontal"
                    className="items-center gap-3"
                  >
                    <Checkbox
                      id="prescription"
                      checked={hasPrescription}
                      disabled={prescriptionRequired}
                      onCheckedChange={(checked) => {
                        const nextValue = checked === true;
                        setHasPrescription(nextValue);
                        if (!nextValue) {
                          clearPrescriptionUpload();
                        }
                      }}
                    />

                    <FieldLabel
                      htmlFor="prescription"
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      {prescriptionRequired
                        ? t.bookingFlow.prescriptionRequiredTitle
                        : t.bookingFlow.hasPrescriptionOptional}
                    </FieldLabel>
                  </Field>

                  {hasPrescription ? (
                    <div className={bookingUploadDropzoneClassName}>
                      <input
                        ref={prescriptionInputRef}
                        type="file"
                        accept={PRESCRIPTION_ACCEPT}
                        className="hidden"
                        onChange={(event) => {
                          void handlePrescriptionFileChange(event);
                        }}
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className={bookingUploadIconClassName}>
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {t.bookingFlow.uploadPrescription}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {prescriptionFileName || t.bookingFlow.fileFormats}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => prescriptionInputRef.current?.click()}
                          disabled={prescriptionUploading || prescriptionProcessing}
                        >
                          {t.bookingFlow.browseFiles}
                        </Button>
                        {prescriptionUploading || prescriptionProcessing ? (
                          <div className="flex items-center gap-2 text-xs text-success">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>
                              {prescriptionProcessing
                                ? 'Verification du fichier en cours...'
                                : t.common.loading}
                            </span>
                          </div>
                        ) : null}
                        {!prescriptionUploading && !prescriptionProcessing && prescriptionFileId ? (
                          <p className={`text-xs ${bookingUploadSuccessClassName}`}>
                            {prescriptionFileName}
                          </p>
                        ) : null}
                        {prescriptionUploadError || prescriptionProcessingError ? (
                          <p className={`text-xs ${bookingUploadErrorClassName}`}>
                            {(prescriptionProcessingError ?? prescriptionUploadError)?.message}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.bookingFlow.notesForPharmacist}
                    </label>
                    <textarea
                      rows={3}
                      value={patientNotes}
                      onChange={(e) => setPatientNotes(e.target.value)}
                      className={`${inputClassName} resize-none`}
                      placeholder={t.bookingFlow.allergiesPlaceholder}
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : null}

            {currentContent === 'payment' ? (
              <SpecialBookingPaymentSection
                backLabel={t.bookingFlow.previous}
                onBack={handleBack}
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
                serviceName={selectedServiceData?.name ?? selectedServiceData?.id}
                date={bookingDate}
                time={selectedTimeLabel}
                cashAvailable={quote?.cashAvailable ?? true}
                paymentSummary={paymentSummary}
              />
            ) : null}

            {currentContent === 'confirmation' ? (
              <BookingSuccessPanel
                bookingNumber={submission.bookingResult?.bookingNumber}
                onGoToDashboard={() => navigate('/patient-dashboard')}
                onViewServices={() => navigate('/pharmacy')}
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Votre réservation en pharmacie a bien été enregistrée. Vous recevrez un SMS de
                  confirmation avec les prochaines étapes.
                </p>

                <div
                  className={`${successEmeraldCardClassName} grid grid-cols-1 gap-2 sm:grid-cols-2`}
                >
                  <p>
                    <span className="font-semibold">Service:</span>{' '}
                    {submission.bookingResult?.service?.name || selectedServiceData?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Lieu:</span>{' '}
                    {effectiveLocation === 'domicile'
                      ? t.bookingFlow.atHome
                      : t.bookingFlow.atPharmacy}
                  </p>
                  <p>
                    <span className="font-semibold">{t.bookingFlow.selectDate}:</span>{' '}
                    {confirmedDate}
                  </p>
                  <p>
                    <span className="font-semibold">{t.bookingFlow.selectTime}:</span>{' '}
                    {confirmedTime}
                  </p>
                  <p>
                    <span className="font-semibold">Pharmacie:</span> {providerDisplayName}
                  </p>
                  <p>
                    <span className="font-semibold">Prescription:</span>{' '}
                    {hasPrescription ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <span className="font-semibold">Montant:</span>{' '}
                    <span className={`font-bold ${bookingCyanTotalClassName}`}>
                      {confirmedAmount}
                    </span>
                  </p>
                </div>

                <div className={successEmeraldCardClassName}>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Informations complémentaires
                  </p>
                  <div className="mt-3 space-y-2">
                    <p>
                      <span className="font-semibold">Ordonnance:</span>{' '}
                      {prescriptionFileName ||
                        (hasPrescription ? t.bookingFlow.uploadPrescription : 'Aucune')}
                    </p>
                    <p>
                      <span className="font-semibold">Adresse:</span>{' '}
                      {effectiveLocation === 'domicile'
                        ? patientAddressPrefill?.displayAddress || 'Adresse du profil requise'
                        : providerLocation}
                    </p>
                    {patientNotes ? (
                      <p>
                        <span className="font-semibold">Notes:</span> {patientNotes}
                      </p>
                    ) : null}
                  </div>
                </div>
              </BookingSuccessPanel>
            ) : null}
          </div>

          {currentContent !== 'payment' && currentContent !== 'confirmation' ? (
            <BookingStepActions
              onBack={step > 1 ? handleBack : undefined}
              backLabel={t.bookingFlow.previous}
              onNext={handleNext}
              nextType="button"
              nextDisabled={!canProceedToNextStep()}
              nextLabel={
                currentContent === 'details' ? t.bookingFlow.continueToPayment : t.bookingFlow.next
              }
            />
          ) : null}
        </div>
      </BookingFlowBodyLayout>
    </BookingFlowChrome>
  );
}
