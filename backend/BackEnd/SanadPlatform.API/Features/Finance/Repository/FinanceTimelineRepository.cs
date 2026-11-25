using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Finance.Repository;

/// <summary>
/// EF Core repository for the finance timeline SQL view.
/// </summary>
public class FinanceTimelineRepository : IFinanceTimelineRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<FinanceTimelineRepository> _logger;

    public FinanceTimelineRepository(
        SanadDbContext context,
        ILogger<FinanceTimelineRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<(IReadOnlyList<FinanceTimelineItem> Items, int TotalCount)> GetTimelineAsync(
        FinanceTimelineQuerySpec query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var normalizedQuery = query.Normalize();
        var filteredQuery = ApplyFilters(_context.FinanceTimelineItems.AsNoTracking(), normalizedQuery);
        var totalCount = await filteredQuery.CountAsync(cancellationToken);
        var items = await ApplySorting(filteredQuery, normalizedQuery)
            .Skip((normalizedQuery.Page - 1) * normalizedQuery.Limit)
            .Take(normalizedQuery.Limit)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} finance timeline items (Total {Total})",
            items.Count,
            totalCount);

        return (items.AsReadOnly(), totalCount);
    }

    public async Task<IReadOnlyList<FinanceTimelineItem>> GetTimelineItemsAsync(
        FinanceTimelineQuerySpec query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var normalizedQuery = query.Normalize();
        var filteredQuery = ApplyFilters(_context.FinanceTimelineItems.AsNoTracking(), normalizedQuery);
        var items = await ApplySorting(filteredQuery, normalizedQuery).ToListAsync(cancellationToken);
        return items.AsReadOnly();
    }

    private static IQueryable<FinanceTimelineItem> ApplyFilters(
        IQueryable<FinanceTimelineItem> queryable,
        FinanceTimelineQuerySpec query)
    {
        if (query.ProviderId.HasValue)
        {
            queryable = queryable.Where(item => item.ProviderId == query.ProviderId.Value);
        }

        if (query.PatientId.HasValue)
        {
            queryable = queryable.Where(item => item.PatientId == query.PatientId.Value);
        }

        if (query.BookingId.HasValue)
        {
            queryable = queryable.Where(item => item.BookingId == query.BookingId.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            queryable = queryable.Where(item => item.Type == query.Type);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            queryable = queryable.Where(item => item.Status == query.Status);
        }

        if (query.DateFrom.HasValue)
        {
            queryable = queryable.Where(item => item.OccurredAt >= query.DateFrom.Value);
        }

        if (query.DateTo.HasValue)
        {
            queryable = queryable.Where(item => item.OccurredAt <= query.DateTo.Value);
        }

        return queryable;
    }

    private static IQueryable<FinanceTimelineItem> ApplySorting(
        IQueryable<FinanceTimelineItem> queryable,
        FinanceTimelineQuerySpec query)
    {
        return query.Sort switch
        {
            FinanceTimelineSortOption.CreatedAtDesc => queryable
                .OrderByDescending(item => item.CreatedAt)
                .ThenByDescending(item => item.Id),
            _ => queryable
                .OrderByDescending(item => item.OccurredAt)
                .ThenByDescending(item => item.Id)
        };
    }
}
