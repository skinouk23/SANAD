using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Finance.Entities;

/// <summary>
/// Canonical finance account definition.
/// </summary>
public class Account : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<LedgerEntry> LedgerEntries { get; set; } = new List<LedgerEntry>();
}
