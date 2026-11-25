using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Finance.Entities;

/// <summary>
/// Groups one canonical finance posting event.
/// </summary>
public class LedgerTransaction : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string ReferenceNumber { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public string Status { get; set; } = LedgerConstants.TransactionStatuses.Posted;

    public string Description { get; set; } = string.Empty;

    public string SourceType { get; set; } = string.Empty;

    public Guid SourceId { get; set; }

    public string Currency { get; set; } = "TND";

    public DateTime OccurredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedByUserId { get; set; }

    public string? IdempotencyKey { get; set; }

    public virtual ICollection<LedgerEntry> Entries { get; set; } = new List<LedgerEntry>();
}
