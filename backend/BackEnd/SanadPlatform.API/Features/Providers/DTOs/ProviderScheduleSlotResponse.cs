namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// A single day's available time slots in a provider's schedule.
/// </summary>
public record ProviderScheduleSlotResponse
{
    /// <summary>The date (ISO format, e.g. "2026-04-07").</summary>
    public string Date { get; init; } = string.Empty;

    /// <summary>Available intervals for that day (e.g. 09:00-12:00, 13:00-17:00).</summary>
    public IReadOnlyList<ProviderAvailabilityIntervalResponse> AvailableIntervals { get; init; } = Array.Empty<ProviderAvailabilityIntervalResponse>();

    /// <summary>Available time slots for that day (e.g. "09:00", "10:30").</summary>
    public IReadOnlyList<string> AvailableSlots { get; init; } = Array.Empty<string>();
}
