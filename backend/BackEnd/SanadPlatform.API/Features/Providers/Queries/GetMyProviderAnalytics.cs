using System.Globalization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns provider-scoped analytics for the authenticated provider.
/// </summary>
public record GetMyProviderAnalyticsQuery(Guid UserId, string Period) : IRequest<ProviderAnalyticsResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderAnalyticsQuery"/>.
/// </summary>
public class GetMyProviderAnalyticsHandler : IRequestHandler<GetMyProviderAnalyticsQuery, ProviderAnalyticsResponse>
{
    private static readonly BookingStatus[] ActivityStatuses =
    [
        BookingStatus.Pending,
        BookingStatus.Confirmed,
        BookingStatus.ProviderOnWay,
        BookingStatus.InProgress,
        BookingStatus.Completed,
        BookingStatus.Validated
    ];

    private readonly SanadDbContext _db;
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;
    private readonly ILogger<GetMyProviderAnalyticsHandler> _logger;

    public GetMyProviderAnalyticsHandler(
        SanadDbContext db,
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository,
        ILogger<GetMyProviderAnalyticsHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderAnalyticsResponse> Handle(
        GetMyProviderAnalyticsQuery query,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(query.UserId, cancellationToken);
        if (provider is null)
        {
            _logger.LogWarning("Provider profile not found for user {UserId}.", query.UserId);
            throw new KeyNotFoundException("Provider profile not found");
        }

        var providerTimezone = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone ?? "Africa/Tunis");
        var localToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, providerTimezone));
        var normalizedPeriod = query.Period.Trim().ToLowerInvariant();
        var window = ResolveWindow(normalizedPeriod, localToday);
        var now = DateTime.UtcNow;

        var bookings = await _db.Bookings
            .AsNoTracking()
            .Where(booking => booking.ProviderId == provider.Id
                && booking.StartDate >= window.StartDate
                && booking.StartDate <= window.EndDate
                && ActivityStatuses.Contains(booking.Status))
            .Select(booking => new ProviderAnalyticsBookingProjection(
                booking.StartDate,
                booking.PatientId,
                booking.Status,
                booking.ProviderAmount,
                booking.City))
            .ToListAsync(cancellationToken);

        var walletSummary = await BuildWalletSummaryAsync(provider.Id, cancellationToken);
        var walletActivity = await BuildWalletActivityAsync(provider.Id, now, cancellationToken);

        return new ProviderAnalyticsResponse
        {
            Overview = new ProviderAnalyticsOverview
            {
                Revenue = bookings
                    .Where(booking => booking.Status is BookingStatus.Completed or BookingStatus.Validated)
                    .Sum(booking => booking.ProviderAmount),
                Appointments = bookings.Count,
                UniquePatients = bookings
                    .Select(booking => booking.PatientId)
                    .Distinct()
                    .Count(),
                AverageRating = provider.RatingAverage,
                ReviewCount = provider.RatingCount
            },
            RevenueSeries = BuildRevenueSeries(bookings, normalizedPeriod, window),
            TopZones = BuildTopZones(bookings),
            AppointmentsByStatus = BuildAppointmentsByStatus(bookings),
            WalletSummary = walletSummary,
            WalletActivity = walletActivity
        };
    }

    private async Task<ProviderAnalyticsWalletSummary> BuildWalletSummaryAsync(
        Guid providerId,
        CancellationToken cancellationToken)
    {
        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(providerId, cancellationToken);
        var currency = ProviderFinanceConstants.DefaultCurrency;

        var reservedBalance = snapshot.ReservedBalance;
        var usableBalance = snapshot.UsableBalance;

        return new ProviderAnalyticsWalletSummary
        {
            ReservedBalance = reservedBalance,
            UsableBalance = usableBalance,
            Currency = currency
        };
    }

    private async Task<ProviderAnalyticsWalletActivity> BuildWalletActivityAsync(
        Guid providerId,
        DateTime asOfUtc,
        CancellationToken cancellationToken)
    {
        var activity = await _providerFinanceRepository.GetWalletActivitySnapshotAsync(providerId, asOfUtc, cancellationToken);

        return new ProviderAnalyticsWalletActivity
        {
            CurrentMonthDeposits = activity.CurrentMonthDeposits,
            CurrentMonthDeductions = activity.CurrentMonthDeductions
        };
    }

    private static ProviderAnalyticsAppointmentsByStatus BuildAppointmentsByStatus(
        IReadOnlyList<ProviderAnalyticsBookingProjection> bookings)
    {
        var pending = bookings.Count(booking => booking.Status == BookingStatus.Pending);
        var confirmed = bookings.Count(booking => booking.Status is BookingStatus.Confirmed or BookingStatus.ProviderOnWay or BookingStatus.InProgress);
        var completed = bookings.Count(booking => booking.Status is BookingStatus.Completed or BookingStatus.Validated);

        return new ProviderAnalyticsAppointmentsByStatus
        {
            Pending = pending,
            Confirmed = confirmed,
            Completed = completed,
            Total = pending + confirmed + completed
        };
    }

    private static IReadOnlyList<ProviderAnalyticsTopZone> BuildTopZones(
        IReadOnlyList<ProviderAnalyticsBookingProjection> bookings)
    {
        var groupedZones = bookings
            .Where(booking => !string.IsNullOrWhiteSpace(booking.City))
            .Select(booking => booking.City!.Trim())
            .GroupBy(city => city, StringComparer.OrdinalIgnoreCase)
            .Select(group => new
            {
                City = group.First(),
                BookingCount = group.Count()
            })
            .OrderByDescending(zone => zone.BookingCount)
            .ThenBy(zone => zone.City, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var totalZonedBookings = groupedZones.Sum(zone => zone.BookingCount);
        if (totalZonedBookings == 0)
        {
            return Array.Empty<ProviderAnalyticsTopZone>();
        }

        return groupedZones
            .Select(zone => new ProviderAnalyticsTopZone
            {
                City = zone.City,
                BookingCount = zone.BookingCount,
                Percentage = Math.Round((decimal)zone.BookingCount / totalZonedBookings * 100m, 2)
            })
            .ToList()
            .AsReadOnly();
    }

    private static IReadOnlyList<ProviderAnalyticsRevenueSeriesPoint> BuildRevenueSeries(
        IReadOnlyList<ProviderAnalyticsBookingProjection> bookings,
        string normalizedPeriod,
        AnalyticsWindow window)
    {
        return normalizedPeriod == "year"
            ? BuildMonthlyRevenueSeries(bookings, window.StartDate.Year)
            : BuildDailyRevenueSeries(bookings, window.StartDate, window.EndDate);
    }

    private static IReadOnlyList<ProviderAnalyticsRevenueSeriesPoint> BuildDailyRevenueSeries(
        IReadOnlyList<ProviderAnalyticsBookingProjection> bookings,
        DateOnly startDate,
        DateOnly endDate)
    {
        var revenueByDate = bookings
            .Where(booking => booking.Status is BookingStatus.Completed or BookingStatus.Validated)
            .GroupBy(booking => booking.StartDate)
            .ToDictionary(
                group => group.Key,
                group => group.Sum(booking => booking.ProviderAmount));

        var results = new List<ProviderAnalyticsRevenueSeriesPoint>();

        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            results.Add(new ProviderAnalyticsRevenueSeriesPoint
            {
                Label = date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Amount = revenueByDate.GetValueOrDefault(date, 0m)
            });
        }

        return results.AsReadOnly();
    }

    private static IReadOnlyList<ProviderAnalyticsRevenueSeriesPoint> BuildMonthlyRevenueSeries(
        IReadOnlyList<ProviderAnalyticsBookingProjection> bookings,
        int year)
    {
        var revenueByMonth = bookings
            .Where(booking => booking.Status is BookingStatus.Completed or BookingStatus.Validated)
            .GroupBy(booking => booking.StartDate.Month)
            .ToDictionary(
                group => group.Key,
                group => group.Sum(booking => booking.ProviderAmount));

        var results = new List<ProviderAnalyticsRevenueSeriesPoint>(capacity: 12);

        for (var month = 1; month <= 12; month++)
        {
            var bucket = new DateOnly(year, month, 1);
            results.Add(new ProviderAnalyticsRevenueSeriesPoint
            {
                Label = bucket.ToString("yyyy-MM", CultureInfo.InvariantCulture),
                Amount = revenueByMonth.GetValueOrDefault(month, 0m)
            });
        }

        return results.AsReadOnly();
    }

    private static AnalyticsWindow ResolveWindow(string normalizedPeriod, DateOnly localToday)
    {
        return normalizedPeriod switch
        {
            "week" => new AnalyticsWindow(GetWeekStart(localToday), GetWeekStart(localToday).AddDays(6)),
            "month" => ResolveCurrentMonthWindow(localToday),
            "year" => new AnalyticsWindow(new DateOnly(localToday.Year, 1, 1), new DateOnly(localToday.Year, 12, 31)),
            _ => throw new ArgumentException("Analytics period must be one of: week, month, year.", nameof(normalizedPeriod))
        };
    }

    private static AnalyticsWindow ResolveCurrentMonthWindow(DateOnly localToday)
    {
        var startDate = new DateOnly(localToday.Year, localToday.Month, 1);
        return new AnalyticsWindow(startDate, startDate.AddMonths(1).AddDays(-1));
    }

    private static DateOnly GetWeekStart(DateOnly date)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        var daysSinceMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
        return date.AddDays(-daysSinceMonday);
    }

    private sealed record ProviderAnalyticsBookingProjection(
        DateOnly StartDate,
        Guid PatientId,
        BookingStatus Status,
        decimal ProviderAmount,
        string? City);

    private sealed record AnalyticsWindow(DateOnly StartDate, DateOnly EndDate);
}
