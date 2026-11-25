using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Provider unavailability (exceptions, vacations).
/// </summary>
public class ProviderUnavailability : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }

    // ==================== Date/Time Range ====================

    public DateTime StartDatetime { get; set; }

    public DateTime EndDatetime { get; set; }

    // ==================== Recurrence ====================

    public bool IsAllDay { get; set; } = false;

    public bool IsRecurring { get; set; } = false;

    public string? RecurrenceRule { get; set; }

    // ==================== Details ====================

    public string? Reason { get; set; }

    public string? Notes { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
}
