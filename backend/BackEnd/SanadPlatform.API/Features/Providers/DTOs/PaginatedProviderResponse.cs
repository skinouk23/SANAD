using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Paginated response wrapper for provider listings.
/// Used by GetPaginatedProviders, GetAvailableProviders, and GetTopRatedProviders.
/// </summary>
public record PaginatedProviderResponse
{
    /// <summary>The provider items for the current page.</summary>
    public IReadOnlyList<ProviderResponse> Items { get; init; } = Array.Empty<ProviderResponse>();

    /// <summary>Pagination metadata (page, limit, total, totalPages).</summary>
    public PaginationMetadata Pagination { get; init; } = null!;
}
