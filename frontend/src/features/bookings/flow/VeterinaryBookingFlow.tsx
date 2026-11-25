import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  BadgePlus,
  Bird,
  Building2,
  Cat,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  PawPrint,
  Rabbit,
  ShoppingCart,
  Turtle,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  BookingSuccessPanel,
  DaySlotPicker,
  MonthCalendar,
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
import { useVeterinaryAnimalTypes } from '@/features/veterinary/hooks';
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
  bookingBothLocationBadgeClassName,
  bookingCyanPaymentOptionSelectedBaseClassName,
  bookingCyanTotalClassName,
  bookingDurationBadgeClassName,
  bookingHomeLocationBadgeClassName,
  bookingMetadataBadgeClassName,
  bookingNeutralPaymentOptionClassName,
  bookingNeutralPanelClassName,
  bookingNeutralSuccessCardClassName,
  bookingNeutralSurfaceClassName,
  bookingProviderLocationBadgeClassName,
  summaryServiceRowClassName,
  summaryServiceValueClassName,
} from './internal';
import { logBookingFlowWarning } from './bookingFlowLogger';
import { formatSelectedServicesDuration } from './utils';
import { convertProviderTimeToLocal, getPatientTimezone, isSameTimezone } from '@/utils/timezone';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Field, FieldLabel } from '@/shared/ui/primitives/field';
import type { BookingQuoteRequest } from '@/features/bookings/schema';
import type { PatientServiceItemResponse } from '@/features/services/schema';
import type { DateOnlyResponse } from '@/shared/schemas/common';

// ============================================
// TYPES / CONSTANTS
// ============================================

type VeterinaryServiceLocation = 'home' | 'clinic' | 'both';
type VeterinaryBookingLocation = Exclude<VeterinaryServiceLocation, 'both'>;
interface AnimalInfoState {
  type: string;
  name: string;
  age: string;
  weight: string;
  breed: string;
  sterilized: boolean;
  vaccinated: boolean;
}

interface VeterinaryDetailsState {
  notes: string;
  aggressive: boolean;
  hasMedicalRecord: boolean;
}

interface AnimalTypeOption {
  id: string;
  label: string;
  icon: AnimalTypeIcon;
}

type AnimalTypeIcon =
  | {
      kind: 'lucide';
      Icon: LucideIcon;
    }
  | {
      kind: 'emoji';
      value: string;
    };

interface VeterinaryTypeConfig {
  animalType: string;
  animalName: string;
  animalBreed?: string;
  animalAge?: string;
  animalWeight?: string;
  isSterilized: boolean;
  isVaccinated: boolean;
  isAggressive: boolean;
  hasMedicalRecord: boolean;
  notes?: string;
}

const SUMMARY_REQUIRED_PLACEHOLDER = '_';

const veterinaryAnimalIconMap: Partial<Record<string, LucideIcon>> = {
  'badge-plus': BadgePlus,
  bird: Bird,
  cat: Cat,
  'paw-print': PawPrint,
  rabbit: Rabbit,
  turtle: Turtle,
};

const fallbackAnimalTypeIconMap: Partial<Record<string, LucideIcon>> = {
  bird: Bird,
  cat: Cat,
  dog: PawPrint,
  horse: BadgePlus,
  nac: Rabbit,
  reptile: Turtle,
};

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

function formatLocationLabel(location: VeterinaryBookingLocation | null): string {
  if (!location) {
    return SUMMARY_REQUIRED_PLACEHOLDER;
  }

  return location === 'home' ? 'À domicile' : 'En clinique';
}

