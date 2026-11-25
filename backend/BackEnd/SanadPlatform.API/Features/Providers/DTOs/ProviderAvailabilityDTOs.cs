namespace SanadPlatform.API.Features.Providers.DTOs;

// ==================== Single-Date Request ====================

/// <summary>
/// Query-string parameters for checking a provider's availability on a specific date.
/// </summary>
public record GetProviderAvailabilityRequest
{
    public DateOnly Date { get; init; }

    public Guid? ServiceId { get; init; }
}

// ==================== Single-Date Response ====================

/// <summary>
/// Availability response showing open and blocked time slots for a provider on a given date,
/// plus dates that are fully unavailable within the provider's booking window.
/// </summary>
public record ProviderAvailabilityResponse
{
    public Guid ProviderId { get; init; }

    public DateOnly Date { get; init; }

    public IReadOnlyList<ProviderAvailabilityIntervalResponse> AvailableIntervals { get; init; } = [];

    public IReadOnlyList<string> AvailableSlots { get; init; } = [];

    public IReadOnlyList<ProviderAvailabilityIntervalResponse> UnavailableIntervals { get; init; } = [];

    public IReadOnlyList<string> UnavailableSlots { get; init; } = [];

    public IReadOnlyList<DateOnly> UnavailableDates { get; init; } = [];

    /// <summary>
    /// The provider's IANA timezone identifier used for this availability computation.
    /// </summary>
    public string Timezone { get; init; } = "Africa/Tunis";
}

/// <summary>
/// A provider availability interval represented in provider-local wall clock time.
/// </summary>
public record ProviderAvailabilityIntervalResponse
{
    public string StartTime { get; init; } = string.Empty;

    public string EndTime { get; init; } = string.Empty;
}

// ==================== Range Request ====================

/// <summary>
/// Query-string parameters for checking which daily start times remain valid
/// across a full booking date range.
/// </summary>
public record GetProviderRangeAvailabilityRequest
{
    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public List<Guid> ServiceIds { get; init; } = [];
}

// ==================== Range Response ====================

/// <summary>
/// Availability response for a multi-day booking package.
/// Only start times valid on every day in the selected range are returned.
/// </summary>
public record ProviderRangeAvailabilityResponse
{
    public Guid ProviderId { get; init; }

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public int DayCount { get; init; }

    public int DailyDurationMinutes { get; init; }

    public IReadOnlyList<string> AvailableStartTimes { get; init; } = [];

    /// <summary>
    /// The provider's IANA timezone identifier used for this availability computation.
    /// </summary>
    public string Timezone { get; init; } = "Africa/Tunis";
}

// ==================== Month Request ====================

/// <summary>
/// Query-string parameters for checking a provider's per-day slot counts for a calendar month.
/// </summary>
public record GetProviderMonthAvailabilityRequest
{
    public int Year { get; init; }

    public int Month { get; init; }

    public List<Guid> ServiceIds { get; init; } = [];
}

// ==================== Month Response ====================

/// <summary>
/// Availability response showing how many valid start times remain on each day of a calendar month.
/// </summary>
public record ProviderMonthAvailabilityResponse
{
    public Guid ProviderId { get; init; }

    public int Year { get; init; }

    public int Month { get; init; }

    public int DailyDurationMinutes { get; init; }

    /// <summary>
    /// The provider's IANA timezone identifier used for this availability computation.
    /// </summary>
    public string Timezone { get; init; } = "Africa/Tunis";

    /// <summary>
    /// The latest date for which bookings are accepted, derived from the provider's
    /// MaxBookingAdvanceDays setting. Null when the provider was not found (defensive).
    /// Format: yyyy-MM-dd.
    /// </summary>
    public DateOnly? MaxBookableDate { get; init; }

    public IReadOnlyList<ProviderMonthAvailabilityDayResponse> Days { get; init; } = [];
}

/// <summary>
/// Per-day month availability projection containing the number of valid start times for the day.
/// </summary>
public record ProviderMonthAvailabilityDayResponse
{
    public DateOnly Date { get; init; }

    public int SlotCount { get; init; }
}

// ==================== Internal Projections ====================

/// <summary>
/// Lightweight projection of a booking's time fields plus its service's duration,
/// used internally to compute time-slot overlap. Not exposed in API responses.
/// </summary>
public record BookingTimeSlotDto(
    TimeOnly StartTime,
    TimeOnly? EndTime,
    int? DurationMinutes,
    int? ServiceDurationMinutes);

/// <summary>
/// Lightweight projection of a booking's time fields including its date range,
/// used internally for batch-loaded time-slot overlap checks across a date range.
/// </summary>
public record BookingTimeSlotWithDateDto(
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly StartTime,
    TimeOnly? EndTime,
    int? DurationMinutes,
    int? ServiceDurationMinutes);

/// <summary>
/// Provider-local unavailability window request used by self-service CRUD endpoints.
/// </summary>
public record ProviderUnavailabilityUpsertRequest
{
    public DateTime StartDatetime { get; init; }

    public DateTime EndDatetime { get; init; }

    public bool IsAllDay { get; init; }

    public bool IsRecurring { get; init; }

    public string? RecurrenceRule { get; init; }

    public string? Reason { get; init; }

    public string? Notes { get; init; }
}

/// <summary>
/// Provider-local unavailability response returned by self-service CRUD endpoints.
/// </summary>
public record ProviderUnavailabilityResponse
{
    public Guid Id { get; init; }

    public DateTime StartDatetime { get; init; }

    public DateTime EndDatetime { get; init; }

    public bool IsAllDay { get; init; }

    public bool IsRecurring { get; init; }

    public string? RecurrenceRule { get; init; }

    public string? Reason { get; init; }

    public string? Notes { get; init; }
}

/// <summary>
/// Provider weekly schedule interval request for self-service bulk replace operations.
/// </summary>
public record ProviderScheduleIntervalRequest
{
    public DayOfWeek DayOfWeek { get; init; }

    public Guid? ServiceId { get; init; }

    public TimeOnly StartTime { get; init; }

    public TimeOnly EndTime { get; init; }
}

/// <summary>
/// Provider weekly schedule interval response for self-service schedule reads.
/// </summary>
public record ProviderScheduleIntervalResponse
{
    public Guid Id { get; init; }

    public DayOfWeek DayOfWeek { get; init; }

    public Guid? ServiceId { get; init; }

    public TimeOnly StartTime { get; init; }

    public TimeOnly EndTime { get; init; }
}
