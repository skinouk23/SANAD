using System;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Tracks the history of a provider's availability status changes.
/// Required for the availability history API endpoint.
/// </summary>
public class ProviderAvailabilityHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }
    public virtual Provider Provider { get; set; } = null!;

    /// <summary>
    /// The new availability state.
    /// </summary>
    public bool IsAvailable { get; set; }

    /// <summary>
    /// The specific status label (e.g., "available", "busy", "vacation", "offline").
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// When the change occurred.
    /// </summary>
    public DateTime StatusChangedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// The reason provided for the status change.
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// The ID of the user who performed the change (Provider, Admin, or System).
    /// </summary>
    public Guid ChangedBy { get; set; }
    public virtual User ChangedByUser { get; set; } = null!;
}
