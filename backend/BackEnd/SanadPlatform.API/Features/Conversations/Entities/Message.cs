using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Conversations.Entities;

/// <summary>
/// Represents a message in a conversation.
/// </summary>
public class Message : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ConversationId { get; set; }

    public Guid SenderId { get; set; }

    // ==================== Content ====================

    public string MessageType { get; set; } = "text";

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string Content { get; set; } = string.Empty;

    // ==================== Attachments ====================

    public string? AttachmentUrl { get; set; }

    public string? AttachmentName { get; set; }

    public int? AttachmentSizeBytes { get; set; }

    public string? AttachmentMimeType { get; set; }

    // ==================== Location ====================

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    // ==================== Status ====================

    public bool IsRead { get; set; } = false;

    public DateTime? ReadAt { get; set; }

    // ==================== Metadata ====================

    public string? Metadata { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Conversation Conversation { get; set; } = null!;
    public virtual User Sender { get; set; } = null!;
}
