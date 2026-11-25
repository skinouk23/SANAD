using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Services;
using Provider = SanadPlatform.API.Features.Providers.Entities.Provider;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Shared booking pricing implementation used by booking creation and quote flows.
/// </summary>
public class BookingPricingService : IBookingPricingService
{
    private const string SlotConflictCode = "BOOKING_SLOT_CONFLICT";

    private readonly IProviderRepository _providerRepository;
    private readonly IServiceResolutionService _serviceResolutionService;
    private readonly IProviderRangeAvailabilityService _rangeAvailabilityService;
    private readonly BookingCategoryPolicyRegistry _policyRegistry;
    private readonly IStoredFileRepository _storedFileRepository;
    private readonly ILogger<BookingPricingService> _logger;

    public BookingPricingService(
        IProviderRepository providerRepository,
        IServiceResolutionService serviceResolutionService,
        IProviderRangeAvailabilityService rangeAvailabilityService,
        BookingCategoryPolicyRegistry policyRegistry,
        IStoredFileRepository storedFileRepository,
        ILogger<BookingPricingService> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _serviceResolutionService = serviceResolutionService ?? throw new ArgumentNullException(nameof(serviceResolutionService));
        _rangeAvailabilityService = rangeAvailabilityService ?? throw new ArgumentNullException(nameof(rangeAvailabilityService));
        _policyRegistry = policyRegistry ?? throw new ArgumentNullException(nameof(policyRegistry));
        _storedFileRepository = storedFileRepository ?? throw new ArgumentNullException(nameof(storedFileRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<BookingPricingResult> CalculateAsync(
        BookingPricingInput input,
        bool tracked,
        CancellationToken cancellationToken = default)
    {
        Provider? provider = tracked
            ? await _providerRepository.GetByIdForUpdateAsync(input.ProviderId, cancellationToken)
            : await _providerRepository.GetByIdAsync(input.ProviderId, cancellationToken);

        if (provider is null)
        {
            throw new KeyNotFoundException($"Provider {input.ProviderId} was not found.");
        }

        if (!provider.IsApproved || !provider.IsAvailable)
        {
            throw new InvalidOperationException("Provider is not currently accepting new bookings.");
        }

        var requestedItems = input.ServiceItems
            .Select(item => new ServiceItemRequest(item.ServiceId, item.Quantity))
            .ToList()
            .AsReadOnly();

        var selectedItems = tracked
            ? await _serviceResolutionService.ResolveForUpdateAsync(input.ProviderId, requestedItems, cancellationToken)
            : await _serviceResolutionService.ResolveAsync(input.ProviderId, requestedItems, cancellationToken);

        var primaryService = selectedItems[0].Service;
        var effectiveEndDate = IServiceResolutionService.IsSingleServiceCategory(primaryService.Category)
            ? input.StartDate
            : input.EndDate;

        var policy = _policyRegistry.Resolve(primaryService.Category);
        var categoryContext = new BookingCategoryContext(
            primaryService.Category,
            input.StartDate,
            input.TypeConfig,
            input.AddressLine1,
            primaryService.ServiceLocation,
            primaryService.Metadata,
            primaryService.Price,
            primaryService.AvailableQuantity,
            primaryService.RequiresPrescription,
            input.PatientLocationChoice,
            input.PrescriptionFileId);

        await ValidatePrescriptionFileAsync(
            input.PrescriptionFileId,
            input.CallerUserId,
            input.PatientId,
            provider.Id,
            primaryService,
            cancellationToken);

        policy.Validate(categoryContext);
        var categoryResult = policy.Process(categoryContext);

        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone ?? "Africa/Tunis");
        if (ProviderAvailabilityComputation.IsPastSameDayStartTime(input.StartDate, input.DailyStartTime, providerTz))
        {
            throw new InvalidOperationException("Daily start time must be in the future for same-day bookings.");
        }

        var rangeAvailability = await _rangeAvailabilityService.GetRangeAvailabilityAsync(
            input.ProviderId,
            input.StartDate,
            effectiveEndDate,
            input.ServiceItems
                .Select(item => new ProviderRequestedServiceItem(item.ServiceId, item.Quantity))
                .ToList()
                .AsReadOnly(),
            cancellationToken);

        if (!rangeAvailability.AvailableStartTimes.Contains(input.DailyStartTime))
        {
            throw CreateSlotConflictException(
                message: "The selected daily start time is not available for the full booking range.",
                startDate: input.StartDate,
                endDate: effectiveEndDate,
                dailyStartTime: input.DailyStartTime,
                dailyEndTime: input.DailyStartTime.AddMinutes(rangeAvailability.DailyDurationMinutes),
                conflictType: "range_availability");
        }

        var timing = new BookingTimingInfo(
            rangeAvailability.DayCount,
            rangeAvailability.DailyDurationMinutes,
            input.DailyStartTime.AddMinutes(rangeAvailability.DailyDurationMinutes));

        var pricing = CalculatePricingBreakdown(
            provider.CommissionRate,
            primaryService.Category,
            categoryResult.ServicePrice,
            selectedItems,
            timing.DayCount);

        _logger.LogInformation(
            "Calculated booking pricing for provider {ProviderId}, category {Category}: subtotal={BookingSubtotal}, fee={PlatformFee}, total={TotalAmount}",
            provider.Id,
            primaryService.Category,
            pricing.BookingSubtotal,
            pricing.PlatformFee,
            pricing.TotalAmount);

        return new BookingPricingResult(
            provider,
            selectedItems,
            primaryService,
            effectiveEndDate,
            timing,
            pricing,
            policy,
            categoryResult);
    }

    /// <summary>
    /// Calculates the authoritative pricing breakdown for a booking.
    /// </summary>
    public static BookingPricingInfo CalculatePricingBreakdown(
        decimal commissionRate,
        string category,
        decimal categoryServicePrice,
        IReadOnlyList<ResolvedServiceItem> selectedItems,
        int dayCount)
    {
        decimal servicePrice;
        decimal addonsPrice;
        decimal bookingSubtotal;

        if (IServiceResolutionService.IsSingleServiceCategory(category))
        {
            servicePrice = categoryServicePrice;
            addonsPrice = 0m;
            bookingSubtotal = categoryServicePrice;
        }
        else
        {
            servicePrice = Math.Round(selectedItems[0].Service.Price * selectedItems[0].Quantity, 2);
            addonsPrice = selectedItems
                .Skip(1)
                .Sum(item => Math.Round(item.Service.Price * item.Quantity, 2));

            var perDaySubtotal = servicePrice + addonsPrice;
            bookingSubtotal = perDaySubtotal * dayCount;
        }

        var platformFee = Math.Round(bookingSubtotal * (commissionRate / 100m), 2);
        var totalAmount = bookingSubtotal + platformFee;
        var providerAmount = totalAmount - platformFee;

        return new BookingPricingInfo(
            servicePrice,
            addonsPrice,
            servicePrice + addonsPrice,
            bookingSubtotal,
            platformFee,
            totalAmount,
            providerAmount);
    }

    private async Task ValidatePrescriptionFileAsync(
        Guid? prescriptionFileId,
        Guid callerUserId,
        Guid patientId,
        Guid providerId,
        Service primaryService,
        CancellationToken cancellationToken)
    {
        if (!prescriptionFileId.HasValue)
        {
            return;
        }

        var storedFile = await _storedFileRepository.GetByIdAsync(prescriptionFileId.Value, cancellationToken);
        if (storedFile is null)
        {
            throw new KeyNotFoundException($"Prescription file {prescriptionFileId.Value} was not found.");
        }

        if (storedFile.Status != StoredFileStatus.Ready || storedFile.UseCase != FileUseCase.Prescription)
        {
            throw new InvalidOperationException(
                $"Prescription file {prescriptionFileId.Value} must be a ready prescription file before booking.");
        }

        if (storedFile.RelatedPatientId != patientId || storedFile.OwnerUserId != callerUserId)
        {
            throw new ForbiddenAccessException("Prescription file does not belong to the authenticated patient.");
        }

        _logger.LogInformation(
            "Prescription file validation succeeded for provider {ProviderId}, service {ServiceId}: file {PrescriptionFileId}",
            providerId,
            primaryService.Id,
            prescriptionFileId.Value);
    }

    private static BookingConflictException CreateSlotConflictException(
        string message,
        DateOnly startDate,
        DateOnly endDate,
        TimeOnly dailyStartTime,
        TimeOnly? dailyEndTime,
        string conflictType,
        Exception? innerException = null)
    {
        var details = new BookingSlotConflictDetails(
            startDate,
            endDate,
            dailyStartTime,
            dailyEndTime,
            conflictType);

        return innerException is null
            ? new BookingConflictException(SlotConflictCode, message, details)
            : new BookingConflictException(SlotConflictCode, message, details, innerException);
    }

    private sealed record BookingSlotConflictDetails(
        DateOnly StartDate,
        DateOnly EndDate,
        TimeOnly DailyStartTime,
        TimeOnly? DailyEndTime,
        string ConflictType);
}
