using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Conversations.Entities;

/// <summary>
/// Represents a conversation between a patient and provider.
/// Exactly one conversation exists per unique (PatientId, ProviderId) pair.
/// </summary>
public class Conversation : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // ==================== Participants ====================

    public Guid PatientId { get; set; }

    public Guid ProviderId { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Last Message Info (denormalized) ====================

    public DateTime? LastMessageAt { get; set; }

    public string? LastMessagePreview { get; set; }

    public Guid? LastMessageBy { get; set; }

    // ==================== Unread Counts ====================

    public int PatientUnreadCount { get; set; } = 0;

    public int ProviderUnreadCount { get; set; } = 0;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
    public virtual Provider Provider { get; set; } = null!;
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
