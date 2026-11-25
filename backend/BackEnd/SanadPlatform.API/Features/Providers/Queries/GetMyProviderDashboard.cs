using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Specifications;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to get the current authenticated provider's dashboard.
/// </summary>
public record GetMyProviderDashboardQuery(Guid UserId) : IRequest<ProviderDashboardResponse>;

/// <summary>
/// Handler for <see cref="GetMyProviderDashboardQuery"/>.
/// </summary>
public class GetMyProviderDashboardHandler : IRequestHandler<GetMyProviderDashboardQuery, ProviderDashboardResponse>
{
    private static readonly BookingStatus[] DashboardIncludedStatuses =
    [
        BookingStatus.Pending,
        BookingStatus.Confirmed,
        BookingStatus.ProviderOnWay,
        BookingStatus.InProgress,
        BookingStatus.Completed,
        BookingStatus.Validated
    ];

    private static readonly BookingStatus[] RevenueStatuses =
    [
        BookingStatus.Completed,
        BookingStatus.Validated
    ];

    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;
    private readonly ILogger<GetMyProviderDashboardHandler> _logger;

    public GetMyProviderDashboardHandler(
        IProviderRepository providerRepository,
        IBookingRepository bookingRepository,
        IProviderFinanceRepository providerFinanceRepository,
        ILogger<GetMyProviderDashboardHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderDashboardResponse> Handle(
        GetMyProviderDashboardQuery query,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(query.UserId, cancellationToken);
        if (provider == null)
        {
            _logger.LogWarning("Provider profile not found for user {UserId}.", query.UserId);
            throw new KeyNotFoundException("Provider profile not found");
        }

        var providerTimezone = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone ?? "Africa/Tunis");
        var utcNow = DateTime.UtcNow;
        var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, providerTimezone);
        var localToday = DateOnly.FromDateTime(localNow);
        var currentWeekStart = GetWeekStart(localToday);
        var currentWeekEnd = currentWeekStart.AddDays(6);
        var currentMonthStart = new DateOnly(localToday.Year, localToday.Month, 1);
        var currentMonthEnd = currentMonthStart.AddMonths(1).AddDays(-1);

        var currentWeekBookings = await GetBookingsAsync(
            provider.Id,
            currentWeekStart,
            currentWeekEnd,
            DashboardIncludedStatuses,
            cancellationToken);

        var todayBookings = await GetBookingsAsync(
            provider.Id,
            localToday,
            localToday,
            DashboardIncludedStatuses,
            cancellationToken);

        var currentMonthRevenueBookings = await GetBookingsAsync(
            provider.Id,
            currentMonthStart,
            currentMonthEnd,
            RevenueStatuses,
            cancellationToken);

        var walletSnapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(
            provider.Id,
            cancellationToken);

        var todayCount = todayBookings.Count;
        var weekCount = currentWeekBookings.Count;
        var completionRate = CalculateCompletionRate(currentWeekBookings);
        var thisWeekRevenue = SumProviderRevenue(currentWeekBookings, RevenueStatuses);
        var thisMonthRevenue = SumProviderRevenue(currentMonthRevenueBookings, RevenueStatuses);
        var providerName = !string.IsNullOrWhiteSpace(provider.BusinessName)
            ? provider.BusinessName
            : $"{provider.FirstName} {provider.LastName}".Trim();

        return new ProviderDashboardResponse
        {
            Provider = new ProviderDashboardProviderInfo
            {
                Id = provider.Id,
                Name = providerName,
                ProviderType = provider.ServiceCategory,
                Specialties = provider.Specializations,
                Rating = provider.RatingAverage,
                ReviewCount = provider.RatingCount,
                Available = provider.IsAvailable,
                IsVerified = provider.IsVerified,
                VerificationConsentGiven = provider.VerificationConsentGiven,
                VerificationStatus = provider.VerificationStatus,
                VerificationRequestedAt = provider.VerificationRequestedAt,
                VerificationReviewedAt = provider.VerificationReviewedAt,
                CanRequestVerification = ProviderConstants.CanRequestVerification(provider.VerificationStatus),
                SubscriptionTier = provider.SubscriptionTier,
                AvailableBalance = walletSnapshot.AvailableBalance
            },
            AppointmentStats = new ProviderDashboardAppointmentStats
            {
                TodayCount = todayCount,
                WeekCount = weekCount,
                CompletionRate = completionRate
            },
            RevenueStats = new ProviderDashboardRevenueStats
            {
                ThisWeekRevenue = thisWeekRevenue,
                ThisMonthRevenue = thisMonthRevenue
            }
        };
    }

    private async Task<IReadOnlyList<Booking>> GetBookingsAsync(
        Guid providerId,
        DateOnly overlapStartDate,
        DateOnly overlapEndDate,
        IReadOnlyCollection<BookingStatus> statuses,
        CancellationToken cancellationToken)
    {
        var specification = new ProviderScopedBookingSelectionSpecification(
            providerId,
            overlapStartDate,
            overlapEndDate,
            statuses);

        return await _bookingRepository.GetBookingsAsync(specification, cancellationToken);
    }

    private static DateOnly GetWeekStart(DateOnly date)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        var daysSinceMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
        return date.AddDays(-daysSinceMonday);
    }

    private static decimal CalculateCompletionRate(IReadOnlyList<Booking> bookings)
    {
        if (bookings.Count == 0)
        {
            return 0m;
        }

        var completedCount = bookings.Count(b => b.Status is BookingStatus.Completed or BookingStatus.Validated);
        return Math.Round((decimal)completedCount / bookings.Count * 100m, 2);
    }

    private static decimal SumProviderRevenue(IReadOnlyList<Booking> bookings, IReadOnlyCollection<BookingStatus> revenueStatuses)
    {
        return bookings
            .Where(b => revenueStatuses.Contains(b.Status))
            .Sum(b => b.ProviderAmount);
    }
}
