using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Providers.Repository;

/// <summary>
/// Canonical read repository for provider payment history.
/// Builds provider-facing revenue rows from booking and payment data without relying on the finance timeline view.
/// </summary>
public class ProviderPaymentHistoryRepository : IProviderPaymentHistoryRepository
{
    private static readonly string[] PendingPaymentStatuses =
    [
        PaymentConstants.Statuses.Pending,
        PaymentConstants.Statuses.Processing,
        PaymentConstants.Statuses.Reserved
    ];

    private readonly SanadDbContext _context;
    private readonly ILogger<ProviderPaymentHistoryRepository> _logger;

    public ProviderPaymentHistoryRepository(
        SanadDbContext context,
        ILogger<ProviderPaymentHistoryRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<(IReadOnlyList<ProviderPaymentHistoryItemResponse> Items, int Total)> GetPaymentHistoryAsync(
        Guid providerId,
        GetMyProviderPaymentHistoryRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var page = request.Page > 0 ? request.Page : 1;
        var limit = request.Limit > 0 ? request.Limit : 10;

        var query = BuildBaseQuery(providerId);
        query = ApplyFilters(query, request);
        query = ApplySort(query, request.Sort);

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(booking => new ProviderPaymentHistoryItemResponse
            {
                Id = booking.Payment!.Id,
                BookingId = booking.Id,
                PaymentId = booking.Payment!.Id,
                BookingNumber = booking.BookingNumber,
                PatientId = booking.PatientId,
                PatientName = booking.PatientName,
                ServiceName = booking.Service != null
                    ? booking.Service.Name
                    : booking.LineItems
                        .OrderBy(lineItem => lineItem.Id)
                        .Select(lineItem => lineItem.ServiceName)
                        .FirstOrDefault() ?? "Service",
                ServiceCategory = booking.Service != null
                    ? booking.Service.Category
                    : booking.LineItems
                        .OrderBy(lineItem => lineItem.Id)
                        .Select(lineItem => lineItem.ServiceCategory)
                        .FirstOrDefault(),
                Status = booking.Payment!.Status,
                Amount = booking.TotalAmount,
                Commission = booking.PlatformFee,
                NetAmount = booking.ProviderAmount,
                Currency = ProviderFinanceConstants.DefaultCurrency,
                PaymentMethod = booking.PaymentMethod,
                PaymentMethodType = booking.Payment!.MethodType,
                PaymentReferenceNumber = booking.Payment!.ReferenceNumber,
                CreatedAt = booking.Payment!.CreatedAt,
                ProcessedAt = booking.Payment!.SettledAt
                    ?? booking.Payment.FailedAt
                    ?? booking.Payment.CancelledAt
                    ?? booking.Payment.ExpiredAt
            })
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} provider payment-history rows for provider {ProviderId} (page {Page}, total {Total})",
            items.Count,
            providerId,
            page,
            total);

        return (items, total);
    }

    /// <inheritdoc />
    public async Task<ProviderPaymentHistoryStatsResponse> GetPaymentHistoryStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = BuildBaseQuery(providerId);

        var totalRevenue = await baseQuery
            .Where(booking => booking.Payment!.Status == PaymentConstants.Statuses.Settled)
            .SumAsync(booking => (decimal?)booking.ProviderAmount, cancellationToken)
            ?? 0.00m;

        var pendingAmount = await baseQuery
            .Where(booking => PendingPaymentStatuses.Contains(booking.Payment!.Status))
            .SumAsync(booking => (decimal?)booking.ProviderAmount, cancellationToken)
            ?? 0.00m;

        var completedCount = await baseQuery
            .Where(booking => booking.Payment!.Status == PaymentConstants.Statuses.Settled)
            .CountAsync(cancellationToken);

        var averageTransaction = await baseQuery
            .Where(booking => booking.Payment!.Status == PaymentConstants.Statuses.Settled)
            .AverageAsync(booking => (decimal?)booking.TotalAmount, cancellationToken)
            ?? 0.00m;

        var currency = await baseQuery
            .OrderByDescending(booking => booking.Payment!.CreatedAt)
            .Select(booking => booking.Payment!.Currency)
            .FirstOrDefaultAsync(cancellationToken)
            ?? ProviderFinanceConstants.DefaultCurrency;

        return new ProviderPaymentHistoryStatsResponse
        {
            TotalRevenue = totalRevenue,
            PendingAmount = pendingAmount,
            CompletedCount = completedCount,
            AverageTransaction = averageTransaction,
            Currency = currency
        };
    }

    private IQueryable<Booking> BuildBaseQuery(Guid providerId)
    {
        return _context.Bookings
            .AsNoTracking()
            .Where(booking => booking.ProviderId == providerId
                && booking.Payment != null
                && booking.Payment.Purpose == PaymentConstants.Purposes.BookingPayment);
    }

    private static IQueryable<Booking> ApplyFilters(
        IQueryable<Booking> query,
        GetMyProviderPaymentHistoryRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var normalizedStatus = request.Status.Trim().ToLowerInvariant();
            query = query.Where(booking => booking.Payment!.Status == normalizedStatus);
        }

        if (request.DateFrom.HasValue)
        {
            query = query.Where(booking => booking.Payment!.CreatedAt >= request.DateFrom.Value);
        }

        if (request.DateTo.HasValue)
        {
            query = query.Where(booking => booking.Payment!.CreatedAt <= request.DateTo.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var escaped = request.Search.Trim()
                .Replace(@"\", @"\\")
                .Replace("%", @"\%")
                .Replace("_", @"\_");
            var pattern = $"%{escaped}%";

            query = query.Where(booking =>
                EF.Functions.ILike(booking.BookingNumber, pattern, @"\\") ||
                EF.Functions.ILike(booking.PatientName, pattern, @"\\") ||
                EF.Functions.ILike(booking.Payment!.ReferenceNumber, pattern, @"\\") ||
                EF.Functions.ILike(booking.PaymentMethod, pattern, @"\\") ||
                EF.Functions.ILike(booking.Payment.MethodType, pattern, @"\\") ||
                (booking.Service != null && EF.Functions.ILike(booking.Service.Name, pattern, @"\\")) ||
                booking.LineItems.Any(lineItem => EF.Functions.ILike(lineItem.ServiceName, pattern, @"\\")));
        }

        return query;
    }

    private static IQueryable<Booking> ApplySort(IQueryable<Booking> query, string? sort)
    {
        return ProviderPaymentHistorySortOptions.Parse(sort) switch
        {
            ProviderPaymentHistorySortOption.ProcessedAtDesc => query
                .OrderByDescending(booking => booking.Payment!.SettledAt
                    ?? booking.Payment.FailedAt
                    ?? booking.Payment.CancelledAt
                    ?? booking.Payment.ExpiredAt
                    ?? booking.Payment.CreatedAt)
                .ThenByDescending(booking => booking.Payment!.CreatedAt),

            _ => query
                .OrderByDescending(booking => booking.Payment!.CreatedAt)
                .ThenByDescending(booking => booking.Id)
        };
    }
}
