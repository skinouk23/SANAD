namespace SanadPlatform.API.Common.Models;

/// <summary>
/// Common metadata for paginated API responses.
/// </summary>
public record PaginationMetadata
{
    /// <summary>
    /// Current 1-based page number.
    /// </summary>
    public int Page { get; init; }

    /// <summary>
    /// Maximum number of items per page.
    /// </summary>
    public int Limit { get; init; }

    /// <summary>
    /// Total count of matching items across all pages.
    /// </summary>
    public int Total { get; init; }

    /// <summary>
    /// Total number of pages available.
    /// </summary>
    public int TotalPages { get; init; }
}
