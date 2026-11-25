using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Entities;

namespace SanadPlatform.API.Features.Finance.Repository;

/// <summary>
/// Repository contract for read-only finance timeline queries.
/// </summary>
public interface IFinanceTimelineRepository
{
    Task<(IReadOnlyList<FinanceTimelineItem> Items, int TotalCount)> GetTimelineAsync(
        FinanceTimelineQuerySpec query,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<FinanceTimelineItem>> GetTimelineItemsAsync(
        FinanceTimelineQuerySpec query,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Read-only filter spec for the finance timeline view.
/// </summary>
public sealed record FinanceTimelineQuerySpec(
    Guid? ProviderId = null,
    Guid? PatientId = null,
    Guid? BookingId = null,
    string? Type = null,
    string? Status = null,
    DateTime? DateFrom = null,
    DateTime? DateTo = null,
    int Page = 1,
    int Limit = 20,
    FinanceTimelineSortOption Sort = FinanceTimelineSortOption.OccurredAtDesc)
{
    public const int DefaultPage = 1;
    public const int DefaultLimit = 20;
    public const int MaxLimit = 100;

    public FinanceTimelineQuerySpec Normalize()
    {
        return this with
        {
            Type = NormalizeValue(Type),
            Status = NormalizeValue(Status),
            Page = Page < DefaultPage ? DefaultPage : Page,
            Limit = Limit <= 0 ? DefaultLimit : Math.Min(Limit, MaxLimit)
        };
    }

    private static string? NormalizeValue(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
