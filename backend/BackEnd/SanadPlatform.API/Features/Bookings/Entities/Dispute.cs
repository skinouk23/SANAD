using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a dispute raised against a booking.
/// </summary>
public class Dispute : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string DisputeNumber { get; set; } = string.Empty;

    public Guid BookingId { get; set; }

    public Guid? PaymentId { get; set; }

    // ==================== Parties ====================

    public Guid ReportedBy { get; set; }

    public Guid ReportedAgainst { get; set; }

    // ==================== Details ====================

    public string Reason { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public List<string> EvidenceUrls { get; set; } = new();

    // ==================== Status ====================

    public string Status { get; set; } = "open";

    // ==================== Resolution ====================

    public string? Resolution { get; set; }

    public decimal? ResolutionAmount { get; set; }

    public Guid? ResolvedBy { get; set; }

    public DateTime? ResolvedAt { get; set; }

    // ==================== Escalation ====================

    public bool IsEscalated { get; set; } = false;

    public DateTime? EscalatedAt { get; set; }

    public Guid? EscalatedTo { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
    public virtual ICollection<DisputeMessage> Messages { get; set; } = new List<DisputeMessage>();
}
