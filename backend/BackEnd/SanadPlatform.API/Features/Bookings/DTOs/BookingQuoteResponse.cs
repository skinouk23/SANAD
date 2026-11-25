namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response DTO returned by POST /api/v1/bookings/quote.
/// </summary>
public class BookingQuoteResponse
{
    public string BookingType { get; init; } = string.Empty;

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public int DayCount { get; init; }

    public int DailyDurationMinutes { get; init; }

    // ==================== Pricing ====================

    public CreateBookingPricingResponse Pricing { get; init; } = new();

    // ==================== Payment availability ====================

    public bool CashAvailable { get; init; } = true;

    public string? CashUnavailableReasonCode { get; init; }

    // ==================== Equipment Rental ====================

    public CreateBookingEquipmentRentalResponse? EquipmentRental { get; init; }
}
