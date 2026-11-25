import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Building2, Clock, Home, MapPin, ShoppingCart } from 'lucide-react';
import {
  BookingSuccessPanel,
  DaySlotPicker,
  MonthCalendar,
  PaymentStep,
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
import { formatSelectedServicesDuration } from './utils';
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
  bookingProviderLocationBadgeClassName,
} from './BookingFlowUi';
import { logBookingFlowWarning } from './bookingFlowLogger';
import { convertProviderTimeToLocal, getPatientTimezone, isSameTimezone } from '@/utils/timezone';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';
import type { DateOnlyResponse } from '@/shared/schemas/common';

// ============================================
// TYPES / CONSTANTS
// ============================================

type GymLocationBadgeVariant = 'home' | 'clinic' | 'both';

const REQUIRED_FIELD_PLACEHOLDER = '_';

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
): GymLocationBadgeVariant {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'home';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'clinic';
}

function getLocationLabel(locationType: GymLocationBadgeVariant): string {
  if (locationType === 'home') {
    return 'À domicile';
  }

  if (locationType === 'both') {
    return 'Domicile ou salle';
  }

  return 'En salle';
}

function getEffectiveLocationLabel(location: string | null): string {
  if (location === 'home') {
    return 'À domicile';
  }

  if (location === 'provider_site') {
    return 'En salle';
  }

  return REQUIRED_FIELD_PLACEHOLDER;
}

// ============================================
// COMPONENT
// ============================================

