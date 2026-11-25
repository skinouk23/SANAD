import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, Clock, Home, MapPin, Shield, ShoppingCart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookingSuccessPanel,
  DaySlotPicker,
  MonthCalendar,
  ServiceLocationToggle,
  PaymentStep,
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
  BookingSurface,
  bookingAccentInactiveOptionClassName,
  bookingAccentSelectedOptionClassName,
  bookingBothLocationBadgeClassName,
  bookingCyanTotalClassName,
  bookingDurationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingProviderLocationBadgeClassName,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
  useBookingAvailabilityPresentation,
  useCareStyleStepConfig,
} from './internal';
import { logBookingFlowWarning } from './bookingFlowLogger';
import {
  formatDailyStartTime,
  formatDateValue,
  formatSelectedServicesDuration,
  formatServiceDuration,
  formatServicePrice,
  getServiceLocationBadgeVariant,
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
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';
import type { BookingQuoteRequest } from '@/features/bookings/schema';

export function LaboratoryBookingFlow() {
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
    items: labServices,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'laboratory',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('laboratory');
  const accentVariables = createServiceAccentVariables(accent);

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceAddressEdited, setServiceAddressEdited] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

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

  const selectedServices = useMemo(
    () => labServices.filter((service) => selectedServiceIds.includes(service.id)),
    [labServices, selectedServiceIds],
  );
  const {
    needsLocationSelection,
    effectiveLocation,
    selectedLocation,
    setSelectedLocation,
    isLocationCompatible,
    requiresAddress,
  } = useServiceLocationChoice(selectedServices);
  const { infoStep, locationStep, paymentStep, stepLabels, successStep } = useCareStyleStepConfig(
    t,
    needsLocationSelection,
  );

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(successStep),
    onSlotConflict: () => {
      setCurrentStep(1);
      setBookingTime('');
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'LaboratoryBooking quote mismatch detected; refetching authoritative quote.',
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

    setSelectedServiceIds((previous) => {
      const next = previous.filter((serviceId) =>
        labServices.some((service) => service.id === serviceId),
      );
      return next.length === previous.length ? previous : next;
    });
  }, [labServices, servicesLoading]);

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
      patientNotes: specialInstructions.trim() || undefined,
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
    specialInstructions,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);

  useEffect(() => {
    if (currentStep !== paymentStep || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('LaboratoryBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentStep, paymentStep, quote, quoteError, quoteLoading, quoteRequest]);

  const { displaySlots, monthDays } = useBookingAvailabilityPresentation({
    bookingDate,
    availableStartTimes,
    monthAvailabilityDays,
    providerTimezone,
  });

  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const currency = selectedServices[0]?.currency ?? labServices[0]?.currency ?? 'TND';
  const selectedServicesSubtotal = selectedServices.reduce(
    (subtotal, service) => subtotal + service.price,
    0,
  );
  const displayedBookingSubtotal = quote?.pricing.bookingSubtotal ?? 0;
  const displayedPlatformFee = quote?.pricing.platformFee ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? currency;
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const selectedServiceName =
    selectedServices.length === 1
      ? (selectedServices[0].name ?? selectedServices[0].id)
      : selectedServices.length > 1
        ? `${selectedServices.length} analyses de laboratoire`
        : t.bookingFlow.bookAnalyses;
  const selectedTimeLabel =
    displaySlots.find((slot) => slot.value === bookingTime)?.label ?? bookingTime;
  const slotEmptyMessage = bookingDate
    ? t.bookingFlow.calendarNoAvailability
    : t.bookingFlow.calendarSelectDay;
  const canContinueToInfo = Boolean(
    selectedServiceIds.length > 0 &&
    isLocationCompatible &&
    bookingDate &&
    bookingTime &&
    !availabilityLoading &&
    !availabilityError &&
    displaySlots.length > 0,
  );
  const canContinueToPayment = Boolean(
    isLocationCompatible &&
    (!needsLocationSelection || effectiveLocation) &&
    (!requiresAddress || serviceAddress.trim()),
  );
  const confirmedPricing = submission.bookingResult?.pricing ?? null;
  const confirmedServiceItems = submission.bookingResult?.serviceItems ?? [];
  const confirmedCurrency = confirmedPricing?.currency ?? quoteCurrency;
  const confirmedAmount = confirmedPricing
    ? formatServicePrice(confirmedPricing.totalAmount, confirmedCurrency)
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
    return <BookingPageLoader />;
  }

  if (providerError || !provider) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/laboratory')}
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
    bookingTypeLabel: t.bookingFlow.bookAnalyses,
    locationLabel: providerLocation,
    subtitle: provider.shortDescription || provider.bio,
  };
  const inputClass =
    'w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
  const requiredSummaryPlaceholder = '_';
  const selectedServiceSummaryItems: NonNullable<BookingFlowSummarySection['items']> =
    selectedServices.length > 0
      ? selectedServices.map((service) => {
          const servicePrice = formatServicePrice(service.price, service.currency);

          return {
            label: service.name ?? service.id,
            value: servicePrice,
            valueTitle: servicePrice,
            className: summaryServiceRowClassName,
            valueClassName: summaryServiceValueClassName,
          };
        })
      : [
          {
            label: 'Analyses',
            value: requiredSummaryPlaceholder,
            valueTitle: requiredSummaryPlaceholder,
          },
        ];
  const selectedServicesDurationSummary =
    selectedServices.length > 0
      ? (formatSelectedServicesDuration(selectedServices, 'Durée à confirmer') ?? undefined)
      : undefined;
  const serviceSummaryItems: NonNullable<BookingFlowSummarySection['items']> = [
    ...selectedServiceSummaryItems,
    {
      label: 'Durée',
      value: selectedServicesDurationSummary,
      valueTitle: selectedServicesDurationSummary,
      className: 'border-t border-border/70 pt-2',
      valueClassName: 'font-normal',
      hidden: !selectedServicesDurationSummary,
    },
  ];
  const serviceLocationSummary =
    selectedServices.length === 0
      ? null
      : !isLocationCompatible
        ? 'Services incompatibles'
        : effectiveLocation === 'home'
          ? 'À domicile'
          : effectiveLocation === 'provider_site'
            ? 'Au laboratoire'
            : requiredSummaryPlaceholder;
  const trimmedServiceAddress = serviceAddress.trim();
  const trimmedSpecialInstructions = specialInstructions.trim();
  const showLocationSummarySection =
    selectedServices.length > 0 && (locationStep === null || currentStep >= locationStep);
  const showDetailsSummarySection = currentStep >= infoStep;
  const sideSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Services',
      items: serviceSummaryItems,
    },
    {
      title: 'Planification',
      items: [
        {
          label: 'Date',
          value: bookingDate || requiredSummaryPlaceholder,
          valueClassName: 'whitespace-nowrap text-right',
        },
        {
          label: 'Heure',
          value: selectedTimeLabel || requiredSummaryPlaceholder,
          valueClassName: 'whitespace-nowrap text-right',
        },
      ],
    },
    {
      title: 'Lieu',
      hidden: !showLocationSummarySection,
      items: [
        {
          label: 'Lieu',
          value: serviceLocationSummary ?? undefined,
          hidden: !serviceLocationSummary,
        },
      ],
    },
    {
      title: 'Détails',
      hidden: !showDetailsSummarySection,
      items: [
        {
          label: 'Adresse',
          value: requiresAddress ? trimmedServiceAddress || requiredSummaryPlaceholder : undefined,
          valueTitle: requiresAddress
            ? trimmedServiceAddress || requiredSummaryPlaceholder
            : undefined,
          hidden: !requiresAddress,
        },
        {
          label: 'Instructions',
          value: trimmedSpecialInstructions || undefined,
          valueTitle: trimmedSpecialInstructions || undefined,
          hidden: !trimmedSpecialInstructions,
        },
      ],
    },
  ];
  const paymentSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Services',
      items: serviceSummaryItems,
    },
    ...sideSummarySections.slice(1),
  ];
  const paymentPricingSection: BookingFlowSummarySection = {
    title: 'Tarification',
    items: quote
      ? [
          {
            label: 'Montant des analyses',
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
      <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
      <p>{t.bookingFlow.resultsSecureMessage}</p>
    </div>
  );
  const bookingSummary =
    currentStep !== paymentStep && currentStep !== successStep ? (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart aria-hidden="true" />}
        iconClassName="bg-transparent"
        sections={sideSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: formatServicePrice(selectedServicesSubtotal, currency),
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
      icon={<ShoppingCart aria-hidden="true" />}
      sections={[...paymentSummarySections, paymentPricingSection]}
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
      <BookingFlowBodyLayout summary={bookingSummary} mainClassName="space-y-4">
        <div className="space-y-4" style={accentVariables}>
          {currentStep === 1 ? (
            <div className="space-y-4">
              <BookingSurface>
                <h2 className="mb-4 text-sm font-bold text-foreground">Analyses disponibles</h2>

                {servicesLoading && labServices.length === 0 ? (
                  <BookingOptionListSkeleton items={4} />
                ) : null}

                {!servicesLoading && servicesError ? (
                  <BookingInlineState
                    tone="danger"
                    title={t.common.loadingError}
                    description={servicesErrorMessage}
                  />
                ) : null}

                {!servicesLoading && !servicesError && labServices.length === 0 ? (
                  <BookingInlineState tone="muted" title={t.services.noServicesFound} />
                ) : null}

                {!servicesLoading && !servicesError && labServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {labServices.map((service) => {
                      const isSelected = selectedServiceIds.includes(service.id);
                      const locationType = getServiceLocationBadgeVariant(service.serviceLocation);
                      const durationLabel =
                        formatServiceDuration(service.durationMinutes, 'Durée à confirmer') ??
                        'Durée à confirmer';

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            'rounded-xl border p-4 text-left transition-colors',
                            isSelected
                              ? bookingAccentSelectedOptionClassName
                              : bookingAccentInactiveOptionClassName,
                          )}
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
                            <span className={bookingDurationBadgeClassName}>
                              <Clock className="h-3 w-3" />
                              <span>{durationLabel}</span>
                            </span>

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
                                <Home className="h-3 w-3 text-muted-foreground" />
                              ) : locationType === 'both' ? (
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                              )}
                              {locationType === 'home'
                                ? 'À domicile'
                                : locationType === 'both'
                                  ? 'Domicile ou laboratoire'
                                  : 'Au laboratoire'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {selectedServices.length > 0 && !isLocationCompatible ? (
                  <BookingInlineState
                    className="mt-4"
                    tone="warning"
                    title="Services incompatibles"
                    description="Selectionnez uniquement des analyses qui peuvent etre realisees au meme lieu."
                  />
                ) : null}
              </BookingSurface>

              <BookingSurface>
                <h2 className="mb-4 text-sm font-bold text-foreground">
                  {t.bookingFlow.dateAndTime}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
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
                      disabled={selectedServiceIds.length === 0}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
                      {t.bookingFlow.selectTime} *
                    </label>
                    <DaySlotPicker
                      slots={displaySlots}
                      selectedSlot={bookingTime}
                      onSelectSlot={setBookingTime}
                      loading={availabilityLoading}
                      providerTimezone={providerTimezone ?? undefined}
                      emptyMessage={slotEmptyMessage}
                    />
                  </div>
                </div>

                {availabilityError ? (
                  <BookingInlineState
                    className="mt-4"
                    tone="danger"
                    title={t.bookingFlow.error}
                    description={availabilityErrorMessage ?? undefined}
                  />
                ) : null}

                <BookingStepActions
                  onNext={() => setCurrentStep(locationStep ?? infoStep)}
                  nextDisabled={!canContinueToInfo}
                  nextLabel={t.bookingFlow.next}
                  nextType="button"
                />
              </BookingSurface>
            </div>
          ) : null}

          {needsLocationSelection && currentStep === locationStep ? (
            <div className="space-y-4">
              <BookingSurface>
                <ServiceLocationToggle
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                />
              </BookingSurface>

              <BookingStepActions
                backLabel={t.common.back}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(infoStep)}
                nextDisabled={!isLocationCompatible || !effectiveLocation}
                nextLabel={t.bookingFlow.next}
                nextType="button"
              />
            </div>
          ) : null}

          {currentStep === infoStep ? (
            <div className="space-y-4">
              <BookingSurface>
                <h2 className="mb-4 text-sm font-bold text-foreground">{t.bookingFlow.stepInfo}</h2>

                {requiresAddress ? (
                  <BookingInlineState
                    tone="info"
                    title="Adresse requise"
                    description="Au moins une analyse selectionnee peut etre realisee a domicile. Ajoutez une adresse pour finaliser la reservation."
                    className="mb-4"
                  />
                ) : (
                  <BookingInlineState
                    tone="muted"
                    title="Aucune adresse necessaire"
                    description="Les analyses selectionnees ne necessitent pas d'adresse de deplacement."
                    className="mb-4"
                  />
                )}

                <div className="space-y-4">
                  {requiresAddress ? (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-foreground">
                        Adresse de prelevement *
                      </label>
                      <textarea
                        value={serviceAddress}
                        onChange={(event) => {
                          setServiceAddressEdited(true);
                          setServiceAddress(event.target.value);
                        }}
                        rows={3}
                        placeholder="Adresse complete pour la visite ou le prelevement"
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
                      Instructions complementaires
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(event) => setSpecialInstructions(event.target.value)}
                      rows={4}
                      placeholder="Informations utiles pour le prestataire : antecedents, consignes, disponibilite, etc."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </BookingSurface>

              <BookingStepActions
                backLabel={t.common.back}
                onBack={() => setCurrentStep(locationStep ?? 1)}
                onNext={() => setCurrentStep(paymentStep)}
                nextDisabled={!canContinueToPayment}
                nextLabel={t.bookingFlow.continueToPayment}
                nextType="button"
              />
            </div>
          ) : null}

          {currentStep === paymentStep ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(infoStep)}
                className="group inline-flex h-auto items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                {t.common.back}
              </Button>

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
              onViewServices={() => navigate('/laboratory')}
            >
              <div className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-left text-xs text-muted-foreground sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-foreground">Analyses:</span>{' '}
                  {selectedServices.length}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Montant:</span> {confirmedAmount}
                </p>
                <p>
                  <span className="font-semibold text-foreground">{t.bookingFlow.selectDate}:</span>{' '}
                  {confirmedDate}
                </p>
                <p>
                  <span className="font-semibold text-foreground">{t.bookingFlow.selectTime}:</span>{' '}
                  {confirmedTime}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-left text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Analyses confirmees</p>
                <div className="mt-3 space-y-2">
                  {confirmedServiceItems.length > 0
                    ? confirmedServiceItems.map((serviceItem) => (
                        <div
                          key={serviceItem.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold text-foreground">
                              {serviceItem.serviceName ?? serviceItem.serviceId}
                            </p>
                            <p>Quantite: {serviceItem.quantity}</p>
                          </div>
                          <span className="whitespace-nowrap font-semibold text-[color:var(--service-accent-from)]">
                            {formatServicePrice(
                              serviceItem.subtotal,
                              serviceItem.currency ?? confirmedCurrency,
                            )}
                          </span>
                        </div>
                      ))
                    : selectedServices.map((service) => (
                        <div key={service.id} className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              {service.name ?? service.id}
                            </p>
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
                <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-left text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Tarification confirmee</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span>Montant des analyses</span>
                      <span>
                        {formatServicePrice(
                          confirmedPricing.bookingSubtotal,
                          confirmedPricing.currency ?? confirmedCurrency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{t.bookingFlow.serviceFees}</span>
                      <span>
                        {formatServicePrice(
                          confirmedPricing.platformFee,
                          confirmedPricing.currency ?? confirmedCurrency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 font-semibold text-foreground">
                      <span>{t.bookingFlow.totalToPay}</span>
                      <span>
                        {formatServicePrice(
                          confirmedPricing.totalAmount,
                          confirmedPricing.currency ?? confirmedCurrency,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {requiresAddress || specialInstructions.trim() ? (
                <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-left text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Informations complementaires</p>
                  <div className="mt-3 space-y-2">
                    {requiresAddress ? (
                      <p>
                        <span className="font-semibold text-foreground">Adresse:</span>{' '}
                        {serviceAddress}
                      </p>
                    ) : null}
                    {specialInstructions.trim() ? (
                      <p>
                        <span className="font-semibold text-foreground">Notes:</span>{' '}
                        {specialInstructions.trim()}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </BookingSuccessPanel>
          ) : null}
        </div>
      </BookingFlowBodyLayout>
    </BookingFlowChrome>
  );
}
