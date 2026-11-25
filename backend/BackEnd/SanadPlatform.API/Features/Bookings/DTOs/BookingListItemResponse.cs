namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Unified booking list item returned by GET /api/v1/bookings for all roles.
/// Role-specific fields are null when not applicable to the caller's role.
/// </summary>
public record BookingListItemResponse
{
    // ==================== Shared Fields ====================

    public Guid Id { get; init; }

    public Guid? SessionId { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string? SessionStatus { get; init; }

    public string PaymentMethod { get; init; } = string.Empty;

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    /// <summary>Service location summary such as home, clinic, or remote.</summary>
    public string Type { get; init; } = string.Empty;

    /// <summary>The first session start (StartDate + DailyStartTime) for list sorting and legacy UI display.</summary>
    public DateTime ScheduledAt { get; init; }

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public TimeSpan DailyStartTime { get; init; }

    public TimeSpan? DailyEndTime { get; init; }

    public int? DailyDurationMinutes { get; init; }

    public int DayCount { get; init; }

    public decimal PerDaySubtotal { get; init; }

    public decimal PlatformFee { get; init; }

    public decimal TotalAmount { get; init; }

    public string Currency { get; init; } = "TND";

    /// <summary>Formatted delivery or visit address (line1 + city).</summary>
    public string? Address { get; init; }

    public ProviderBookingDeliveryLocationResponse Location { get; init; } = new();

    public BookingListServiceDto? Service { get; init; }

    public IReadOnlyList<BookingLineItemResponse> LineItems { get; init; } = [];

    public BookingSessionCountsResponse SessionCounts { get; init; } = new();

    /// <summary>Populated only for equipment_rental bookings.</summary>
    public EquipmentRentalResponse? EquipmentRental { get; init; }

    // ==================== Patient-Visible Fields ====================

    /// <summary>Provider details. Populated only when the caller is a Patient or Admin.</summary>
    public BookingListProviderDto? Provider { get; init; }

    /// <summary>Patient notes. Null for providers.</summary>
    public string? Notes { get; init; }

    /// <summary>
    /// 6-digit validation code. Null for providers; null for patients unless status is Completed or Validated.
    /// </summary>
    public string? ValidationCode { get; init; }

    /// <summary>Deadline after which the booking auto-validates without patient action. Null when status is not Completed.</summary>
    public DateTime? AutoValidateAt { get; init; }

    public DateTime? ProviderAcceptedAt { get; init; }

    public DateTime? ProviderDepartedAt { get; init; }

    public DateTime? ProviderArrivedAt { get; init; }

    public DateTime? ServiceStartedAt { get; init; }

    public DateTime? ServiceCompletedAt { get; init; }

    public DateTime? ValidatedAt { get; init; }

    public DateTime? CancelledAt { get; init; }

    public Guid? CancelledBy { get; init; }

    public string? CancellationReason { get; init; }

    public Guid? StatusChangedBy { get; init; }

    public string? StatusChangeReason { get; init; }

    /// <summary>Rating given by the patient. Null for providers or unrated bookings.</summary>
    public int? Rating { get; init; }

    /// <summary>Review comment given by the patient. Null for providers or unreviewed bookings.</summary>
    public string? ReviewComment { get; init; }

    // ==================== Provider-Visible Fields ====================

    /// <summary>Patient details. Populated only when the caller is a Provider.</summary>
    public BookingListPatientDto? Patient { get; init; }

    /// <summary>Provider's net earnings after platform commission. Null for patients.</summary>
    public decimal? ProviderAmount { get; init; }
}

/// <summary>Provider summary embedded in a booking list item (visible to patients).</summary>
public record BookingListProviderDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    /// <summary>Null when booking status is Cancelled.</summary>
    public string? Phone { get; init; }

    public decimal Rating { get; init; }
}

/// <summary>Patient summary embedded in a booking list item (visible to providers).</summary>
public record BookingListPatientDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    /// <summary>Null when booking status is Cancelled.</summary>
    public string? Phone { get; init; }
}

/// <summary>Primary service summary embedded in a booking list item.</summary>
public record BookingListServiceDto
{
    public string Name { get; init; } = string.Empty;

    public string Category { get; init; } = string.Empty;
}
