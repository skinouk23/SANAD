using System.Text.Json;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Features.Equipment.Entities;
using SanadPlatform.API.Features.Equipment.Services;
using SanadPlatform.API.Common.Constants;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Booking category policy for the <c>equipment_rental</c> category.
/// Validates rental constraints, computes multi-rate pricing using
/// <see cref="RentalPricingCalculator"/>, and builds the <see cref="EquipmentRental"/>
/// child entity and response block via explicit apply methods.
/// Absorbs logic previously in <c>EquipmentRentalBookingStrategy</c> and
/// <c>BookingHelpers.CalculateEquipmentPricing</c>.
/// </summary>
public class EquipmentRentalBookingCategoryPolicy : IBookingCategoryPolicy
{
    private static readonly HashSet<string> ValidTiers = new(StringComparer.OrdinalIgnoreCase)
    {
        "daily", "weekly", "monthly"
    };

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.EquipmentRental;

    // ==================== Validate ====================

    /// <inheritdoc />
    public void Validate(BookingCategoryContext context)
    {
        if (string.IsNullOrWhiteSpace(context.AddressLine1))
            throw new InvalidOperationException("A delivery address (address.line1) is required for equipment rentals.");

        var config = DeserializeConfig(context.TypeConfig);

        if (config.EndDate <= context.StartDate)
            throw new InvalidOperationException("Equipment rental end date must be after the booking start date.");

        var tier = config.RentalDurationType.ToLowerInvariant();
        if (!ValidTiers.Contains(tier))
            throw new InvalidOperationException("rentalDurationType must be 'daily', 'weekly', or 'monthly'.");

        // Minimum duration per tier
        int days = config.EndDate.DayNumber - context.StartDate.DayNumber;
        var minMet = tier switch
        {
            "daily" => days >= 1,
            "weekly" => days >= 7,
            "monthly" => days >= 28,
            _ => true
        };
        if (!minMet)
            throw new InvalidOperationException(
                "Minimum rental duration not met for the selected tier (daily >= 1 day, weekly >= 7 days, monthly >= 28 days).");

        if ((context.AvailableQuantity ?? 0) <= 0)
            throw new InvalidOperationException("This equipment item is currently out of stock.");
    }

    // ==================== Process ====================

    /// <inheritdoc />
    public BookingCategoryResult Process(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        var metadata = EquipmentMetadataDto.DeserializeOrThrow(context.ServiceMetadata);

        var tier = config.RentalDurationType.ToLowerInvariant();
        var periodRate = tier == "daily"
            ? context.BasePrice
            : metadata.Pricing.GetRate(tier);

        var periodCount = RentalPricingCalculator.CalculatePeriodCount(
            context.StartDate, config.EndDate, tier);

        var rentalTotal = periodRate * periodCount;

        var draft = new EquipmentRentalDraft(
            RentalStartDate: context.StartDate,
            RentalEndDate: config.EndDate,
            RentalDurationType: config.RentalDurationType,
            PeriodRate: periodRate,
            PeriodCount: periodCount,
            DepositAmount: metadata.DepositAmount);

        return new BookingCategoryResult(
            ServicePrice: rentalTotal,
            ServiceLocationOverride: "home",
            StockDelta: -1,
            CategoryData: draft);
    }

    // ==================== Apply to Booking ====================

    /// <inheritdoc />
    public void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext)
    {
        var draft = (EquipmentRentalDraft)result.CategoryData!;

        booking.EquipmentRental = new EquipmentRental
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            EquipmentName = applyContext.ServiceName,
            RentalStartDate = draft.RentalStartDate,
            RentalEndDate = draft.RentalEndDate,
            RentalDurationType = draft.RentalDurationType,
            PeriodRate = draft.PeriodRate,
            PeriodCount = draft.PeriodCount,
            DepositAmount = draft.DepositAmount,
            DepositPaid = false,
            DepositReturned = false,
        };
    }

    // ==================== Apply to Response ====================

    /// <inheritdoc />
    public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
    {
        var draft = (EquipmentRentalDraft)result.CategoryData!;

        response.EquipmentRental = new CreateBookingEquipmentRentalResponse
        {
            EndDate = draft.RentalEndDate,
            RentalDurationType = draft.RentalDurationType,
            PeriodRate = draft.PeriodRate,
            PeriodCount = draft.PeriodCount,
            DepositAmount = draft.DepositAmount,
            DepositStatus = PaymentStatuses.Pending,
        };
    }

    // ==================== Cancellation ====================

    /// <inheritdoc />
    public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
    {
        // Reverse the stock decrement performed at booking creation (StockDelta: -1 → +1).
        return new BookingCancellationResult(StockDelta: 1);
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Deserializes and validates the <c>TypeConfig</c> JSON element into an
    /// <see cref="EquipmentRentalBookingConfig"/>.
    /// </summary>
    private static EquipmentRentalBookingConfig DeserializeConfig(JsonElement? typeConfig)
    {
        if (typeConfig is null || typeConfig.Value.ValueKind == JsonValueKind.Null)
            throw new InvalidOperationException(
                "Equipment rentals require a typeConfig payload with endDate and rentalDurationType.");

        var raw = typeConfig.Value.GetRawText();

        EquipmentRentalBookingConfig? config;
        try
        {
            config = JsonSerializer.Deserialize<EquipmentRentalBookingConfig>(raw, JsonOptions);
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "Invalid typeConfig format for equipment rental booking.", ex);
        }

        if (config is null)
            throw new InvalidOperationException(
                "typeConfig deserialized to null. Provide endDate and rentalDurationType.");

        if (config.EndDate == default)
            throw new InvalidOperationException("typeConfig.endDate is required for equipment rentals.");

        if (string.IsNullOrWhiteSpace(config.RentalDurationType))
            throw new InvalidOperationException("typeConfig.rentalDurationType is required for equipment rentals.");

        return config;
    }
}
