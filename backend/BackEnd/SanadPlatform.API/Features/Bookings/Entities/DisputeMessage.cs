using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a message within a booking dispute.
/// </summary>
public class DisputeMessage : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid DisputeId { get; set; }

    public Guid SenderId { get; set; }

    public string Message { get; set; } = string.Empty;

    public List<string> AttachmentUrls { get; set; } = new();

    public bool IsInternal { get; set; } = false;

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Dispute Dispute { get; set; } = null!;
}