export function GymBookingFlow() {
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
    items: gymServicesRaw,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'gym',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('gym');
  const accentVariables = createServiceAccentVariables(accent);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceAddressEdited, setServiceAddressEdited] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);

  const gymServices = useMemo(
    () =>
      gymServicesRaw.filter(
        (service) => typeof service.durationMinutes === 'number' && service.durationMinutes > 0,
      ),
    [gymServicesRaw],
  );

  const filteredOutServiceCount = gymServicesRaw.length - gymServices.length;
  const defaultFailureMessage = t.bookingFlow.bookingErrorGeneric;
  const selectedServices = useMemo(
    () => gymServices.filter((service) => selectedServiceIds.includes(service.id)),
    [gymServices, selectedServiceIds],
  );
  const {
    needsLocationSelection,
    effectiveLocation,
    selectedLocation,
    setSelectedLocation,
    isLocationCompatible,
    requiresAddress,
  } = useServiceLocationChoice(selectedServices);
  const requiresInfoStep = needsLocationSelection || requiresAddress;
  const infoStep = requiresInfoStep ? 2 : null;
  const paymentStep = requiresInfoStep ? 3 : 2;
  const successStep = requiresInfoStep ? 4 : 3;

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

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(successStep),
    onSlotConflict: () => {
      setCurrentStep(1);
      setBookingTime('');
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning('GymBooking quote mismatch detected; refetching authoritative quote.', {
        hasMismatchDetails: Boolean(details),
      });
      void refetchQuote();
    },
  });

  useEffect(() => {
    if (servicesLoading) {
      return;
    }

    setSelectedServiceIds((previous) => {
      const next = previous.filter((serviceId) =>
        gymServices.some((service) => service.id === serviceId),
      );

      return next.length === previous.length ? previous : next;
    });
  }, [gymServices, servicesLoading]);

  useEffect(() => {
    setBookingTime('');
  }, [selectedServiceIds, setBookingTime]);

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
      selectedServices.length === 0 ||
      !isLocationCompatible ||
      (needsLocationSelection && !effectiveLocation) ||
      (requiresAddress && !serviceAddress.trim())
    ) {
      return null;
    }

    return {
      providerId: provider.id,
      serviceItems: selectedServices.map((service) => ({
        serviceId: service.id,
        quantity: 1,
      })),
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
    provider,
    requiresAddress,
    selectedServices,
    serviceAddress,
    serviceAddressEdited,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);

  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const currency = selectedServices[0]?.currency ?? gymServices[0]?.currency ?? 'TND';
  const selectedServicesSubtotal = selectedServices.reduce(
    (subtotal, service) => subtotal + service.price,
    0,
  );
  const displayedBookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const displayedPlatformFee = quote?.pricing.platformFee ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? currency;
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;
  const selectedServiceName =
    selectedServices.length === 1
      ? (selectedServices[0].name ?? selectedServices[0].id)
      : selectedServices.length > 1
        ? `${selectedServices.length} services gym`
        : 'Services gym';

  useEffect(() => {
    if (currentStep !== paymentStep || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('GymBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentStep, paymentStep, quote, quoteError, quoteLoading, quoteRequest]);

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
  const slotEmptyMessage =
    selectedServiceIds.length === 0
      ? 'Sélectionnez un ou plusieurs services gym pour afficher les créneaux disponibles.'
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
    selectedServices.length > 0 &&
    isLocationCompatible &&
    bookingDate &&
    bookingTime &&
    !availabilityLoading &&
    !availabilityError &&
    displaySlots.length > 0,
  );
  const canContinueFromInfo = Boolean(
    isLocationCompatible &&
    (!needsLocationSelection || effectiveLocation) &&
    (!requiresAddress || serviceAddress.trim()),
  );
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const confirmedPricing = submission.bookingResult?.pricing ?? null;
  const confirmedServiceItems = submission.bookingResult?.serviceItems ?? null;
  const confirmedAmount = confirmedPricing
    ? formatServicePrice(confirmedPricing.totalAmount, confirmedPricing.currency ?? quoteCurrency)
    : formatServicePrice(totalPrice, quoteCurrency);
  const confirmedDate = formatDateValue(submission.bookingResult?.startDate) ?? bookingDate;
  const confirmedTime = selectedTimeLabel || bookingTime;

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((previous) =>
      previous.includes(serviceId)
        ? previous.filter((id) => id !== serviceId)
        : [...previous, serviceId],
    );
  };

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
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/gym')}
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
    bookingTypeLabel: 'Services gym',
    locationLabel: providerLocation,
    subtitle: provider.shortDescription || provider.bio,
  };
  const inputClass =
    'w-full rounded-lg border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm shadow-amber-500/5 backdrop-blur-sm transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-amber-400 dark:focus:ring-amber-400/20';
  const amberGlassSurfaceClassName = bookingNeutralPanelClassName;
  const sectionHeadingClassName = 'mb-3 text-sm font-bold text-slate-900 dark:text-white';
  const fieldLabelClassName = 'mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white';
  const amberSummaryIconClassName = 'bg-transparent text-amber-500 dark:text-amber-400';
  const successCardClassName = bookingNeutralSuccessCardClassName;
  const selectedServicesDurationSummary =
    formatSelectedServicesDuration(selectedServices, 'Durée à confirmer') ?? '';
  const selectedServicesLocationSummary =
    selectedServices.length === 0
      ? ''
      : !isLocationCompatible
        ? 'Services incompatibles'
        : getEffectiveLocationLabel(effectiveLocation);
  const serviceMetadataDividerClassName =
    selectedServices.length > 0 ? 'border-t border-border/70 pt-2' : undefined;
  const serviceSummaryItems =
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
            label: 'Services',
            value: REQUIRED_FIELD_PLACEHOLDER,
          },
        ];
  const serviceMetadataSummaryItems: NonNullable<BookingFlowSummarySection['items']> = [
    {
      label: 'Durée',
      value: selectedServicesDurationSummary,
      valueTitle: selectedServicesDurationSummary,
      className: serviceMetadataDividerClassName,
      valueClassName: 'font-normal text-muted-foreground',
      hidden: selectedServices.length === 0 || !selectedServicesDurationSummary,
    },
    {
      label: 'Lieu',
      value: selectedServicesLocationSummary,
      valueTitle: selectedServicesLocationSummary,
      className: selectedServicesDurationSummary ? undefined : serviceMetadataDividerClassName,
      valueClassName: 'font-normal text-muted-foreground',
      hidden: selectedServices.length === 0 || !selectedServicesLocationSummary,
    },
  ];
  const locationSummaryItems = [
    selectedServices.length > 0
      ? {
          label: 'Lieu de prestation',
          value: getEffectiveLocationLabel(effectiveLocation),
        }
      : null,
    requiresAddress
      ? {
          label: 'Adresse de service',
          value: serviceAddress.trim() || REQUIRED_FIELD_PLACEHOLDER,
        }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const serviceSummarySection: BookingFlowSummarySection = {
    title: 'Services',
    items: [...serviceSummaryItems, ...serviceMetadataSummaryItems],
  };
  const planningSummarySection: BookingFlowSummarySection = {
    title: 'Planning',
    items: [
      {
        label: 'Date',
        value: bookingDate || REQUIRED_FIELD_PLACEHOLDER,
        valueClassName: 'whitespace-nowrap text-right',
      },
      {
        label: 'Heure',
        value: selectedTimeLabel || REQUIRED_FIELD_PLACEHOLDER,
        valueClassName: 'whitespace-nowrap text-right',
      },
    ],
  };
  const locationDetailsSummarySection: BookingFlowSummarySection = {
    title: 'Lieu et détails',
    hidden: locationSummaryItems.length === 0,
    items: locationSummaryItems,
  };
  const sideSummarySections: BookingFlowSummarySection[] = [
    serviceSummarySection,
    planningSummarySection,
    {
      ...locationDetailsSummarySection,
      hidden: currentStep !== infoStep || locationSummaryItems.length === 0,
    },
  ];
  const paymentSummarySections: BookingFlowSummarySection[] = [
    serviceSummarySection,
    planningSummarySection,
    locationDetailsSummarySection,
  ];
  const paymentPricingSection: BookingFlowSummarySection = {
    title: 'Tarification',
    items: [
      {
        label: 'Montant des services',
        value: formatServicePrice(displayedBookingSubtotal, quoteCurrency),
      },
      {
        label: t.bookingFlow.serviceFees,
        value: formatServicePrice(displayedPlatformFee, quoteCurrency),
      },
    ],
  };
  const bookingSummary =
    currentStep !== paymentStep && currentStep !== successStep ? (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart aria-hidden="true" />}
        className={amberGlassSurfaceClassName}
        iconClassName={amberSummaryIconClassName}
        sections={sideSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: formatServicePrice(selectedServicesSubtotal, currency),
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
      className={amberGlassSurfaceClassName}
      iconClassName={amberSummaryIconClassName}
      sections={[...paymentSummarySections, paymentPricingSection]}
      total={{
        label: t.bookingFlow.totalToPay,
        value: formatServicePrice(totalPrice, quoteCurrency),
        valueClassName: bookingCyanTotalClassName,
      }}
    />
  ) : null;

  return (
    <BookingFlowChrome
      header={providerHeaderData}
      currentStep={currentStep}
      stepLabels={stepLabels}
      showProgress={currentStep < successStep}
      className="px-6 py-4 pb-12 text-slate-900 dark:text-white"
      headerClassName="relative overflow-hidden rounded-[20px] p-[2px] shadow-xl"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[18px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="max-w-5xl"
    >
      <BookingFlowBodyLayout summary={bookingSummary}>
        <div className="space-y-3" style={accentVariables}>
          {currentStep === 1 ? (
            <div className="space-y-3">
              <div className={amberGlassSurfaceClassName}>
                <h2 className={sectionHeadingClassName}>Services gym disponibles</h2>

                {filteredOutServiceCount > 0 ? (
                  <div className="mb-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 shadow-sm shadow-amber-500/10 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                      <p className="text-xs text-amber-800 dark:text-amber-100">
                        Certains services publiés ne peuvent pas être réservés en ligne faute de
                        durée planifiable et sont masqués des choix disponibles.
                      </p>
                    </div>
                  </div>
                ) : null}

                {servicesLoading && gymServices.length === 0 ? (
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

                {!servicesLoading && !servicesError && gymServices.length === 0 ? (
                  <BookingInlineState tone="muted" title={t.services.noServicesFound} />
                ) : null}

                {!servicesLoading && !servicesError && gymServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gymServices.map((service) => {
                      const isSelected = selectedServiceIds.includes(service.id);
                      const locationType = getLocationBadgeVariant(service.serviceLocation);

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`rounded-xl border p-4 text-left transition-colors ${
                            isSelected
                              ? bookingAccentSelectedOptionClassName
                              : bookingAccentInactiveOptionClassName
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {service.name ?? service.id}
                              </h3>
                              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
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
                    title="Services incompatibles"
                    description="Les services sélectionnés ne partagent aucun lieu de prestation. Modifiez votre sélection pour poursuivre la réservation."
                    className="mt-3"
                  />
                ) : null}
              </div>

              <div className={amberGlassSurfaceClassName}>
                <h2 className={sectionHeadingClassName}>{t.bookingFlow.dateAndTime}</h2>

                <div className="space-y-4">
                  <div>
                    <label className={fieldLabelClassName}>{t.bookingFlow.selectDate} *</label>
                    <MonthCalendar
                      year={calendarYear}
                      month={calendarMonth}
                      days={monthDays}
                      selectedDate={bookingDate || null}
                      onSelectDate={setBookingDate}
                      onMonthChange={handleMonthChange}
                      loading={monthLoading}
                      maxDate={calendarMaxDate ?? undefined}
                      disabled={servicesLoading || selectedServiceIds.length === 0}
                    />
                  </div>

                  <div>
                    <label className={fieldLabelClassName}>{t.bookingFlow.selectTime} *</label>
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
              <div className={amberGlassSurfaceClassName}>
                <h2 className={sectionHeadingClassName}>
                  {needsLocationSelection
                    ? t.bookingFlow.chooseServiceLocation
                    : t.bookingFlow.stepInfo}
                </h2>

                <div className="space-y-4">
                  {needsLocationSelection ? (
                    <ServiceLocationToggle
                      selectedLocation={selectedLocation}
                      onLocationChange={setSelectedLocation}
                    />
                  ) : null}

                  {requiresAddress ? (
                    <div className={bookingNeutralPanelClassName}>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                        <div className="w-full space-y-3">
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Au moins un service sélectionné peut être réalisé à domicile. Ajoutez
                            l'adresse exacte avant de passer au paiement.
                          </p>
                          <div>
                            <label className={fieldLabelClassName}>Adresse de service *</label>
                            <textarea
                              value={serviceAddress}
                              onChange={(event) => {
                                setServiceAddressEdited(true);
                                setServiceAddress(event.target.value);
                              }}
                              rows={3}
                              placeholder="Adresse complète pour la prestation gym à domicile"
                              className={`${inputClass} resize-none`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                    paymentSummary={paymentSummary}
                    isSubmitting={submission.isSubmitting}
                    providerName={providerDisplayName}
                    serviceName={selectedServiceName}
                    date={bookingDate}
                    time={selectedTimeLabel}
                    cashAvailable={quote?.cashAvailable ?? true}
                  />
                ) : null}
              </BookingQuotePanel>
            </div>
          ) : null}

          {currentStep === successStep ? (
            <BookingSuccessPanel
              bookingNumber={submission.bookingResult?.bookingNumber}
              onGoToDashboard={() => navigate('/patient-dashboard')}
              onViewServices={() => navigate('/gym')}
            >
              <div
                className={`grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 ${successCardClassName}`}
              >
                <p>
                  <span className="font-semibold">Services:</span>{' '}
                  {confirmedServiceItems?.length ?? selectedServices.length}
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

              <div className={successCardClassName}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Services confirmés
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  {confirmedServiceItems && confirmedServiceItems.length > 0
                    ? confirmedServiceItems.map((serviceItem) => (
                        <div
                          key={serviceItem.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold">
                              {serviceItem.serviceName ?? serviceItem.serviceId}
                            </p>
                            <p>Quantité confirmée: {serviceItem.quantity}</p>
                          </div>
                          <span className="whitespace-nowrap font-semibold text-[color:var(--service-accent-from)]">
                            {formatServicePrice(
                              serviceItem.subtotal,
                              serviceItem.currency ?? confirmedPricing?.currency ?? currency,
                            )}
                          </span>
                        </div>
                      ))
                    : selectedServices.map((service) => (
                        <div key={service.id} className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{service.name ?? service.id}</p>
                            <p>{service.shortDescription ?? 'Aucune description fournie.'}</p>
                          </div>
                          <span className="whitespace-nowrap font-semibold text-[color:var(--service-accent-from)]">
                            {formatServicePrice(service.price, service.currency)}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {confirmedPricing ? (
                <div className={successCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Tarification confirmée
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span>Montant des services</span>
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
                    <div
                      className={`flex items-center justify-between gap-3 font-semibold ${bookingCyanTotalClassName}`}
                    >
                      <span>{t.bookingFlow.totalToPay}</span>
                      <span>
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
                <div className={successCardClassName}>
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
