import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Clock,
  FileText,
  Home,
  MapPin,
  Scan,
  ShoppingCart,
} from 'lucide-react';
import {
  BookingNeutralPanel,
  BookingSuccessPanel,
  PaymentStep,
  DaySlotPicker,
  MonthCalendar,
  PrescriptionUploadGate,
  ServiceLocationToggle,
} from '@/features/bookings/flow/ui';
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
  getProviderDisplayName,
  getProviderImageUrl,
  getProviderLocation,
} from '@/features/providers/public-api';
import {
  createServiceAccentVariables,
  useServiceAccent,
  useServiceCatalog,
} from '@/features/services';
import { useServiceLocationChoice } from '@/features/bookings/hooks/useServiceLocationChoice';
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
  BookingQuotePanel,
  BookingStepActions,
  bookingAccentInactiveOptionClassName,
  bookingAccentSelectedOptionClassName,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
} from './internal';
import {
  bookingBothLocationBadgeClassName,
  bookingCyanTotalClassName,
  bookingDurationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingNeutralPanelClassName,
  bookingNeutralSuccessCardClassName,
  bookingPrescriptionRequiredBadgeClassName,
  bookingProviderLocationBadgeClassName,
} from './BookingFlowUi';
import { logBookingFlowWarning } from './bookingFlowLogger';
import { convertProviderTimeToLocal, getPatientTimezone, isSameTimezone } from '@/utils/timezone';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';
import type { DateOnlyResponse } from '@/shared/schemas/common';
import { formatSelectedServicesDuration } from './utils';

// ============================================
// TYPES / CONSTANTS
// ============================================

type RadiologyLocationBadgeVariant = 'home' | 'clinic' | 'both';

const REQUIRED_SUMMARY_PLACEHOLDER = '_';
const purpleGlassSurfaceClassName = bookingNeutralPanelClassName;
const purpleGlassSummaryClassName = bookingNeutralPanelClassName;
const purpleSummaryIconClassName = 'bg-transparent text-purple-600 dark:text-purple-400';
const successPurpleGlassCardClassName = bookingNeutralSuccessCardClassName;

// ============================================
// HELPERS
// ============================================

