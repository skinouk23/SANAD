using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns the authenticated provider's composite planning payload for a local date window.
/// </summary>
public record GetMyProviderPlanningQuery(
    Guid UserId,
    DateOnly From,
    DateOnly To) : IRequest<ProviderPlanningResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderPlanningQuery"/>.
/// </summary>
public class GetMyProviderPlanningQueryHandler : IRequestHandler<GetMyProviderPlanningQuery, ProviderPlanningResponse>
{
    private static readonly BookingSessionStatus[] IncludedSessionStatuses =
    [
        BookingSessionStatus.Pending,
        BookingSessionStatus.Confirmed,
        BookingSessionStatus.ProviderOnWay,
        BookingSessionStatus.Arrived,
        BookingSessionStatus.InProgress,
        BookingSessionStatus.Completed,
        BookingSessionStatus.Validated,
        BookingSessionStatus.Cancelled,
        BookingSessionStatus.NoShow,
        BookingSessionStatus.Disputed
    ];

    private readonly IProviderRepository _providerRepository;
    private readonly IBookingSessionRepository _sessionRepository;

    public GetMyProviderPlanningQueryHandler(
        IProviderRepository providerRepository,
        IBookingSessionRepository sessionRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
    }

    public async Task<ProviderPlanningResponse> Handle(
        GetMyProviderPlanningQuery query,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(query.UserId, cancellationToken);
        if (provider is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{query.UserId}'.");
        }

        var providerTimezone = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone ?? "Africa/Tunis");
        var utcWindowStart = TimeZoneInfo.ConvertTimeToUtc(
            query.From.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified),
            providerTimezone);
        var utcWindowEndExclusive = TimeZoneInfo.ConvertTimeToUtc(
            query.To.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified),
            providerTimezone);

        var schedules = await _providerRepository.GetSchedulesByUserIdAsync(query.UserId, cancellationToken);
        var unavailabilities = await _providerRepository.GetUnavailabilitiesByUserIdAsync(
            query.UserId,
            utcWindowStart,
            utcWindowEndExclusive,
            cancellationToken);
        var overlappingUnavailabilities = GetOverlappingUnavailabilities(unavailabilities, query.From, query.To, providerTimezone);

        var sessionRows = await _sessionRepository.GetProviderSessionsByDateRangeAsync(
            provider.Id,
            query.From,
            query.To,
            IncludedSessionStatuses,
            cancellationToken);

        var bookings = sessionRows
            .Select(BookingSessionListItemMapper.ToProviderPlanningItem)
            .ToList()
            .AsReadOnly();

        return new ProviderPlanningResponse
        {
            Timezone = provider.Timezone ?? "Africa/Tunis",
            IsOnline = provider.IsAvailable,
            AvailabilityStatus = provider.AvailabilityStatus,
            Schedules = schedules
                .Select(schedule => schedule.ToScheduleResponse())
                .ToList()
                .AsReadOnly(),
            Unavailabilities = unavailabilities
                .Where(unavailability => overlappingUnavailabilities.Contains(unavailability.Id))
                .Select(unavailability => unavailability.ToResponse(providerTimezone))
                .ToList()
                .AsReadOnly(),
            Bookings = bookings
                .OrderBy(booking => booking.StartDate)
                .ThenBy(booking => booking.DailyStartTime)
                .ToList()
                .AsReadOnly()
        };
    }

    private static HashSet<Guid> GetOverlappingUnavailabilities(
        IReadOnlyList<ProviderUnavailability> unavailabilities,
        DateOnly from,
        DateOnly to,
        TimeZoneInfo providerTimezone)
    {
        var result = new HashSet<Guid>();

        for (var date = from; date <= to; date = date.AddDays(1))
        {
            foreach (var item in ProviderAvailabilityComputation.GetApplicableUnavailabilities(unavailabilities, date, providerTimezone))
            {
                result.Add(item.Id);
            }
        }

        return result;
    }
}
