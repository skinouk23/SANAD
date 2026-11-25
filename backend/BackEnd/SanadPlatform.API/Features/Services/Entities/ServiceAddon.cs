using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Services.Entities;

/// <summary>
/// Represents a service add-on (optional extras or supplements).
/// Soft-deletable to preserve referential integrity with historical bookings.
/// </summary>
public class ServiceAddon : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ServiceId { get; set; }

    // ==================== Addon Info ====================

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int? DurationMinutes { get; set; }

    /// <summary>
    /// Icon identifier for the add-on (e.g., "syringe", "bandage").
    /// </summary>
    public string? Icon { get; set; }

    /// <summary>
    /// Whether this add-on is a supplement (always included) vs. an optional extra.
    /// </summary>
    public bool IsSupplement { get; set; } = false;

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Service Service { get; set; } = null!;
}
