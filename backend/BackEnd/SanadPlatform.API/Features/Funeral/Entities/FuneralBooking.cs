using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Funeral.Entities;

/// <summary>
/// Represents funeral-specific booking details.
/// </summary>
public class FuneralBooking : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid BookingId { get; set; }

    // ==================== Deceased ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string DeceasedName { get; set; } = string.Empty;

    public string? DeceasedAge { get; set; }

    public string? DeceasedBirthDate { get; set; }

    public string? DeceasedDeathDate { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? DeathPlace { get; set; }

    public string? Religion { get; set; }

    // ==================== Contact ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string ContactName { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string ContactPhone { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? ContactEmail { get; set; }

    public string? ContactRelationship { get; set; }

    // ==================== Ceremony ====================

    public string? CeremonyType { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? CeremonyLocation { get; set; }

    public string? BurialType { get; set; }

    public bool RequiresRepatriation { get; set; }

    public string? RepatriationCountry { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? SpecialRequests { get; set; }

    // ==================== Additional Services ====================

    public bool FloralService { get; set; }

    public bool TransportService { get; set; }

    public bool AdminAssistance { get; set; }

    public bool GriefSupport { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
