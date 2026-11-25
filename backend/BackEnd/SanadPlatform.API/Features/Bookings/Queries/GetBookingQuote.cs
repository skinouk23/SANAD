using System.Text.Json;
using MediatR;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Queries;

// ==================== Query ====================

/// <summary>
/// Query to calculate an authoritative booking quote without creating a booking.
/// </summary>
public record GetBookingQuoteQuery(
    Guid CallerUserId,
    Guid ProviderId,
    IReadOnlyList<ServiceItemSelection> ServiceItems,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly DailyStartTime,
    string? AddressLine1,
    JsonElement? TypeConfig,
    string? PatientLocationChoice,
    Guid? PrescriptionFileId) : IRequest<BookingQuoteResponse>, ISensitiveRequest;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetBookingQuoteQuery"/>.
/// Uses the shared booking pricing service so quote and create-booking flows cannot drift.
/// </summary>
public class GetBookingQuoteHandler : IRequestHandler<GetBookingQuoteQuery, BookingQuoteResponse>
{
    private readonly IBookingPricingService _pricingService;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderWalletService _providerWalletService;
    private readonly ILogger<GetBookingQuoteHandler> _logger;

    public GetBookingQuoteHandler(
        IBookingPricingService pricingService,
        IPatientRepository patientRepository,
        IProviderWalletService providerWalletService,
        ILogger<GetBookingQuoteHandler> logger)
    {
        _pricingService = pricingService ?? throw new ArgumentNullException(nameof(pricingService));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BookingQuoteResponse> Handle(
        GetBookingQuoteQuery query,
        CancellationToken cancellationToken)
    {
        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Patient profile not found for user {query.CallerUserId}.");

        var input = new BookingPricingInput(
            query.CallerUserId,
            patientId,
            query.ProviderId,
            query.ServiceItems,
            query.StartDate,
            query.EndDate,
            query.DailyStartTime,
            query.AddressLine1,
            query.TypeConfig,
            query.PatientLocationChoice,
            query.PrescriptionFileId);

        var result = await _pricingService.CalculateAsync(
            input,
            tracked: false,
            cancellationToken: cancellationToken);

        CreateBookingEquipmentRentalResponse? equipmentRental = null;
        if (result.CategoryResult.CategoryData is EquipmentRentalDraft draft)
        {
            equipmentRental = new CreateBookingEquipmentRentalResponse
            {
                EndDate = draft.RentalEndDate,
                RentalDurationType = draft.RentalDurationType,
                PeriodRate = draft.PeriodRate,
                PeriodCount = draft.PeriodCount,
                DepositAmount = draft.DepositAmount,
                DepositStatus = PaymentStatuses.Pending,
            };
        }

        var cashAvailability = await _providerWalletService.GetCashBookingAvailabilityAsync(
            query.ProviderId,
            result.Pricing.PlatformFee,
            cancellationToken);

        var response = new BookingQuoteResponse
        {
            BookingType = result.PrimaryService.Category,
            StartDate = query.StartDate,
            EndDate = result.EffectiveEndDate,
            DayCount = result.Timing.DayCount,
            DailyDurationMinutes = result.Timing.DailyDurationMinutes,
            Pricing = new CreateBookingPricingResponse
            {
                PerDaySubtotal = result.Pricing.PerDaySubtotal,
                BookingSubtotal = result.Pricing.BookingSubtotal,
                PlatformFee = result.Pricing.PlatformFee,
                TotalAmount = result.Pricing.TotalAmount,
                Currency = ProviderFinanceConstants.DefaultCurrency,
            },
            CashAvailable = cashAvailability.Available,
            CashUnavailableReasonCode = cashAvailability.Available ? null : cashAvailability.ReasonCode,
            EquipmentRental = equipmentRental,
        };

        _logger.LogInformation(
            "Quote calculated for provider {ProviderId}, category {Category}, total {TotalAmount}",
            query.ProviderId,
            result.PrimaryService.Category,
            result.Pricing.TotalAmount);

        return response;
    }
}
