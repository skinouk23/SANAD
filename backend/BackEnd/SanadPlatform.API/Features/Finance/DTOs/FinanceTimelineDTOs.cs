using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Finance.DTOs;

/// <summary>
/// Shared query-string request for finance timeline endpoints.
/// </summary>
public class GetFinanceTimelineRequest
{
    public Guid? ProviderId { get; init; }

    public Guid? BookingId { get; init; }

    public string? Type { get; init; }

    public string? Status { get; init; }

    public DateTime? DateFrom { get; init; }

    public DateTime? DateTo { get; init; }

    public int Page { get; init; } = 1;

    public int Limit { get; init; } = 20;

    public string? Sort { get; init; }
}

/// <summary>
/// Public finance timeline row returned by read APIs.
/// </summary>
public record FinanceTimelineItemResponse
{
    public Guid Id { get; init; }

    public string Type { get; init; } = string.Empty;

    public string Direction { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public string Currency { get; init; } = string.Empty;

    public string Title { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public DateTime OccurredAt { get; init; }

    public DateTime CreatedAt { get; init; }

    public string SourceType { get; init; } = string.Empty;

    public Guid SourceId { get; init; }

    public Guid? ProviderId { get; init; }

    public Guid? PatientId { get; init; }

    public Guid? BookingId { get; init; }

    public Guid? PaymentId { get; init; }

    public Guid? PaymentAttemptId { get; init; }

    public Guid? ProviderWalletTopUpId { get; init; }

    public Guid? LedgerTransactionId { get; init; }

    public string? ReferenceNumber { get; init; }
}

/// <summary>
/// Paginated finance timeline response payload.
/// </summary>
public record FinanceTimelineResponse
{
    public IReadOnlyList<FinanceTimelineItemResponse> Items { get; init; } = Array.Empty<FinanceTimelineItemResponse>();

    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Supported finance timeline sort modes.
/// </summary>
public enum FinanceTimelineSortOption
{
    OccurredAtDesc,
    CreatedAtDesc
}

/// <summary>
/// Canonical sort values accepted by finance timeline endpoints.
/// </summary>
public static class FinanceTimelineSortOptions
{
    public const string OccurredAtDesc = "occurredAt desc";
    public const string CreatedAtDesc = "createdAt desc";

    public static FinanceTimelineSortOption Parse(string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort))
        {
            return FinanceTimelineSortOption.OccurredAtDesc;
        }

        var normalized = sort.Trim();

        if (string.Equals(normalized, CreatedAtDesc, StringComparison.OrdinalIgnoreCase))
        {
            return FinanceTimelineSortOption.CreatedAtDesc;
        }

        return FinanceTimelineSortOption.OccurredAtDesc;
    }
}
