using MediatR;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns available and unavailable time slots for a provider on a specific date.
/// Computed from provider schedules, provider unavailability, and active bookings.
/// </summary>
public record GetProviderAvailabilityQuery(
    Guid ProviderId,
    DateOnly Date,
    Guid? ServiceId) : IRequest<ProviderAvailabilityResponse>;

/// <summary>
/// Handles <see cref="GetProviderAvailabilityQuery"/>.
/// </summary>
public class GetProviderAvailabilityHandler
    : IRequestHandler<GetProviderAvailabilityQuery, ProviderAvailabilityResponse>
{
    private readonly IProviderRepository _repository;
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly ILogger<GetProviderAvailabilityHandler> _logger;

    public GetProviderAvailabilityHandler(
        IProviderRepository repository,
        IBookingSessionRepository sessionRepository,
        ILogger<GetProviderAvailabilityHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderAvailabilityResponse> Handle(
        GetProviderAvailabilityQuery query,
        CancellationToken cancellationToken)
    {
        var maxAdvanceDays = await _repository.GetMaxBookingAdvanceDaysAsync(query.ProviderId, cancellationToken);
        if (maxAdvanceDays is null)
        {
            throw new KeyNotFoundException($"Provider with ID '{query.ProviderId}' not found.");
        }

        var providerTimezone = await _repository.GetProviderTimezoneAsync(query.ProviderId, cancellationToken) ?? "Africa/Tunis";
        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(providerTimezone);
        var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, providerTz));
        var windowEnd = today.AddDays(maxAdvanceDays.Value);

        if (query.Date < today)
        {
            throw new InvalidOperationException("Date must not be in the provider's local past.");
        }

        if (query.Date > windowEnd)
        {
            throw new InvalidOperationException($"Bookings for provider '{query.ProviderId}' cannot extend beyond {windowEnd:yyyy-MM-dd}.");
        }

        var schedules = await _repository.GetSchedulesByDayAsync(
            query.ProviderId,
            query.Date.DayOfWeek,
            query.ServiceId,
            cancellationToken);
        var weeklySchedules = await _repository.GetSchedulesByDaysAsync(
            query.ProviderId,
            Enum.GetValues<DayOfWeek>(),
            query.ServiceId.HasValue ? [query.ServiceId.Value] : null,
            cancellationToken);

        var utcWindowStart = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(today, providerTz);
        var utcWindowEndExclusive = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(windowEnd.AddDays(1), providerTz);
        var unavailabilities = await _repository.GetUnavailabilitiesAsync(
            query.ProviderId,
            utcWindowStart,
            utcWindowEndExclusive,
            cancellationToken);

        var bookings = await _sessionRepository.GetActiveProviderTimeSlotsAsync(
            query.ProviderId,
            query.Date,
            cancellationToken);

        var scheduleRanges = schedules
            .Select(schedule => new TimeRange(schedule.StartTime, schedule.EndTime))
            .Where(range => range.IsValid)
            .OrderBy(range => range.Start)
            .ToList();
        var availableRanges = ProviderAvailabilityComputation.GetAvailableRangesForDate(
            query.Date,
            scheduleRanges,
            unavailabilities,
            bookings,
            providerTz);
        var unavailableRanges = ProviderAvailabilityComputation.GetUnavailableRangesWithinSchedules(scheduleRanges, availableRanges);

        var unavailableDates = ProviderAvailabilityComputation.GetFullyUnavailableDates(
            unavailabilities,
            weeklySchedules,
            today,
            windowEnd,
            providerTz);

        var availableSlots = availableRanges
            .Select(range => range.Start.ToString("HH:mm"))
            .ToList()
            .AsReadOnly();
        var unavailableSlots = unavailableRanges
            .Select(range => range.Start.ToString("HH:mm"))
            .ToList()
            .AsReadOnly();

        _logger.LogInformation(
            "Availability computed for provider {ProviderId} on {Date}: {AvailableCount} available, {UnavailableCount} unavailable slots",
            query.ProviderId,
            query.Date,
            availableSlots.Count,
            unavailableSlots.Count);

        return new ProviderAvailabilityResponse
        {
            ProviderId = query.ProviderId,
            Date = query.Date,
            AvailableIntervals = availableRanges.Select(range => range.ToIntervalResponse()).ToList().AsReadOnly(),
            AvailableSlots = availableSlots,
            UnavailableIntervals = unavailableRanges.Select(range => range.ToIntervalResponse()).ToList().AsReadOnly(),
            UnavailableSlots = unavailableSlots,
            UnavailableDates = unavailableDates,
            Timezone = providerTimezone
        };
    }
}
