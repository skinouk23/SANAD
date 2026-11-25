namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response DTO returned by POST /api/v1/bookings.
/// </summary>
public class CreateBookingResponse
{
    public Guid Id { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    /// <summary>Service category used as the booking type label (for example <c>equipment_rental</c>).</summary>
    public string BookingType { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string PaymentMethod { get; init; } = string.Empty;

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    public DateTime ScheduledAt { get; init; }

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public TimeOnly DailyStartTime { get; init; }

    public TimeOnly? DailyEndTime { get; init; }

    public int DailyDurationMinutes { get; init; }

    public int DayCount { get; init; }

    // ==================== Pricing ====================

    public CreateBookingPricingResponse Pricing { get; init; } = new();

    // ==================== Equipment Rental ====================

    public CreateBookingEquipmentRentalResponse? EquipmentRental { get; set; }

    // ==================== Validation ====================

    public string? ValidationCode { get; init; }

    // ==================== Related Parties ====================

    public BookingPartyResponse Provider { get; init; } = new();

    public BookingServiceResponse? Service { get; init; }

    // ==================== Selected Services ====================

    public IReadOnlyList<BookingLineItemResponse> ServiceItems { get; init; } = [];

    public BookingSessionCountsResponse SessionCounts { get; init; } = new();

    public IReadOnlyList<BookingSessionResponse> Sessions { get; init; } = [];
}

/// <summary>Pricing block for the create-booking response.</summary>
public class CreateBookingPricingResponse
{
    public decimal PerDaySubtotal { get; init; }

    public decimal BookingSubtotal { get; init; }

    public decimal PlatformFee { get; init; }

    public decimal TotalAmount { get; init; }

    public string Currency { get; init; } = "TND";
}

/// <summary>Equipment rental block for the create-booking response.</summary>
public class CreateBookingEquipmentRentalResponse
{
    public DateOnly EndDate { get; init; }

    public string RentalDurationType { get; init; } = string.Empty;

    public decimal PeriodRate { get; init; }

    public int PeriodCount { get; init; }

    public decimal DepositAmount { get; init; }

    public string DepositStatus { get; init; } = "pending";
}

/// <summary>Minimal provider or patient party reference embedded in responses.</summary>
public class BookingPartyResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;
}

/// <summary>Minimal service reference embedded in responses.</summary>
public class BookingServiceResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;
}
