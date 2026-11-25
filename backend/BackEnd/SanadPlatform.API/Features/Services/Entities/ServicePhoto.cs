using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Services.Entities;

/// <summary>
/// Attaches a stored file to a provider service as a main or gallery photo.
/// </summary>
public class ServicePhoto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServiceId { get; set; }
    public Guid FileId { get; set; }
    public int SortOrder { get; set; }
    public bool IsMain { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual Service Service { get; set; } = null!;
    public virtual StoredFile File { get; set; } = null!;
}
