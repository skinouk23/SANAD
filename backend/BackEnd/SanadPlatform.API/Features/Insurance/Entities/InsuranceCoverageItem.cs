namespace SanadPlatform.API.Features.Insurance.Entities;

/// <summary>
/// Represents a single item within an insurance coverage section.
/// </summary>
public class InsuranceCoverageItem
{
    public Guid Id { get; set; }

    public Guid CoverageId { get; set; }

    public string Text { get; set; } = string.Empty;

    public string Limit { get; set; } = string.Empty;

    // ==================== Navigation Properties ====================

    public virtual InsuranceCoverage Coverage { get; set; } = null!;
}