function normalizeServiceLocation(
  serviceLocation: PatientServiceItemResponse['serviceLocation'],
): VeterinaryServiceLocation {
  const normalized = serviceLocation?.trim().toLowerCase();

  if (normalized === 'home' || normalized === 'domicile') {
    return 'home';
  }

  if (normalized === 'both') {
    return 'both';
  }

  return 'clinic';
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

function getServiceLocationLabel(locationType: VeterinaryServiceLocation): string {
  if (locationType === 'home') {
    return 'À domicile';
  }

  if (locationType === 'both') {
    return 'Clinique ou domicile';
  }

  return 'En clinique';
}

function getVeterinaryServiceAnimalTypes(
  typeConfig: PatientServiceItemResponse['typeConfig'],
): string[] {
  if (!typeConfig || typeof typeConfig !== 'object' || Array.isArray(typeConfig)) {
    return [];
  }

  const animalTypes = (typeConfig as Record<string, unknown>).animalTypes;
  if (!Array.isArray(animalTypes)) {
    return [];
  }

  return animalTypes.reduce<string[]>((codes, value) => {
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

function resolveAnimalTypeIcon(icon: string | null | undefined, code: string): AnimalTypeIcon {
  const normalizedIcon = icon?.trim().toLowerCase().replace(/_/g, '-');

  if (normalizedIcon) {
    const Icon = veterinaryAnimalIconMap[normalizedIcon];

    if (Icon) {
      return { kind: 'lucide', Icon };
    }

    if (!/^[a-z0-9-]+$/i.test(normalizedIcon)) {
      return { kind: 'emoji', value: normalizedIcon };
    }
  }

  return {
    kind: 'lucide',
    Icon: fallbackAnimalTypeIconMap[code] ?? PawPrint,
  };
}

// ============================================
// COMPONENT
// ============================================

export function VeterinaryBookingFlow() {
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
    items: veterinaryServicesRaw,
    loading: servicesLoading,
    error: servicesError,
  } = useServiceCatalog({
    category: 'veterinary',
    providerId,
    limit: 50,
  });
  const { accent, styles } = useServiceAccent('veterinary');
  const accentVariables = createServiceAccentVariables(accent);
  const {
    data: lookupAnimalTypes,
    loading: animalTypesLoading,
    error: animalTypesError,
    refetch: refetchAnimalTypes,
  } = useVeterinaryAnimalTypes();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<VeterinaryBookingLocation | null>(null);
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceAddressEdited, setServiceAddressEdited] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [animalInfo, setAnimalInfo] = useState<AnimalInfoState>({
    type: '',
    name: '',
    age: '',
    weight: '',
    breed: '',
    sterilized: false,
    vaccinated: false,
  });
  const [details, setDetails] = useState<VeterinaryDetailsState>({
    notes: '',
    aggressive: false,
    hasMedicalRecord: false,
  });

  const veterinaryServices = useMemo(
    () =>
      veterinaryServicesRaw.filter(
        (service) => typeof service.durationMinutes === 'number' && service.durationMinutes > 0,
      ),
    [veterinaryServicesRaw],
  );
  const animalTypeOptions = useMemo(
    () =>
      (lookupAnimalTypes ?? []).reduce<AnimalTypeOption[]>((options, animalType) => {
        const normalizedCode = animalType.code.trim().toLowerCase();
        if (!normalizedCode || options.some((option) => option.id === normalizedCode)) {
          return options;
        }

        options.push({
          id: normalizedCode,
          label: animalType.label,
          icon: resolveAnimalTypeIcon(animalType.icon, normalizedCode),
        });
        return options;
      }, []),
    [lookupAnimalTypes],
  );

  const filteredOutServiceCount = veterinaryServicesRaw.length - veterinaryServices.length;
  const defaultFailureMessage = t.bookingFlow.bookingErrorGeneric;

  const selectedServiceItems = useMemo(
    () => veterinaryServices.filter((service) => selectedServiceIds.includes(service.id)),
    [selectedServiceIds, veterinaryServices],
  );
  const selectedServiceSupportedAnimalTypes = useMemo(() => {
    const serviceRestrictions = selectedServiceItems
      .map((service) => getVeterinaryServiceAnimalTypes(service.typeConfig))
      .filter((animalTypes) => animalTypes.length > 0);

    if (serviceRestrictions.length === 0) {
      return null;
    }

    return serviceRestrictions.reduce<string[]>(
      (allowedAnimalTypes, currentAnimalTypes) => {
        const currentAnimalTypeSet = new Set(currentAnimalTypes);
        return allowedAnimalTypes.filter((animalType) => currentAnimalTypeSet.has(animalType));
      },
      [...serviceRestrictions[0]],
    );
  }, [selectedServiceItems]);
  const availableAnimalTypeOptions = useMemo(() => {
    if (!selectedServiceSupportedAnimalTypes || selectedServiceSupportedAnimalTypes.length === 0) {
      return animalTypeOptions;
    }

    const allowedAnimalTypeSet = new Set(selectedServiceSupportedAnimalTypes);
    return animalTypeOptions.filter((animalType) => allowedAnimalTypeSet.has(animalType.id));
  }, [animalTypeOptions, selectedServiceSupportedAnimalTypes]);

  const locationCapabilities = useMemo(() => {
    if (selectedServiceItems.length === 0) {
      return {
        allowsClinic: false,
        allowsHome: false,
      };
    }

    return selectedServiceItems.reduce(
      (capabilities, service) => {
        const locationType = normalizeServiceLocation(service.serviceLocation);

        return {
          allowsClinic: capabilities.allowsClinic && locationType !== 'home',
          allowsHome: capabilities.allowsHome && locationType !== 'clinic',
        };
      },
      {
        allowsClinic: true,
        allowsHome: true,
      },
    );
  }, [selectedServiceItems]);

  const canBookInClinic = locationCapabilities.allowsClinic;
  const canBookAtHome = locationCapabilities.allowsHome;
  const isLocationCompatible =
    selectedServiceItems.length === 0 || canBookInClinic || canBookAtHome;
  const needsLocationSelection = isLocationCompatible && canBookInClinic && canBookAtHome;
  const needsLocationStep = isLocationCompatible && canBookAtHome;
  const effectiveLocation: VeterinaryBookingLocation | null =
    selectedServiceItems.length === 0 || !isLocationCompatible
      ? null
      : canBookAtHome
        ? canBookInClinic
          ? selectedLocation
          : 'home'
        : 'clinic';

  const datetimeStep = needsLocationStep ? 4 : 3;
  const detailsStep = needsLocationStep ? 5 : 4;
  const paymentStep = needsLocationStep ? 6 : 5;
  const confirmationStep = needsLocationStep ? 7 : 6;

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
  const { setBookingTime } = availability;

  const quoteRequest = useMemo((): BookingQuoteRequest | null => {
    if (
      currentStep < paymentStep ||
      !provider ||
      !bookingDate ||
      !availability.bookingTime ||
      selectedServiceItems.length === 0 ||
      !isLocationCompatible ||
      !effectiveLocation ||
      (effectiveLocation === 'home' && !serviceAddress.trim())
    ) {
      return null;
    }

    const trimmedNotes = details.notes.trim();
    const typeConfig: VeterinaryTypeConfig = {
      animalType: animalInfo.type,
      animalName: animalInfo.name.trim(),
      animalBreed: animalInfo.breed.trim() || undefined,
      animalAge: animalInfo.age.trim() || undefined,
      animalWeight: animalInfo.weight.trim() || undefined,
      isSterilized: animalInfo.sterilized,
      isVaccinated: animalInfo.vaccinated,
      isAggressive: details.aggressive,
      hasMedicalRecord: details.hasMedicalRecord,
      notes: trimmedNotes || undefined,
    };
    const patientLocationChoice = effectiveLocation === 'home' ? 'home' : 'provider_site';

    return {
      providerId: provider.id,
      serviceItems: selectedServiceItems.map((service) => ({
        serviceId: service.id,
        quantity: 1,
      })),
      startDate: bookingDate,
      endDate: bookingDate,
      dailyStartTime: formatDailyStartTime(availability.bookingTime),
      patientLocationChoice,
      address:
        effectiveLocation === 'home'
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
      patientNotes: trimmedNotes || undefined,
      typeConfig,
    };
  }, [
    animalInfo,
    availability.bookingTime,
    bookingDate,
    currentStep,
    details,
    effectiveLocation,
    isLocationCompatible,
    patientAddressPrefill,
    paymentStep,
    provider,
    selectedServiceItems,
    serviceAddress,
    serviceAddressEdited,
  ]);

  const { quote, quoteLoading, quoteError, refetchQuote } = useBookingQuote(quoteRequest);

  const submission = useBookingSubmission({
    successMessage: t.bookingFlow.bookingSuccessMessage,
    onSuccess: () => setCurrentStep(confirmationStep),
    onSlotConflict: () => {
      setCurrentStep(datetimeStep);
      setBookingTime('');
    },
    onPriceMismatch: (details) => {
      logBookingFlowWarning(
        'VeterinaryBooking quote mismatch detected; refetching authoritative quote.',
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
        veterinaryServices.some((service) => service.id === serviceId),
      );

      return next.length === previous.length ? previous : next;
    });
  }, [servicesLoading, veterinaryServices]);

  useEffect(() => {
    setBookingTime('');
  }, [selectedServiceIds, setBookingTime]);

  useEffect(() => {
    if (effectiveLocation !== 'home' || !patientAddressPrefill || serviceAddressEdited) {
      return;
    }

    setServiceAddress(patientAddressPrefill.displayAddress);
  }, [effectiveLocation, patientAddressPrefill, serviceAddressEdited]);

  useEffect(() => {
    if (animalTypesLoading) {
      return;
    }

    setAnimalInfo((previous) => {
      if (!previous.type) {
        return previous;
      }

      const animalTypeStillAvailable = availableAnimalTypeOptions.some(
        (animalType) => animalType.id === previous.type,
      );

      return animalTypeStillAvailable
        ? previous
        : {
            ...previous,
            type: '',
          };
    });
  }, [animalTypesLoading, availableAnimalTypeOptions]);

  useEffect(() => {
    if (selectedServiceItems.length === 0 || !isLocationCompatible) {
      setSelectedLocation(null);
      setServiceAddressEdited(false);
      return;
    }

    if (!canBookAtHome) {
      setSelectedLocation('clinic');
      setServiceAddress('');
      setServiceAddressEdited(false);
      return;
    }

    if (!canBookInClinic) {
      setSelectedLocation('home');
      return;
    }

    setSelectedLocation((previous) =>
      previous === 'home' || previous === 'clinic' ? previous : null,
    );
  }, [canBookAtHome, canBookInClinic, isLocationCompatible, selectedServiceItems.length]);

  useEffect(() => {
    setCurrentStep((previous) => Math.min(previous, confirmationStep));
  }, [confirmationStep]);

  const patientTimezone = useMemo(() => {
    try {
      return getPatientTimezone();
    } catch {
      return null;
    }
  }, []);

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

    return availability.availableStartTimes.map((time) => {
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
  }, [availability.availableStartTimes, bookingDate, patientTimezone, providerTimezone]);

  const selectedTimeLabel =
    displaySlots.find((slot) => slot.value === availability.bookingTime)?.label ??
    availability.bookingTime;
  const slotEmptyMessage = bookingDate
    ? t.bookingFlow.calendarNoAvailability
    : t.bookingFlow.calendarSelectDay;

  const currentContent = (() => {
    if (currentStep === 1) return 'service';
    if (currentStep === 2) return 'animal';
    if (needsLocationStep) {
      if (currentStep === 3) return 'location';
      if (currentStep === datetimeStep) return 'datetime';
      if (currentStep === detailsStep) return 'details';
      if (currentStep === paymentStep) return 'payment';
      if (currentStep === confirmationStep) return 'confirmation';
    } else {
      if (currentStep === datetimeStep) return 'datetime';
      if (currentStep === detailsStep) return 'details';
      if (currentStep === paymentStep) return 'payment';
      if (currentStep === confirmationStep) return 'confirmation';
    }

    return 'service';
  })();

  const stepLabels = needsLocationStep
    ? [
        'Service',
        'Animal',
        'Lieu',
        t.bookingFlow.selectDate,
        t.bookingFlow.stepDetails,
        t.bookingFlow.stepPayment,
        t.bookingFlow.stepConfirmation,
      ]
    : [
        'Service',
        'Animal',
        t.bookingFlow.selectDate,
        t.bookingFlow.stepDetails,
        t.bookingFlow.stepPayment,
        t.bookingFlow.stepConfirmation,
      ];

  const selectedServicesSubtotal = selectedServiceItems.reduce(
    (subtotal, service) => subtotal + service.price,
    0,
  );
  const selectedServicesCurrency =
    selectedServiceItems[0]?.currency ?? veterinaryServices[0]?.currency ?? 'TND';
  const selectedServicesSubtotalValue = formatServicePrice(
    selectedServicesSubtotal,
    selectedServicesCurrency,
  );
  const totalPrice = quote?.pricing.totalAmount ?? 0;
  const quoteCurrency = quote?.pricing.currency ?? veterinaryServices[0]?.currency ?? 'TND';
  const quoteErrorMessage =
    quoteError instanceof Error ? quoteError.message : defaultFailureMessage;
  const animalTypesErrorMessage =
    animalTypesError instanceof Error ? animalTypesError.message : t.common.loadingError;
  const animalTypeLabel =
    animalTypeOptions.find((type) => type.id === animalInfo.type)?.label || 'Animal';
  const locationLabel = formatLocationLabel(effectiveLocation);
  const servicesErrorMessage =
    servicesError instanceof Error ? servicesError.message : t.common.loadingError;
  const confirmedPricing = submission.bookingResult?.pricing ?? null;
  const confirmedServiceItems = submission.bookingResult?.serviceItems ?? null;
  const confirmedAmount = confirmedPricing
    ? formatServicePrice(confirmedPricing.totalAmount, confirmedPricing.currency ?? quoteCurrency)
    : formatServicePrice(totalPrice, quoteCurrency);
  const confirmedDate = formatDateValue(submission.bookingResult?.startDate) ?? bookingDate;
  const confirmedTime = selectedTimeLabel || availability.bookingTime;

  useEffect(() => {
    if (currentContent !== 'payment' || quoteLoading || quote) {
      return;
    }

    logBookingFlowWarning('VeterinaryBooking quote unavailable on payment step.', {
      errorMessage: quoteError instanceof Error ? quoteError.message : null,
      hasQuoteRequest: Boolean(quoteRequest),
    });
  }, [currentContent, quote, quoteError, quoteLoading, quoteRequest]);

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((previous) =>
      previous.includes(serviceId)
        ? previous.filter((id) => id !== serviceId)
        : [...previous, serviceId],
    );
  };

  const handleNext = () => {
    if (currentContent === 'payment' || currentContent === 'confirmation') {
      return;
    }

    if (!canProceedToNextStep()) {
      return;
    }

    setCurrentStep((previous) => Math.min(previous + 1, confirmationStep));
  };

  const handleBack = () => {
    setCurrentStep((previous) => (previous > 1 ? previous - 1 : previous));
  };

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const canProceedToNextStep = () => {
    switch (currentContent) {
      case 'service':
        return selectedServiceItems.length > 0 && isLocationCompatible;
      case 'animal':
        return Boolean(!animalTypesLoading && animalInfo.type && animalInfo.name.trim());
      case 'location':
        return Boolean(
          isLocationCompatible &&
          effectiveLocation &&
          (effectiveLocation !== 'home' || serviceAddress.trim()),
        );
      case 'datetime':
        return Boolean(
          bookingDate &&
          availability.bookingTime &&
          !availability.availabilityLoading &&
          !availability.availabilityError &&
          displaySlots.length > 0,
        );
      case 'details':
        return true;
      default:
        return true;
    }
  };

  const handlePaymentComplete = (method: 'card' | 'd17' | 'cash') => {
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

  if (providerLoading) {
    return <BookingPageLoader iconClassName="text-muted-foreground" />;
  }

  if (providerError || !provider) {
    return (
      <BookingPageErrorState
        title={t.bookingFlow.providerNotFound}
        actionLabel={t.bookingFlow.backToServices}
        onAction={() => navigate('/veterinary')}
      />
    );
  }

  const providerDisplayName = getProviderDisplayName(provider);
  const providerLocation = getProviderLocation(provider);
  const bookingHeader: BookingFlowHeaderData = {
    providerName: providerDisplayName,
    providerImageUrl: getProviderImageUrl(provider),
    rating: {
      average: provider.ratingAverage,
      count: provider.ratingCount,
      reviewLabel: t.serviceListing.reviews,
    },
    bookingTypeLabel: t.serviceListing.veterinaryTitle,
    locationLabel: providerLocation,
  };

  const inputClassName =
    'w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20';
  const surfaceClassName = bookingNeutralSurfaceClassName;
  const veterinarySuccessCardClassName = bookingNeutralSuccessCardClassName;

  const selectedServicesSummaryRows =
    selectedServiceItems.length > 0
      ? selectedServiceItems.map((service) => {
          const serviceName = service.name ?? service.id;
          const servicePrice = formatServicePrice(
            service.price,
            service.currency ?? selectedServicesCurrency,
          );

          return {
            label: serviceName,
            value: servicePrice,
            valueTitle: servicePrice,
            className: summaryServiceRowClassName,
            valueClassName: summaryServiceValueClassName,
          };
        })
      : [
          {
            label: 'Services',
            value: SUMMARY_REQUIRED_PLACEHOLDER,
          },
        ];
  const selectedServicesDurationSummary =
    formatSelectedServicesDuration(selectedServiceItems, 'Durée à confirmer') ?? '';
  const selectedServicesLocationSummary =
    selectedServiceItems.length === 0
      ? ''
      : !isLocationCompatible
        ? 'Services incompatibles'
        : effectiveLocation
          ? formatLocationLabel(effectiveLocation)
          : SUMMARY_REQUIRED_PLACEHOLDER;
  const serviceMetadataDividerClassName =
    selectedServiceItems.length > 0
      ? 'border-t border-slate-200 pt-3 dark:border-slate-700'
      : undefined;
  const trimmedAnimalName = animalInfo.name.trim();
  const trimmedAnimalBreed = animalInfo.breed.trim();
  const trimmedAnimalAge = animalInfo.age.trim();
  const trimmedAnimalWeight = animalInfo.weight.trim();
  const trimmedServiceAddress = serviceAddress.trim();
  const trimmedNotes = details.notes.trim();
  const summaryProgress =
    currentContent === 'service'
      ? 0
      : currentContent === 'animal'
        ? 1
        : currentContent === 'location'
          ? 2
          : currentContent === 'datetime'
            ? 3
            : currentContent === 'details'
              ? 4
              : 5;
  const serviceSummaryItems: NonNullable<BookingFlowSummarySection['items']> = [
    ...selectedServicesSummaryRows,
    {
      label: 'Durée',
      value: selectedServicesDurationSummary,
      valueTitle: selectedServicesDurationSummary,
      className: serviceMetadataDividerClassName,
      valueClassName: 'font-normal text-muted-foreground',
      hidden: selectedServiceItems.length === 0 || !selectedServicesDurationSummary,
    },
    {
      label: 'Lieu',
      value: selectedServicesLocationSummary,
      valueTitle: selectedServicesLocationSummary,
      valueClassName: 'font-normal text-muted-foreground',
      hidden: selectedServiceItems.length === 0 || !selectedServicesLocationSummary,
    },
  ];
  const summaryDetailSections: BookingFlowSummarySection[] = [
    {
      title: 'Animal',
      hidden: summaryProgress < 1,
      items: [
        {
          label: "Type d'animal",
          value: animalInfo.type ? animalTypeLabel : SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: "Nom de l'animal",
          value: trimmedAnimalName || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: trimmedAnimalName || undefined,
        },
        {
          label: 'Race',
          value: trimmedAnimalBreed,
          valueTitle: trimmedAnimalBreed,
          hidden: !trimmedAnimalBreed,
        },
        {
          label: t.bookingFlow.age,
          value: trimmedAnimalAge,
          valueTitle: trimmedAnimalAge,
          hidden: !trimmedAnimalAge,
        },
        {
          label: 'Poids',
          value: `${trimmedAnimalWeight} kg`,
          valueTitle: `${trimmedAnimalWeight} kg`,
          hidden: !trimmedAnimalWeight,
        },
        {
          label: 'Stérilisé(e)',
          value: 'Oui',
          hidden: !animalInfo.sterilized,
        },
        {
          label: 'Vacciné(e)',
          value: 'Oui',
          hidden: !animalInfo.vaccinated,
        },
      ],
    },
    {
      title: 'Lieu',
      hidden: needsLocationStep ? summaryProgress < 2 : summaryProgress < 3,
      items: [
        {
          label: 'Mode',
          value: effectiveLocation ? locationLabel : SUMMARY_REQUIRED_PLACEHOLDER,
        },
        {
          label: 'Adresse de visite',
          value: trimmedServiceAddress || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: trimmedServiceAddress || undefined,
          hidden: effectiveLocation !== 'home',
        },
        {
          label: 'Adresse clinique',
          value: providerLocation || SUMMARY_REQUIRED_PLACEHOLDER,
          valueTitle: providerLocation || undefined,
          hidden: effectiveLocation !== 'clinic',
        },
      ],
    },
    {
      title: t.bookingFlow.dateAndTime,
      hidden: summaryProgress < 3,
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
    },
    {
      title: 'Notes',
      hidden: summaryProgress < 4,
      items: [
        {
          label: t.bookingFlow.medicalNotes,
          value: trimmedNotes,
          valueTitle: trimmedNotes,
          hidden: !trimmedNotes,
        },
        {
          label: 'Comportement',
          value: 'Animal agressif / craintif',
          hidden: !details.aggressive,
        },
        {
          label: 'Carnet de santé',
          value: 'Disponible',
          hidden: !details.hasMedicalRecord,
        },
      ],
    },
  ];
  const baseSummarySections: BookingFlowSummarySection[] = [
    {
      title: 'Services',
      items: serviceSummaryItems,
    },
    ...summaryDetailSections,
  ];
  const paymentSummarySections: BookingFlowSummarySection[] = quote
    ? [
        ...baseSummarySections,
        {
          title: 'Tarification',
          items: [
            {
              label: t.bookingFlow.subtotal,
              value: formatServicePrice(quote.pricing.bookingSubtotal, quoteCurrency),
            },
            {
              label: t.bookingFlow.serviceFees,
              value: formatServicePrice(quote.pricing.platformFee, quoteCurrency),
            },
          ],
        },
      ]
    : baseSummarySections;
  const paymentSummaryTotalValue = formatServicePrice(totalPrice, quoteCurrency);
  const bookingSummary =
    currentContent !== 'payment' && currentContent !== 'confirmation' ? (
      <BookingFlowSummary
        title={t.bookingFlow.bookingSummary}
        icon={<ShoppingCart aria-hidden="true" />}
        className={bookingNeutralPanelClassName}
        iconClassName="bg-transparent text-slate-600 dark:text-slate-300"
        sections={baseSummarySections}
        total={{
          label: t.bookingFlow.subtotal,
          value: selectedServicesSubtotalValue,
          valueTitle: selectedServicesSubtotalValue,
          variant: 'line',
          className: 'border-slate-200 dark:border-slate-700',
          labelClassName:
            'text-base font-extrabold uppercase tracking-wide text-slate-900 dark:text-white',
          valueClassName: 'text-sm font-semibold text-muted-foreground',
        }}
      />
    ) : null;
  const paymentSummary = quote ? (
    <BookingFlowSummary
      title={t.bookingFlow.bookingSummary}
      icon={<ShoppingCart aria-hidden="true" />}
      className={bookingNeutralPanelClassName}
      iconClassName="bg-transparent text-slate-600 dark:text-slate-300"
      sections={paymentSummarySections}
      total={{
        label: t.bookingFlow.totalToPay,
        value: paymentSummaryTotalValue,
        valueTitle: paymentSummaryTotalValue,
        className: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50',
        labelClassName: 'text-slate-900 dark:text-white',
        valueClassName: bookingCyanTotalClassName,
      }}
    />
  ) : null;

  return (
    <BookingFlowChrome
      header={bookingHeader}
      currentStep={currentStep}
      stepLabels={stepLabels}
      showProgress={currentContent !== 'confirmation'}
      className="px-6 py-6 pb-20 text-slate-900 dark:text-white"
      headerClassName="relative overflow-hidden rounded-[20px] p-[2px] shadow-xl"
      headerAnimatedBorderStyle={styles.conicBorder}
      headerInnerClassName="rounded-[18px] bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95"
      headerAvatarFallbackClassName="text-white"
      headerAvatarFallbackStyle={styles.gradient}
      innerClassName="max-w-5xl"
      contentClassName="space-y-6"
    >
      <BookingFlowBodyLayout summary={bookingSummary}>
        <div className={surfaceClassName} style={accentVariables}>
          {currentContent === 'service' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Choisissez vos services
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Sélectionnez une ou plusieurs prestations publiées par ce vétérinaire.
                </p>
              </div>

              {filteredOutServiceCount > 0 ? (
                <div className="rounded-xl border border-amber-300/70 bg-amber-50/80 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Certains services publiés n'ont pas de durée réservable en ligne et ont été
                      masqués du catalogue de réservation.
                    </p>
                  </div>
                </div>
              ) : null}

              {servicesLoading && veterinaryServices.length === 0 ? (
                <BookingOptionListSkeleton items={4} />
              ) : null}

              {servicesError ? (
                <BookingInlineState
                  tone="danger"
                  title={t.common.loadingError}
                  description={servicesErrorMessage}
                />
              ) : null}

              {!servicesLoading && !servicesError && veterinaryServices.length === 0 ? (
                <BookingInlineState tone="muted" title={t.services.noServicesFound} />
              ) : null}

              {!servicesLoading && !servicesError && veterinaryServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {veterinaryServices.map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    const locationType = normalizeServiceLocation(service.serviceLocation);

                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`rounded-xl border p-4 text-left transition-colors ${isSelected ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                      >
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {service.name ?? service.id}
                            </span>
                          </div>
                          <span className="whitespace-nowrap text-sm font-bold text-[color:var(--service-accent-from)]">
                            {formatServicePrice(service.price, service.currency)}
                          </span>
                        </div>

                        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                          {service.shortDescription ?? 'Aucune description fournie.'}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                          <div className={bookingDurationBadgeClassName}>
                            <Clock className="h-3 w-3" />
                            <span>{formatServiceDuration(service.durationMinutes)}</span>
                          </div>
                          <div className="flex items-center gap-2">
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
                              {getServiceLocationLabel(locationType)}
                            </span>
                            {service.isUrgent ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                                <Zap className="h-3 w-3" />
                                {t.home.emergency}
                              </span>
                            ) : null}
                            {isSelected ? (
                              <CheckCircle className="h-4 w-4 text-[color:var(--service-accent-from)]" />
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {selectedServiceItems.length > 0 ? (
                <div className={bookingNeutralPanelClassName}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedServiceItems.length} service
                        {selectedServiceItems.length > 1 ? 's' : ''} sélectionné
                        {selectedServiceItems.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedServiceItems.map((service) => (
                          <span key={service.id} className={bookingMetadataBadgeClassName}>
                            {service.name ?? service.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedServiceItems.length > 0 && !isLocationCompatible ? (
                <BookingInlineState
                  tone="warning"
                  title="Services incompatibles"
                  description="Les services sélectionnés ne partagent aucun lieu de consultation. Modifiez votre sélection pour poursuivre la réservation."
                />
              ) : null}
            </div>
          ) : null}

          {currentContent === 'animal' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Informations sur l'animal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Type d'animal
                  </label>
                  {animalTypesLoading && availableAnimalTypeOptions.length === 0 ? (
                    <BookingOptionListSkeleton items={6} leading="none" />
                  ) : null}

                  {!animalTypesLoading && animalTypesError ? (
                    <BookingInlineState
                      tone="danger"
                      title={t.common.loadingError}
                      description={animalTypesErrorMessage}
                      action={
                        <button
                          type="button"
                          onClick={() => void refetchAnimalTypes()}
                          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                        >
                          {t.common.retry}
                        </button>
                      }
                    />
                  ) : null}

                  {!animalTypesLoading &&
                  !animalTypesError &&
                  availableAnimalTypeOptions.length === 0 ? (
                    <div className="rounded-xl border border-amber-300/70 bg-amber-50/80 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            {selectedServiceSupportedAnimalTypes !== null
                              ? "Aucun type d'animal compatible n'est disponible pour les services sélectionnés."
                              : "Aucun type d'animal n'est disponible pour le moment."}
                          </p>
                          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                            {selectedServiceSupportedAnimalTypes !== null
                              ? 'Modifiez votre sélection de services pour poursuivre la réservation.'
                              : 'Réessayez plus tard lorsque le référentiel vétérinaire sera de nouveau disponible.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!animalTypesLoading &&
                  !animalTypesError &&
                  availableAnimalTypeOptions.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pb-2">
                      {availableAnimalTypeOptions.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            setAnimalInfo((previous) => ({
                              ...previous,
                              type: type.id,
                            }))
                          }
                          className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-colors ${animalInfo.type === type.id ? bookingAccentSelectedOptionClassName : bookingAccentInactiveOptionClassName}`}
                        >
                          {type.icon.kind === 'lucide' ? (
                            <type.icon.Icon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <span className="text-xl" aria-hidden="true">
                              {type.icon.value}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-900 dark:text-white">
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Nom de l'animal
                    </label>
                    <input
                      type="text"
                      value={animalInfo.name}
                      onChange={(event) =>
                        setAnimalInfo((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="Ex: Rex"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Race (optionnel)
                    </label>
                    <input
                      type="text"
                      value={animalInfo.breed}
                      onChange={(event) =>
                        setAnimalInfo((previous) => ({
                          ...previous,
                          breed: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="Ex: Labrador"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.bookingFlow.age}
                    </label>
                    <input
                      type="text"
                      value={animalInfo.age}
                      onChange={(event) =>
                        setAnimalInfo((previous) => ({
                          ...previous,
                          age: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="Ex: 2 ans"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      value={animalInfo.weight}
                      onChange={(event) =>
                        setAnimalInfo((previous) => ({
                          ...previous,
                          weight: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="Ex: 15"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <Field orientation="horizontal" className="w-auto items-center gap-2">
                    <Checkbox
                      id="animal-sterilized"
                      checked={animalInfo.sterilized}
                      onCheckedChange={(checked) =>
                        setAnimalInfo((previous) => ({
                          ...previous,
                          sterilized: checked === true,
                        }))
                      }
                    />
                    <FieldLabel
                      htmlFor="animal-sterilized"
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      Stérilisé(e)
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal" className="w-auto items-center gap-2">
                    <Checkbox
                      id="animal-vaccinated"
                      checked={animalInfo.vaccinated}
                      onCheckedChange={(checked) =>
                        setAnimalInfo((previous) => ({
                          ...previous,
                          vaccinated: checked === true,
                        }))
                      }
                    />
                    <FieldLabel
                      htmlFor="animal-vaccinated"
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      Vacciné(e) à jour
                    </FieldLabel>
                  </Field>
                </div>
              </div>
            </div>
          ) : null}

          {currentContent === 'location' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Lieu de consultation
              </h2>

              {needsLocationSelection ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedLocation('clinic')}
                    className={`rounded-xl border-2 p-6 text-left transition-colors ${selectedLocation === 'clinic' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500/30 dark:border-blue-400 dark:bg-blue-500/10 dark:ring-blue-400/30' : bookingNeutralPaymentOptionClassName}`}
                  >
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${selectedLocation === 'clinic' ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-slate-950' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      <Building2 className="h-7 w-7" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                      En clinique
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Rendez-vous au cabinet vétérinaire.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLocation('home')}
                    className={`rounded-xl border-2 p-6 text-left transition-colors ${selectedLocation === 'home' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/30 dark:border-emerald-400 dark:bg-emerald-500/10 dark:ring-emerald-400/30' : bookingNeutralPaymentOptionClassName}`}
                  >
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${selectedLocation === 'home' ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      <Home className="h-7 w-7" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                      À domicile
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Le vétérinaire se déplace chez vous lorsque le service le permet.
                    </p>
                  </button>
                </div>
              ) : (
                <div className={bookingNeutralPanelClassName}>
                  <div className="flex items-start gap-3">
                    <Home className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Ce service est disponible uniquement à domicile.
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Ajoutez l'adresse exacte pour poursuivre la réservation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {effectiveLocation === 'home' ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Adresse de visite *
                  </label>
                  <textarea
                    rows={3}
                    value={serviceAddress}
                    onChange={(event) => {
                      setServiceAddressEdited(true);
                      setServiceAddress(event.target.value);
                    }}
                    className={`${inputClassName} resize-none`}
                    placeholder="Adresse complète pour la visite vétérinaire à domicile"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {currentContent === 'datetime' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.bookingFlow.dateAndTime}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.bookingFlow.selectDate}
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
                    disabled={servicesLoading || selectedServiceItems.length === 0}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.bookingFlow.selectTime}
                  </label>
                  <DaySlotPicker
                    slots={displaySlots}
                    selectedSlot={availability.bookingTime}
                    onSelectSlot={availability.setBookingTime}
                    loading={availability.availabilityLoading}
                    providerTimezone={providerTimezone}
                    emptyMessage={slotEmptyMessage}
                  />
                </div>
              </div>

              {availability.availabilityError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                  <p className="text-xs font-semibold text-destructive">{t.bookingFlow.error}</p>
                  <p className="mt-1 text-xs text-destructive">
                    {availability.availabilityErrorMessage}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {currentContent === 'details' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.bookingFlow.stepDetails}
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.bookingFlow.medicalNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={details.notes}
                    onChange={(event) =>
                      setDetails((previous) => ({
                        ...previous,
                        notes: event.target.value,
                      }))
                    }
                    className={`${inputClassName} resize-none`}
                    placeholder="Symptômes, comportement inhabituel, allergies connues..."
                  />
                </div>

                <div className={bookingNeutralPanelClassName}>
                  <Field orientation="horizontal" className="mb-4 items-center gap-3">
                    <Checkbox
                      id="aggressive"
                      checked={details.aggressive}
                      onCheckedChange={(checked) =>
                        setDetails((previous) => ({
                          ...previous,
                          aggressive: checked === true,
                        }))
                      }
                    />
                    <FieldLabel
                      htmlFor="aggressive"
                      className="text-sm font-medium text-slate-900 dark:text-white"
                    >
                      Mon animal est agressif / craintif (nécessite précautions)
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal" className="items-center gap-3">
                    <Checkbox
                      id="medicalRecord"
                      checked={details.hasMedicalRecord}
                      onCheckedChange={(checked) =>
                        setDetails((previous) => ({
                          ...previous,
                          hasMedicalRecord: checked === true,
                        }))
                      }
                    />
                    <FieldLabel
                      htmlFor="medicalRecord"
                      className="text-sm font-medium text-slate-900 dark:text-white"
                    >
                      J'ai le carnet de santé / vaccination
                    </FieldLabel>
                  </Field>
                </div>
              </div>
            </div>
          ) : null}

          {currentContent === 'payment' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBack}
                className="group inline-flex h-auto items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                {t.bookingFlow.previous}
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
                    providerName={getProviderDisplayName(provider)}
                    serviceName={selectedServiceItems
                      .map((service) => service.name ?? service.id)
                      .join(', ')}
                    date={bookingDate}
                    time={selectedTimeLabel}
                    cashAvailable={quote?.cashAvailable ?? true}
                    panelClassName={bookingNeutralPanelClassName}
                    noticeClassName="border-cyan-300/70 bg-cyan-50/70 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
                    optionClassName={bookingNeutralPaymentOptionClassName}
                    optionSelectedClassName={bookingCyanPaymentOptionSelectedBaseClassName}
                  />
                ) : null}
              </BookingQuotePanel>
            </div>
          ) : null}

          {currentContent === 'confirmation' ? (
            <BookingSuccessPanel
              bookingNumber={submission.bookingResult?.bookingNumber}
              onGoToDashboard={() => navigate('/patient-dashboard')}
              onViewServices={() => navigate('/veterinary')}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Votre rendez-vous pour {animalInfo.name || 'votre animal'} a bien été enregistré.
                Vous recevrez un SMS de confirmation avec les prochaines étapes.
              </p>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${veterinarySuccessCardClassName}`}
              >
                <p>
                  <span className="font-semibold">Animal:</span> {animalInfo.name} (
                  {animalTypeLabel})
                </p>
                <p>
                  <span className="font-semibold">Lieu:</span> {locationLabel}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectDate}:</span> {confirmedDate}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.selectTime}:</span> {confirmedTime}
                </p>
                <p>
                  <span className="font-semibold">{t.bookingFlow.total}:</span>{' '}
                  <span className={bookingCyanTotalClassName}>{confirmedAmount}</span>
                </p>
              </div>

              <div className={veterinarySuccessCardClassName}>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Services retenus
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
                          <span className="font-semibold whitespace-nowrap text-[color:var(--service-accent-from)]">
                            {formatServicePrice(
                              serviceItem.subtotal,
                              serviceItem.currency ?? confirmedPricing?.currency ?? quoteCurrency,
                            )}
                          </span>
                        </div>
                      ))
                    : selectedServiceItems.map((service) => (
                        <div key={service.id} className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{service.name ?? service.id}</p>
                            <p>{service.shortDescription ?? 'Aucune description fournie.'}</p>
                          </div>
                          <span className="font-semibold whitespace-nowrap text-[color:var(--service-accent-from)]">
                            {formatServicePrice(service.price, service.currency)}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {confirmedPricing ? (
                <div className={veterinarySuccessCardClassName}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Tarification confirmée
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span>Montant des services</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.bookingSubtotal,
                          confirmedPricing.currency ?? quoteCurrency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>{t.bookingFlow.serviceFees}</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.platformFee,
                          confirmedPricing.currency ?? quoteCurrency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 font-semibold">
                      <span>{t.bookingFlow.totalToPay}</span>
                      <span className={bookingCyanTotalClassName}>
                        {formatServicePrice(
                          confirmedPricing.totalAmount,
                          confirmedPricing.currency ?? quoteCurrency,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {effectiveLocation === 'home' ? (
                <div className={veterinarySuccessCardClassName}>
                  <p className="font-semibold">Adresse de visite</p>
                  <p className="mt-2">{serviceAddress}</p>
                </div>
              ) : null}

              <div className={veterinarySuccessCardClassName}>
                <p>
                  <span className="font-semibold">Race:</span> {animalInfo.breed || 'Non précisée'}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Âge / poids:</span> {animalInfo.age || '—'} /{' '}
                  {animalInfo.weight || '—'} kg
                </p>
                {details.notes ? (
                  <p className="mt-2">
                    <span className="font-semibold">Notes:</span> {details.notes}
                  </p>
                ) : null}
              </div>
            </BookingSuccessPanel>
          ) : null}
        </div>

        {currentContent !== 'payment' && currentContent !== 'confirmation' ? (
          <BookingStepActions
            onBack={currentStep > 1 ? handleBack : undefined}
            backLabel={t.bookingFlow.previous}
            onNext={handleNext}
            nextType="button"
            nextDisabled={!canProceedToNextStep()}
            nextLabel={
              currentContent === 'details' ? t.bookingFlow.continueToPayment : t.bookingFlow.next
            }
          />
        ) : null}
      </BookingFlowBodyLayout>
    </BookingFlowChrome>
  );
}
