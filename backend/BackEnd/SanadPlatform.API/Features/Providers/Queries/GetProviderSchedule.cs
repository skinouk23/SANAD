using MediatR;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve a provider's schedule (available time slots) for the next N days.
/// Maps to GET /api/v1/providers/{id}/schedule.
/// </summary>
public record GetProviderScheduleQuery(
    Guid ProviderId,
    int Days) : IRequest<IReadOnlyList<ProviderScheduleSlotResponse>>;

/// <summary>
/// Handler for <see cref="GetProviderScheduleQuery"/>.
/// </summary>
public class GetProviderScheduleQueryHandler
    : IRequestHandler<GetProviderScheduleQuery, IReadOnlyList<ProviderScheduleSlotResponse>>
{
    private readonly IProviderRepository _repository;
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly ILogger<GetProviderScheduleQueryHandler> _logger;

    public GetProviderScheduleQueryHandler(
        IProviderRepository repository,
        IBookingSessionRepository sessionRepository,
        ILogger<GetProviderScheduleQueryHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<ProviderScheduleSlotResponse>> Handle(
        GetProviderScheduleQuery query,
        CancellationToken cancellationToken)
    {
        var maxAdvanceDays = await _repository.GetMaxBookingAdvanceDaysAsync(query.ProviderId, cancellationToken);
        if (maxAdvanceDays is null)
        {
            throw new KeyNotFoundException($"Provider with ID '{query.ProviderId}' not found.");
        }

        var providerTimezone = await _repository.GetProviderTimezoneAsync(query.ProviderId, cancellationToken) ?? "Africa/Tunis";
        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(providerTimezone);

        var days = Math.Min(query.Days > 0 ? query.Days : 7, maxAdvanceDays.Value);
        var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, providerTz));
        var windowEnd = today.AddDays(days);
        var utcWindowStart = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(today, providerTz);
        var utcWindowEndExclusive = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(windowEnd, providerTz);
        var unavailabilities = await _repository.GetUnavailabilitiesAsync(query.ProviderId, utcWindowStart, utcWindowEndExclusive, cancellationToken);

        var daysOfWeek = Enumerable.Range(0, days)
            .Select(offset => today.AddDays(offset).DayOfWeek)
            .Distinct()
            .ToHashSet();
        var weeklySchedules = await _repository.GetSchedulesByDaysAsync(query.ProviderId, daysOfWeek, null, cancellationToken);
        var bookings = await _sessionRepository.GetActiveProviderTimeSlotsForRangeAsync(query.ProviderId, today, windowEnd.AddDays(-1), cancellationToken);

        var result = new List<ProviderScheduleSlotResponse>();
        for (var date = today; date < windowEnd; date = date.AddDays(1))
        {
            var schedules = weeklySchedules
                .Where(schedule => schedule.DayOfWeek == date.DayOfWeek)
                .Select(schedule => new TimeRange(schedule.StartTime, schedule.EndTime))
                .Where(range => range.IsValid)
                .OrderBy(range => range.Start)
                .ToList();
            var bookingsForDate = bookings
                .Where(booking => booking.StartDate <= date && booking.EndDate >= date)
                .Select(booking => new BookingTimeSlotDto(booking.StartTime, booking.EndTime, booking.DurationMinutes, booking.ServiceDurationMinutes))
                .ToList();
            var availableRanges = ProviderAvailabilityComputation.GetAvailableRangesForDate(
                date,
                schedules,
                unavailabilities,
                bookingsForDate,
                providerTz);

            result.Add(new ProviderScheduleSlotResponse
            {
                Date = date.ToString("yyyy-MM-dd"),
                AvailableIntervals = availableRanges.Select(range => range.ToIntervalResponse()).ToList().AsReadOnly(),
                AvailableSlots = availableRanges.Select(range => range.Start.ToString("HH:mm")).ToList().AsReadOnly()
            });
        }

        _logger.LogDebug(
            "Schedule computed for provider {ProviderId}: {DayCount} days",
            query.ProviderId,
            result.Count);

        return result;
    }
}
