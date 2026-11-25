using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Queries;

/// <summary>
/// Returns today's bookings for the authenticated provider.
/// </summary>
public record GetMyProviderTodayBookingsQuery(Guid UserId) : IRequest<IReadOnlyList<BookingListItemResponse>>;

/// <summary>
/// Handles <see cref="GetMyProviderTodayBookingsQuery"/>.
/// </summary>
public class GetMyProviderTodayBookingsHandler : IRequestHandler<GetMyProviderTodayBookingsQuery, IReadOnlyList<BookingListItemResponse>>
{
    private static readonly BookingSessionStatus[] IncludedSessionStatuses =
    [
        BookingSessionStatus.Pending,
        BookingSessionStatus.Confirmed,
        BookingSessionStatus.ProviderOnWay,
        BookingSessionStatus.Arrived,
        BookingSessionStatus.InProgress,
        BookingSessionStatus.Completed,
        BookingSessionStatus.Validated
    ];

    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetMyProviderTodayBookingsHandler> _logger;

    public GetMyProviderTodayBookingsHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        ILogger<GetMyProviderTodayBookingsHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<BookingListItemResponse>> Handle(
        GetMyProviderTodayBookingsQuery query,
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

        var sessions = await _sessionRepository.GetProviderSessionsByDateRangeAsync(
            provider.Id,
            localToday,
            localToday,
            IncludedSessionStatuses,
            cancellationToken);

        var countsByBookingId = await _sessionRepository.GetSessionCountsByBookingIdsAsync(
            sessions.Select(session => session.BookingId).Distinct().ToList(),
            cancellationToken);

        return sessions
            .Select(session =>
            {
                countsByBookingId.TryGetValue(session.BookingId, out var counts);
                return BookingSessionListItemMapper.ToBookingListItem(session, counts ?? new BookingSessionCountsResponse());
            })
            .ToList()
            .AsReadOnly();
    }
}
