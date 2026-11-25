using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Services.Entities;

/// <summary>
/// Represents a service offered by a provider.
/// Soft-deletable to preserve referential integrity with historical bookings.
/// </summary>
public class Service : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }

    // ==================== Basic Info ====================

    /// <summary>
    /// Provider-inherited service category (e.g., "nursing", "physiotherapy"). Free-form string.
    /// </summary>
    public string Category { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? ShortDescription { get; set; }

    // ==================== Pricing ====================

    public decimal Price { get; set; }

    /// <summary>
    /// Pricing model: "fixed", "hourly", or "range".
    /// </summary>
    public string PriceType { get; set; } = "fixed";

    public string Currency { get; set; } = "TND";

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    // ==================== Duration ====================

    public int? DurationMinutes { get; set; }

    public int? MinDurationMinutes { get; set; }

    public int? MaxDurationMinutes { get; set; }

    // ==================== Location ====================

    /// <summary>
    /// Where the service is delivered: "home", "clinic", or "both".
    /// </summary>
    public string ServiceLocation { get; set; } = "home";

    // ==================== Availability ====================

    public bool IsActive { get; set; } = true;

    public bool IsFeatured { get; set; } = false;

    // ==================== Requirements ====================

    public bool RequiresPrescription { get; set; } = false;

    public bool IsUrgent { get; set; } = false;

    public bool RequiresMedicalHistory { get; set; } = false;

    public int? AgeRestrictionMin { get; set; }

    public int? AgeRestrictionMax { get; set; }

    // ==================== Media ====================

    public Guid? MainImageFileId { get; set; }

    // ==================== Stats ====================

    /// <summary>
    /// Denormalized total number of completed bookings for this service.
    /// </summary>
    public int BookingCount { get; set; } = 0;

    /// <summary>
    /// Denormalized count of available units for equipment rental services.
    /// Null for non-equipment services. Calculated as total stock minus active rentals.
    /// Updated when equipment bookings are created, completed, or cancelled.
    /// </summary>
    public int? AvailableQuantity { get; set; }

    // ==================== Category-specific Fields ====================

    /// <summary>
    /// JSON string holding type-specific configuration (stored as JSONB in the database).
    /// Schema varies by service category.
    /// </summary>
    public string? Metadata { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
    public virtual ICollection<ServiceAddon> Addons { get; set; } = new List<ServiceAddon>();
    public virtual ICollection<ServicePhoto> Photos { get; set; } = new List<ServicePhoto>();
}
