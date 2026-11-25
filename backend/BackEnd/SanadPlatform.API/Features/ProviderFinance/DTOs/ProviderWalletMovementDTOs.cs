using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.ProviderFinance.DTOs;

/// <summary>
/// Query-string parameters for the authenticated provider wallet movements endpoint.
/// </summary>
public class GetMyProviderWalletMovementsRequest
{
    /// <summary>
    /// One-based page number. Default: 1.
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Maximum items per page. Default: 10.
    /// </summary>
    public int Limit { get; set; } = 10;

    /// <summary>
    /// Optional movement type filter: <c>deposit</c> or <c>deduction</c>.
    /// </summary>
    public string? Type { get; set; }

    /// <summary>
    /// Optional free-text search across provider-facing movement text fields.
    /// </summary>
    public string? Search { get; set; }

    /// <summary>
    /// Optional calendar month filter using a 1-12 convention.
    /// </summary>
    public int? Month { get; set; }

    /// <summary>
    /// Optional calendar year filter.
    /// </summary>
    public int? Year { get; set; }
}

/// <summary>
/// Paginated provider wallet movements response.
/// </summary>
public record ProviderWalletMovementsResponse
{
    /// <summary>
    /// Movement rows for the requested page.
    /// </summary>
    public IReadOnlyList<ProviderWalletMovementResponse> Items { get; init; } = Array.Empty<ProviderWalletMovementResponse>();

    /// <summary>
    /// Pagination metadata for the filtered result set.
    /// </summary>
    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Aggregate stats for the authenticated provider wallet movements.
/// </summary>
public record ProviderWalletStatsResponse
{
    /// <summary>
    /// Total deposit amount for the current UTC month across the full provider-facing movement history.
    /// </summary>
    public decimal CurrentMonthDeposits { get; init; }

    /// <summary>
    /// Total deduction amount for the current UTC month across the full provider-facing movement history.
    /// </summary>
    public decimal CurrentMonthDeductions { get; init; }

    /// <summary>
    /// Currency code used for the wallet stats display.
    /// </summary>
    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;

    /// <summary>
    /// All years that contain at least one provider-facing movement.
    /// </summary>
    public IReadOnlyList<int> AvailableYears { get; init; } = Array.Empty<int>();
}
