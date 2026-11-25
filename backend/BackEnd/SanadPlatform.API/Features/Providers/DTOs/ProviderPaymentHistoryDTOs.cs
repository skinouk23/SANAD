using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Query-string request for the authenticated provider's payment history.
/// </summary>
public class GetMyProviderPaymentHistoryRequest
{
    public string? Status { get; init; }

    public string? Search { get; init; }

    public DateTime? DateFrom { get; init; }

    public DateTime? DateTo { get; init; }

    public int Page { get; init; } = 1;

    public int Limit { get; init; } = 10;

    public string? Sort { get; init; }
}

/// <summary>
/// Provider-facing booking payment history row.
/// </summary>
public record ProviderPaymentHistoryItemResponse
{
    public Guid Id { get; init; }

    public Guid BookingId { get; init; }

    public Guid? PaymentId { get; init; }

    public string BookingNumber { get; init; } = string.Empty;

    public Guid? PatientId { get; init; }

    public string PatientName { get; init; } = string.Empty;

    public string ServiceName { get; init; } = string.Empty;

    public string? ServiceCategory { get; init; }

    public string Status { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public decimal Commission { get; init; }

    public decimal NetAmount { get; init; }

    public string Currency { get; init; } = "TND";

    public string PaymentMethod { get; init; } = string.Empty;

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime? ProcessedAt { get; init; }
}

/// <summary>
/// Paginated response payload for provider payment history.
/// </summary>
public record ProviderPaymentHistoryResponse
{
    public IReadOnlyList<ProviderPaymentHistoryItemResponse> Items { get; init; } = Array.Empty<ProviderPaymentHistoryItemResponse>();

    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Aggregate provider payment history metrics for the finance page.
/// </summary>
public record ProviderPaymentHistoryStatsResponse
{
    public decimal TotalRevenue { get; init; }

    public decimal PendingAmount { get; init; }

    public int CompletedCount { get; init; }

    public decimal AverageTransaction { get; init; }

    public string Currency { get; init; } = "TND";
}

/// <summary>
/// Supported sort modes for provider payment history.
/// </summary>
public enum ProviderPaymentHistorySortOption
{
    CreatedAtDesc,
    ProcessedAtDesc
}

/// <summary>
/// Canonical sort values accepted by provider payment history endpoints.
/// </summary>
public static class ProviderPaymentHistorySortOptions
{
    public const string CreatedAtDesc = "createdAt desc";
    public const string ProcessedAtDesc = "processedAt desc";

    public static ProviderPaymentHistorySortOption Parse(string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort))
        {
            return ProviderPaymentHistorySortOption.CreatedAtDesc;
        }

        return string.Equals(sort.Trim(), ProcessedAtDesc, StringComparison.OrdinalIgnoreCase)
            ? ProviderPaymentHistorySortOption.ProcessedAtDesc
            : ProviderPaymentHistorySortOption.CreatedAtDesc;
    }
}
