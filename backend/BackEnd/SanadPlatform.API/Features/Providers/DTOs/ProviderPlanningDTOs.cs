using SanadPlatform.API.Features.Bookings.DTOs;

namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Composite provider planning payload for self-service calendar views.
/// </summary>
public record ProviderPlanningResponse
{
    public string Timezone { get; init; } = "Africa/Tunis";

    /// <summary>
    /// Normalized provider presence flag for online/offline UI state.
    /// </summary>
    public bool IsOnline { get; init; }

    /// <summary>
    /// Raw provider availability label persisted on the provider profile.
    /// </summary>
    public string AvailabilityStatus { get; init; } = "offline";

    public IReadOnlyList<ProviderScheduleIntervalResponse> Schedules { get; init; } = [];

    public IReadOnlyList<ProviderUnavailabilityResponse> Unavailabilities { get; init; } = [];

    public IReadOnlyList<ProviderPlanningBookingResponse> Bookings { get; init; } = [];
}

/// <summary>
/// Planning-specific provider booking item used by day, week, and month calendar views.
/// </summary>
public record ProviderPlanningBookingResponse
{
    public Guid Id { get; init; }

    public Guid BookingId { get; init; }

    public Guid? SessionId { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public string? SessionStatus { get; init; }

    public string PaymentMethod { get; init; } = string.Empty;

    public string Type { get; init; } = string.Empty;

    public DateTime ScheduledAt { get; init; }

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public TimeSpan DailyStartTime { get; init; }

    public TimeSpan? DailyEndTime { get; init; }

    public int? DailyDurationMinutes { get; init; }

    public int DayCount { get; init; }

    public decimal TotalAmount { get; init; }

    public string Currency { get; init; } = "TND";

    public string? Address { get; init; }

    public ProviderBookingDeliveryLocationResponse Location { get; init; } = new();

    public string? Notes { get; init; }

    public BookingListServiceDto? Service { get; init; }

    public BookingListPatientDto? Patient { get; init; }

    public decimal? ProviderAmount { get; init; }

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
}
