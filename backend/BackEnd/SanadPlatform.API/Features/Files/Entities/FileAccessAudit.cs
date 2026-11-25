using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Files.Entities;

/// <summary>
/// Security-relevant audit entry for file operations.
/// </summary>
public class FileAccessAudit : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FileId { get; set; }
    public Guid? ActorUserId { get; set; }
    public string? ActorRole { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Outcome { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? CorrelationId { get; set; }
    public string? DetailsJson { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual StoredFile File { get; set; } = null!;
}
