namespace SanadPlatform.API.Features.Pharmacy.DTOs;

/// <summary>
/// Patient-side pharmacy order statistics.
/// Matches the frontend <c>PharmacyOrderStatsSchema</c>: activeCount, completedCount, totalSpent.
/// </summary>
public record PharmacyOrderStatsResponse
{
    /// <summary>Number of orders that are not yet completed (Pending, Processing, Delivery).</summary>
    public int ActiveCount { get; init; }

    /// <summary>Number of completed orders.</summary>
    public int CompletedCount { get; init; }

    /// <summary>Formatted total amount spent across all completed orders.</summary>
    public string TotalSpent { get; init; } = "0.00";
}