function formatDateValue(value: DateOnlyResponse | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.includes('T') ? value.slice(0, 10) : value;
  return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

function formatDailyStartTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function formatServiceDuration(
  durationMinutes: PatientServiceItemResponse['durationMinutes'],
): string {
  if (typeof durationMinutes === 'number' && durationMinutes > 0) {
    return `${durationMinutes} min`;
  }

  return 'Durée à confirmer';
}

function formatServicePrice(price: number, currency?: string | null): string {
  return `${price.toFixed(2)} ${currency ?? 'TND'}`;
}

function getLocationBadgeVariant(
  serviceLocation: PatientServiceItemResponse['serviceLocation'],
): RadiologyLocationBadgeVariant {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'home';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'clinic';
}

function getLocationLabel(locationType: RadiologyLocationBadgeVariant): string {
  if (locationType === 'home') {
    return 'À domicile';
  }

  if (locationType === 'both') {
    return 'Domicile ou centre';
  }

  return 'Au centre';
}

function getEffectiveLocationLabel(location: 'home' | 'provider_site' | null): string | null {
  if (location === 'home') {
    return 'À domicile';
  }

  if (location === 'provider_site') {
    return 'Au centre';
  }

  return null;
}

// ============================================
// COMPONENT
// ============================================

export function RadiologyBookingFlow() {
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
    items: radiologyServices,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'radiology',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('radiology');
  const accentVariables = createServiceAccentVariables(accent);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceAddressEdited, setServiceAddressEdited] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [currentStep, setCurrentStep] = useState(1);
  const [prescriptionFileId, setPrescriptionFileId] = useState<string | null>(null);

  const defaultFailureMessage = t.bookingFlow.bookingErrorGeneric;
  const selectedServiceIds = selectedServiceId ? [selectedServiceId] : [];
  const selectedService = useMemo(
    () => radiologyServices.find((service) => service.id === selectedServiceId) ?? null,
    [radiologyServices, selectedServiceId],
  );
  const selectedServices = useMemo(
    () => (selectedService ? [selectedService] : []),
    [selectedService],
  );
  const {
    needsLocationSelection,
    effectiveLocation,
    selectedLocation,
    setSelectedLocation,
    isLocationCompatible,
    requiresAddress,
  } = useServiceLocationChoice(selectedServices);
  const requiresPrescription = Boolean(selectedService?.requiresPrescription);
  const requiresInfoStep = needsLocationSelection || requiresAddress || requiresPrescription;
  const infoStep = requiresInfoStep ? 2 : null;
  const paymentStep = requiresInfoStep ? 3 : 2;
  const successStep = requiresInfoStep ? 4 : 3;
  const servicePrice = selectedService?.price ?? 0;
  const currency = selectedService?.currency ?? radiologyServices[0]?.currency ?? 'TND';

  const {
    days: monthAvailabilityDays,
    loading: monthLoading,
    timezone: providerTimezone,
    maxBookableDate: calendarMaxDate,
  } = useMonthAvailability(provider?.id, calendarYear, calendarMonth, selectedServiceIds);

  const availability = useAvailability(
    provider?.id,
    bookingDate && selectedServiceId
      ? {
          startDate: bookingDate,
          endDate: bookingDate,
          serviceIds: [selectedServiceId],
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

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(successStep),
    onSlotConflict: () => {
      setCurrentStep(1);
      setBookingTime('');
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'RadiologyBooking quote mismatch detected; refetching authoritative quote.',
        {
          hasMismatchDetails: Boolean(details),
        },
      );
      void refetchQuote();
    },
  });

  useEffect(() => {
    if (servicesLoading) {
      return;
    }

    setSelectedServiceId((previous) => {
      if (previous && radiologyServices.some((service) => service.id === previous)) {
        return previous;
      }

      return null;
    });
  }, [radiologyServices, servicesLoading]);

  useEffect(() => {
    setBookingTime('');
  }, [selectedServiceId, setBookingTime]);

  useEffect(() => {
    if (!requiresAddress || !patientAddressPrefill || serviceAddressEdited) {
      return;
    }

    setServiceAddress(patientAddressPrefill.displayAddress);
  }, [patientAddressPrefill, requiresAddress, serviceAddressEdited]);

  useEffect(() => {
    if (selectedServices.length === 0) {
      setServiceAddressEdited(false);
    }
  }, [selectedServices.length]);

  const patientTimezone = useMemo(() => {
    try {
      return getPatientTimezone();
    } catch {
      return null;
    }
  }, []);

  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    if (
      currentStep < paymentStep ||
      !provider ||
      !bookingDate ||
      !bookingTime ||
      !selectedService ||
      !isLocationCompatible ||
      (needsLocationSelection && !effectiveLocation) ||
      (requiresAddress && !serviceAddress.trim()) ||
      (requiresPrescription && !prescriptionFileId)
    ) {
      return null;
    }

    return {
      providerId: provider.id,
      serviceItems: [{ serviceId: selectedService.id, quantity: 1 }],
      startDate: bookingDate,
      endDate: bookingDate,
      dailyStartTime: formatDailyStartTime(bookingTime),
      patientLocationChoice: effectiveLocation ?? undefined,
      address: requiresAddress
        ? {
            line1: serviceAddress.trim(),
            city: serviceAddressEdited ? undefined : (patientAddressPrefill?.city ?? undefined),
            postalCode: serviceAddressEdited
              ? undefined
              : (patientAddressPrefill?.postalCode ?? undefined),
            latitude: serviceAddressEdited ? null : (patientAddressPrefill?.latitude ?? null),
            longitude: serviceAddressEdited ? null : (patientAddressPrefill?.longitude ?? null),
          }
        : undefined,
      prescriptionFileId: prescriptionFileId ?? undefined,
    };
  }, [
    bookingDate,
    bookingTime,
    currentStep,
    effectiveLocation,
    isLocationCompatible,
    needsLocationSelection,
    patientAddressPrefill,
    paymentStep,
    prescriptionFileId,
    provider,
    requiresAddress,
    requiresPrescription,
    selectedService,
    serviceAddress,
    serviceAddressEdited,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);

  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const displayedBookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const displayedPlatformFee = quote?.pricing.platformFee ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? currency;
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;

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

  const displaySlots = useMemo(() => {
    const shouldConvertTimezones = Boolean(
      bookingDate &&
      providerTimezone &&
      patientTimezone &&
      !isSameTimezone(providerTimezone, patientTimezone),
    );

    return availableStartTimes.map((time) => {
      if (!shouldConvertTimezones || !bookingDate || !providerTimezone) {
        return { value: time, label: time };
      }

      try {
        const { localLabel, rawValue } = convertProviderTimeToLocal(
          providerTimezone,
          bookingDate,
          time,
        );
        return { value: rawValue, label: localLabel };
      } catch {
        return { value: time, label: time };
      }
    });
  }, [availableStartTimes, bookingDate, patientTimezone, providerTimezone]);

  const selectedTimeLabel =
    displaySlots.find((slot) => slot.value === bookingTime)?.label ?? bookingTime;
  const selectedServiceName =
    selectedService?.name ?? selectedService?.id ?? t.bookingFlow.bookExam;

  useEffect(() => {
    if (currentStep !== paymentStep || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('RadiologyBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentStep, paymentStep, quote, quoteError, quoteLoading, quoteRequest]);

  const slotEmptyMessage = !selectedServiceId
    ? 'Sélectionnez un examen pour afficher les créneaux disponibles.'
    : bookingDate
      ? t.bookingFlow.calendarNoAvailability
      : t.bookingFlow.calendarSelectDay;
  const stepLabels = requiresInfoStep
    ? [
        t.bookingFlow.stepDetails,
        needsLocationSelection ? t.bookingFlow.chooseServiceLocation : t.bookingFlow.stepInfo,
        t.bookingFlow.stepPayment,
        t.bookingFlow.bookingSuccess,
      ]
    : [t.bookingFlow.stepDetails, t.bookingFlow.stepPayment, t.bookingFlow.bookingSuccess];
  const canContinueFromDetails = Boolean(
    selectedService &&
    bookingDate &&
    bookingTime &&
    isLocationCompatible &&
    !availabilityLoading &&
    !availabilityError &&
    displaySlots.length > 0,
  );
  const canContinueFromInfo = Boolean(
    isLocationCompatible &&
    (!needsLocationSelection || effectiveLocation) &&
    (!requiresAddress || serviceAddress.trim()) &&
    (!requiresPrescription || prescriptionFileId),
  );
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const confirmedPricing = submission.bookingResult?.pricing ?? null;
  const confirmedServiceItem = submission.bookingResult?.serviceItems?.[0] ?? null;
  const confirmedServiceName =
    confirmedServiceItem?.serviceName ??
    submission.bookingResult?.service?.name ??
    selectedService?.name ??
    selectedService?.id ??
    t.bookingFlow.bookExam;
  const confirmedServicePrice = confirmedServiceItem
    ? formatServicePrice(
        confirmedServiceItem.subtotal,
        confirmedServiceItem.currency ?? confirmedPricing?.currency ?? quoteCurrency,
      )
    : formatServicePrice(servicePrice, currency);
  const confirmedAmount = confirmedPricing
    ? formatServicePrice(confirmedPricing.totalAmount, confirmedPricing.currency ?? quoteCurrency)
    : formatServicePrice(totalPrice, quoteCurrency);
  const confirmedDate = formatDateValue(submission.bookingResult?.startDate) ?? bookingDate;
  const confirmedTime = selectedTimeLabel || bookingTime;

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
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/radiology')}
      />
    );
  }

  const providerDisplayName = getProviderDisplayName(provider);
  const providerLocation = getProviderLocation(provider);
  const providerHeaderData: BookingFlowHeaderData = {
    providerName: providerDisplayName,
    providerImageUrl: getProviderImageUrl(provider),
    rating: {
      average: provider.ratingAverage,
      count: provider.ratingCount,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: t.bookingFlow.bookExam,
    locationLabel: providerLocation,
    subtitle: provider.shortDescription || provider.bio,
  };
  const inputClass =
    'w-full rounded-lg border border-purple-200/70 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm shadow-purple-500/5 transition-colors placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-purple-500/30 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500';
  const effectiveLocationLabel = getEffectiveLocationLabel(effectiveLocation);
  const trimmedServiceAddress = serviceAddress.trim();
  const selectedServiceLabel = selectedService
    ? (selectedService.name ?? selectedService.id)
    : REQUIRED_SUMMARY_PLACEHOLDER;
  const sideSubtotal = formatServicePrice(servicePrice, currency);
  const selectedServiceSummaryRow: NonNullable<BookingFlowSummarySection['items']>[number] =
    selectedService
      ? {
          label: selectedServiceLabel,
          value: sideSubtotal,
          valueTitle: sideSubtotal,
          className: summaryServiceRowClassName,
          valueClassName: summaryServiceValueClassName,
        }
      : {
          label: 'Examen',
          value: REQUIRED_SUMMARY_PLACEHOLDER,
        };
  const bookingSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Examen',
      items: [
        selectedServiceSummaryRow,
        {
          label: 'Description',
          value: selectedService?.shortDescription,
          hidden: !selectedService?.shortDescription,
        },
        {
          label: 'Durée',
          value: selectedService
            ? formatSelectedServicesDuration(selectedServices, 'Durée à confirmer')
            : REQUIRED_SUMMARY_PLACEHOLDER,
          className: 'border-t border-border/70 pt-3',
          valueClassName: 'font-normal text-muted-foreground',
        },
        {
          label: 'Lieu',
          value: effectiveLocationLabel ?? REQUIRED_SUMMARY_PLACEHOLDER,
        },
        {
          label: 'Ordonnance',
          value: selectedService
            ? requiresPrescription
              ? 'Requise'
              : 'Non requise'
            : REQUIRED_SUMMARY_PLACEHOLDER,
        },
      ],
    },
    {
      title: 'Planning',
      items: [
        {
          label: 'Date',
          value: bookingDate || REQUIRED_SUMMARY_PLACEHOLDER,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Heure',
          value: selectedTimeLabel || REQUIRED_SUMMARY_PLACEHOLDER,
        },
      ],
    },
    {
      title: 'Lieu et ordonnance',
      hidden: !requiresInfoStep || (infoStep !== null && currentStep < infoStep),
      items: [
        {
          label: 'Lieu prévu',
          value: effectiveLocationLabel ?? REQUIRED_SUMMARY_PLACEHOLDER,
          hidden: !selectedService,
        },
        {
          label: 'Adresse',
          value: trimmedServiceAddress || REQUIRED_SUMMARY_PLACEHOLDER,
          hidden: !requiresAddress,
        },
        {
          label: 'Document',
          value: prescriptionFileId ? 'Ordonnance téléversée' : REQUIRED_SUMMARY_PLACEHOLDER,
          hidden: !requiresPrescription,
        },
      ],
    },
  ];
  const paymentPricingSection: BookingFlowSummarySection = {
    title: 'Tarification',
    items: quote
      ? [
          {
            label: 'Montant de l’examen',
            value: formatServicePrice(displayedBookingSubtotal, quoteCurrency),
          },
          {
            label: t.bookingFlow.serviceFees,
            value: formatServicePrice(displayedPlatformFee, quoteCurrency),
          },
        ]
      : [],
  };
  const summaryNotice = (
    <div className="flex items-start gap-2">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      <p>{t.bookingFlow.arrivalInstructions}</p>
    </div>
  );
  const bookingSummary =
    currentStep !== paymentStep && currentStep !== successStep ? (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart />}
        className={purpleGlassSummaryClassName}
        iconClassName={purpleSummaryIconClassName}
        sections={bookingSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: sideSubtotal,
          variant: 'line',
          labelClassName: 'text-base font-extrabold uppercase tracking-wide text-foreground',
          valueClassName: 'text-sm font-semibold text-muted-foreground',
        }}
        notice={summaryNotice}
      />
    ) : null;
  const paymentSummary = quote ? (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      icon={<Scan />}
      className={purpleGlassSummaryClassName}
      iconClassName={purpleSummaryIconClassName}
      sections={[...bookingSummarySections, paymentPricingSection]}
      total={{
        label: t.bookingFlow.totalToPay,
        value: formatServicePrice(totalPrice, quoteCurrency),
        valueClassName: bookingCyanTotalClassName,
      }}
      notice={summaryNotice}
    />
  ) : null;

  return (
    <BookingFlowChrome
      header={providerHeaderData}
      currentStep={currentStep}
      stepLabels={stepLabels}
      showProgress={currentStep < successStep}
      className="px-6 py-4 pb-12 text-slate-900 dark:text-white"
      headerClassName="relative overflow-hidden rounded-[16px] p-[2px] shadow-sm"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[14px] bg-white/95 p-4 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="max-w-5xl"
    >
      <BookingFlowBodyLayout summary={bookingSummary}>
        <div className="space-y-3" style={accentVariables}>
          {currentStep === 1 ? (
            <div className="space-y-3">
              <div className={purpleGlassSurfaceClassName}>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.examType}
                </h3>

                {servicesLoading && radiologyServices.length === 0 ? (
                  <BookingOptionListSkeleton items={4} />
                ) : null}

                {servicesError ? (
                  <BookingInlineState
                    tone="danger"
                    title={t.common.loadingError}
                    description={servicesErrorMessage}
                    className="mb-3"
                  />
                ) : null}

                {!servicesLoading && !servicesError && radiologyServices.length === 0 ? (
                  <BookingInlineState tone="muted" title={t.services.noServicesFound} />
                ) : null}

                {!servicesLoading && !servicesError && radiologyServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {radiologyServices.map((service) => {
                      const isSelected = selectedServiceId === service.id;
                      const locationType = getLocationBadgeVariant(service.serviceLocation);

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedServiceId(service.id)}
                          className={`rounded-xl border p-4 text-left transition-colors ${isSelected ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {service.name ?? service.id}
                                </h4>
                                {service.requiresPrescription ? (
                                  <span className={bookingPrescriptionRequiredBadgeClassName}>
                                    <FileText className="h-3 w-3" />
                                    Ordonnance requise
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                {service.shortDescription ?? 'Aucune description fournie.'}
                              </p>
                            </div>
                            <span className="whitespace-nowrap text-sm font-bold text-[color:var(--service-accent-from)]">
                              {formatServicePrice(service.price, service.currency)}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className={bookingDurationBadgeClassName}>
                              <Clock className="h-3 w-3" />
                              <span>{formatServiceDuration(service.durationMinutes)}</span>
                            </div>

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
                              {getLocationLabel(locationType)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {selectedServices.length > 0 && !isLocationCompatible ? (
                  <BookingInlineState
                    tone="warning"
                    title="Lieu incompatible"
                    description="L'examen sélectionné ne peut pas être réservé avec un lieu commun. Choisissez un autre examen pour poursuivre."
                    className="mt-3"
                  />
                ) : null}
              </div>

              <div className={purpleGlassSurfaceClassName}>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {t.bookingFlow.dateAndTime}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.selectDate} *
                    </label>
                    <MonthCalendar
                      year={calendarYear}
                      month={calendarMonth}
                      days={monthDays}
                      selectedDate={bookingDate || null}
                      onSelectDate={setBookingDate}
                      onMonthChange={handleMonthChange}
                      loading={monthLoading}
                      maxDate={calendarMaxDate ?? undefined}
                      disabled={!selectedServiceId}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                      {t.bookingFlow.selectTime} *
                    </label>
                    <DaySlotPicker
                      slots={displaySlots}
                      selectedSlot={bookingTime}
                      onSelectSlot={setBookingTime}
                      loading={availabilityLoading}
                      providerTimezone={providerTimezone}
                      emptyMessage={slotEmptyMessage}
                    />
                  </div>
                </div>

                {availabilityError ? (
                  <div
                    className={`mt-3 p-3 rounded-lg border ${'border-destructive/30 bg-destructive/10'}`}
                  >
                    <p className={`text-xs font-semibold text-destructive`}>
                      {t.bookingFlow.error}
                    </p>
                    <p className={`text-xs mt-1 text-destructive`}>{availabilityErrorMessage}</p>
                  </div>
                ) : null}
              </div>

              <BookingStepActions
                onNext={() => setCurrentStep(infoStep ?? paymentStep)}
                nextDisabled={!canContinueFromDetails}
                nextLabel={requiresInfoStep ? t.bookingFlow.next : t.bookingFlow.continueToPayment}
                nextType="button"
              />
            </div>
          ) : null}

          {requiresInfoStep && currentStep === infoStep ? (
            <div className="space-y-3">
              <div className={purpleGlassSurfaceClassName}>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                  {needsLocationSelection
                    ? t.bookingFlow.chooseServiceLocation
                    : t.bookingFlow.stepInfo}
                </h3>

                <div className="space-y-4">
                  {needsLocationSelection ? (
                    <ServiceLocationToggle
                      selectedLocation={selectedLocation}
                      onLocationChange={setSelectedLocation}
                    />
                  ) : null}

                  <PrescriptionUploadGate
                    required={requiresPrescription}
                    onFileReady={setPrescriptionFileId}
                  />

                  {requiresAddress ? (
                    <BookingNeutralPanel>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                        <div className="w-full space-y-3">
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Ce service d’imagerie peut être réalisé à domicile. Ajoutez l’adresse
                            exacte pour l’intervention avant de passer au paiement.
                          </p>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
                              Adresse de service *
                            </label>
                            <textarea
                              value={serviceAddress}
                              onChange={(event) => {
                                setServiceAddressEdited(true);
                                setServiceAddress(event.target.value);
                              }}
                              rows={3}
                              placeholder="Adresse complète pour la visite radiologique"
                              className={`${inputClass} resize-none`}
                            />
                          </div>
                        </div>
                      </div>
                    </BookingNeutralPanel>
                  ) : null}
                </div>
              </div>

              <BookingStepActions
                backLabel={t.common.back}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(paymentStep)}
                nextDisabled={!canContinueFromInfo}
                nextLabel={t.bookingFlow.continueToPayment}
                nextType="button"
              />
            </div>
          ) : null}

          {currentStep === paymentStep ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setCurrentStep(infoStep ?? 1)}
                className="group inline-flex h-auto items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />{' '}
                {t.common.back}
              </button>

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
                    isSubmitting={submission.isSubmitting}
                    providerName={providerDisplayName}
                    serviceName={selectedServiceName}
                    date={bookingDate}
                    time={selectedTimeLabel}
                    cashAvailable={quote?.cashAvailable ?? true}
                    paymentSummary={paymentSummary}
                  />
                ) : null}
              </BookingQuotePanel>
            </div>
          ) : null}

          {currentStep === successStep ? (
            <BookingSuccessPanel
              bookingNumber={submission.bookingResult?.bookingNumber}
              onGoToDashboard={() => navigate('/patient-dashboard')}
              onViewServices={() => navigate('/radiology')}
            >
              <div
                className={`grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 ${successPurpleGlassCardClassName}`}
              >
                <p>
                  <span className="font-semibold">Examen:</span> {confirmedServiceName}
                </p>
                <p>
                  <span className="font-semibold">Montant:</span>{' '}
                  <span className={bookingCyanTotalClassName}>{confirmedAmount}</span>
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectDate}:</span> {confirmedDate}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectTime}:</span> {confirmedTime}
                </p>
              </div>

              <div className={successPurpleGlassCardClassName}>
                <div className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {confirmedServiceName}
                      </p>
                      {requiresPrescription ? (
                        <span className={bookingPrescriptionRequiredBadgeClassName}>
                          <FileText className="h-3 w-3" />
                          Ordonnance requise
                        </span>
                      ) : null}
                    </div>
                    <div className={bookingDurationBadgeClassName}>
                      <Clock className="h-3 w-3" />
                      {formatServiceDuration(selectedService?.durationMinutes)}
                    </div>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      {selectedService?.shortDescription ?? 'Aucune description fournie.'}
                    </p>
                  </div>
                  <span className="whitespace-nowrap font-semibold text-[color:var(--service-accent-from)]">
                    {confirmedServicePrice}
                  </span>
                </div>
              </div>

              {confirmedPricing ? (
                <div className={successPurpleGlassCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Tarification confirmée
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span>Montant de l’examen</span>
                      <span>
                        {formatServicePrice(
                          confirmedPricing.bookingSubtotal,
                          confirmedPricing.currency ?? currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{t.bookingFlow.serviceFees}</span>
                      <span>
                        {formatServicePrice(
                          confirmedPricing.platformFee,
                          confirmedPricing.currency ?? currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 font-semibold text-slate-900 dark:text-white">
                      <span>{t.bookingFlow.totalToPay}</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.totalAmount,
                          confirmedPricing.currency ?? currency,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {requiresAddress ? (
                <div className={successPurpleGlassCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Adresse de service
                  </p>
                  <p className="mt-2 text-xs">{serviceAddress}</p>
                </div>
              ) : null}
            </BookingSuccessPanel>
          ) : null}
        </div>
      </BookingFlowBodyLayout>
    </BookingFlowChrome>
  );
}
