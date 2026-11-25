using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Finance.Entities;
using SanadPlatform.API.Features.Finance.Repository;

namespace SanadPlatform.API.Features.Finance.DTOs;

/// <summary>
/// Maps read-model timeline items into API response DTOs.
/// </summary>
internal static class FinanceTimelineResponseMapper
{
    public static FinanceTimelineResponse ToResponse(
        IReadOnlyList<FinanceTimelineItem> items,
        int totalCount,
        int page,
        int limit)
    {
        ArgumentNullException.ThrowIfNull(items);

        var normalizedPage = page < FinanceTimelineQuerySpec.DefaultPage
            ? FinanceTimelineQuerySpec.DefaultPage
            : page;
        var normalizedLimit = limit <= 0
            ? FinanceTimelineQuerySpec.DefaultLimit
            : limit;

        return new FinanceTimelineResponse
        {
            Items = items.Select(ToItemResponse).ToList().AsReadOnly(),
            Pagination = new PaginationMetadata
            {
                Page = normalizedPage,
                Limit = normalizedLimit,
                Total = totalCount,
                TotalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)normalizedLimit)
            }
        };
    }

    public static FinanceTimelineItemResponse ToItemResponse(FinanceTimelineItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        return new FinanceTimelineItemResponse
        {
            Id = item.Id,
            Type = item.Type,
            Direction = item.Direction,
            Status = item.Status,
            Amount = item.Amount,
            Currency = item.Currency,
            Title = item.Title,
            Description = item.Description,
            OccurredAt = item.OccurredAt,
            CreatedAt = item.CreatedAt,
            SourceType = item.SourceType,
            SourceId = item.SourceId,
            ProviderId = item.ProviderId,
            PatientId = item.PatientId,
            BookingId = item.BookingId,
            PaymentId = item.PaymentId,
            PaymentAttemptId = item.PaymentAttemptId,
            ProviderWalletTopUpId = item.ProviderWalletTopUpId,
            LedgerTransactionId = item.LedgerTransactionId,
            ReferenceNumber = item.ReferenceNumber
        };
    }
}
