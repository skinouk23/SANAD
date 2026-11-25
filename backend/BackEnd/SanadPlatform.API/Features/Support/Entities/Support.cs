using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Support.Entities;

/// <summary>
/// Represents a support ticket.
/// </summary>
public class SupportTicket : IAuditableEntity
{
    public Guid Id { get; set; }

    public string TicketNumber { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    // ==================== Details ====================

    public string Category { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    // ==================== Priority ====================

    public string Priority { get; set; } = "normal";

    // ==================== Status ====================

    public string Status { get; set; } = "open";

    // ==================== Assignment ====================

    public Guid? AssignedTo { get; set; }

    public DateTime? AssignedAt { get; set; }

    // ==================== Resolution ====================

    public string? Resolution { get; set; }

    public DateTime? ResolvedAt { get; set; }

    // ==================== Related Entities ====================

    public Guid? BookingId { get; set; }

    // ==================== Satisfaction ====================

    public int? SatisfactionRating { get; set; }

    public string? SatisfactionFeedback { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;

    public virtual ICollection<SupportTicketMessage> Messages { get; set; } = new List<SupportTicketMessage>();
}

/// <summary>
/// Represents a message in a support ticket.
/// </summary>
public class SupportTicketMessage : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid TicketId { get; set; }

    public Guid SenderId { get; set; }

    // ==================== Content ====================

    public string Message { get; set; } = string.Empty;

    // ==================== Attachments ====================

    public List<string>? AttachmentUrls { get; set; }

    // ==================== Internal Note ====================

    public bool IsInternal { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual SupportTicket Ticket { get; set; } = null!;

    public virtual User Sender { get; set; } = null!;
}
