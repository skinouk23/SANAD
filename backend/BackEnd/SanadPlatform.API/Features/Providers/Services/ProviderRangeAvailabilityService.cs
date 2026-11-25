using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Caching.Memory;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Services;

namespace SanadPlatform.API.Features.Providers.Services;

/// <summary>
/// Computes provider availability for a fixed daily session window across a booking date range.
/// </summary>
public interface IProviderRangeAvailabilityService
{
    Task<ProviderRangeAvailabilityResult> GetRangeAvailabilityAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        IReadOnlyList<ProviderRequestedServiceItem> requestedServices,
        CancellationToken cancellationToken = default);

    Task<ProviderMonthAvailabilityResult> GetMonthAvailabilityAsync(
        Guid providerId,
        int year,
        int month,
        IReadOnlyList<ProviderRequestedServiceItem> requestedServices,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Requested service selection used when computing range availability.
/// </summary>
public sealed record ProviderRequestedServiceItem(Guid ServiceId, int Quantity);

/// <summary>
/// Internal range-availability result shared by handlers that need both duration and valid start times.
/// </summary>
public sealed record ProviderRangeAvailabilityResult(
    Guid ProviderId,
    DateOnly StartDate,
    DateOnly EndDate,
    int DayCount,
    int DailyDurationMinutes,
    IReadOnlyList<TimeOnly> AvailableStartTimes,
    string Timezone);

/// <summary>
/// Internal month-availability result shared by handlers that need both duration and per-day slot counts.
/// </summary>
public sealed record ProviderMonthAvailabilityResult(
    Guid ProviderId,
    int Year,
    int Month,
    int DailyDurationMinutes,
    string Timezone,
    DateOnly? MaxBookableDate,
    IReadOnlyList<ProviderMonthAvailabilityDayResult> Days);

/// <summary>
/// Internal per-day month-availability result containing the number of valid start times for one date.
/// </summary>
public sealed record ProviderMonthAvailabilityDayResult(
    DateOnly Date,
    int SlotCount);

internal readonly record struct TimeRange(TimeOnly Start, TimeOnly End)
{
    internal bool IsValid => Start < End;
}

/// <summary>
/// EF-backed provider range-availability service.
/// Batch-fetches schedules and bookings for the full date range to minimize database round-trips.
/// </summary>
public class ProviderRangeAvailabilityService : IProviderRangeAvailabilityService
{
    private const int DefaultDurationMinutes = 30;
    private const int AvailabilityStepMinutes = 30;
    private static readonly TimeSpan ScheduleCacheDuration = TimeSpan.FromMinutes(2);

    private readonly IProviderRepository _providerRepository;
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IServiceResolutionService _serviceResolutionService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<ProviderRangeAvailabilityService> _logger;

    public ProviderRangeAvailabilityService(
        IProviderRepository providerRepository,
        IBookingSessionRepository sessionRepository,
        IServiceResolutionService serviceResolutionService,
        IMemoryCache cache,
        ILogger<ProviderRangeAvailabilityService> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _serviceResolutionService = serviceResolutionService ?? throw new ArgumentNullException(nameof(serviceResolutionService));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderRangeAvailabilityResult> GetRangeAvailabilityAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        IReadOnlyList<ProviderRequestedServiceItem> requestedServices,
        CancellationToken cancellationToken = default)
    {
        if (requestedServices.Count == 0)
        {
            throw new InvalidOperationException("At least one service item is required to compute availability.");
        }

        if (endDate < startDate)
        {
            throw new InvalidOperationException("End date must be on or after the start date.");
        }

        var maxAdvanceDays = await _providerRepository.GetMaxBookingAdvanceDaysAsync(providerId, cancellationToken);
        if (maxAdvanceDays is null)
        {
            throw new KeyNotFoundException($"Provider with ID '{providerId}' not found.");
        }

        var providerTimezone = await _providerRepository.GetProviderTimezoneAsync(providerId, cancellationToken) ?? "Africa/Tunis";
        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(providerTimezone);
        var providerLocalToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, providerTz));
        var maxBookableDate = providerLocalToday.AddDays(maxAdvanceDays.Value);

        if (startDate < providerLocalToday)
        {
            throw new InvalidOperationException("Start date must not be in the provider's local past.");
        }

        if (endDate > maxBookableDate)
        {
            throw new InvalidOperationException(
                $"Bookings for provider '{providerId}' cannot extend beyond {maxBookableDate:yyyy-MM-dd}.");
        }

        var resolvedServices = await _serviceResolutionService.ResolveAsync(
            providerId,
            requestedServices.Select(item => new ServiceItemRequest(item.ServiceId, item.Quantity)).ToList().AsReadOnly(),
            cancellationToken);

        var dailyDurationMinutes = ComputeDailyDurationMinutes(resolvedServices);
        var utcWindowStart = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(startDate, providerTz);
        var utcWindowEndExclusive = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(endDate.AddDays(1), providerTz);
        var unavailabilities = await _providerRepository.GetUnavailabilitiesAsync(providerId, utcWindowStart, utcWindowEndExclusive, cancellationToken);

        var daysOfWeek = Enumerable.Range(0, endDate.DayNumber - startDate.DayNumber + 1)
            .Select(offset => startDate.AddDays(offset).DayOfWeek)
            .Distinct()
            .ToHashSet();
        var serviceIds = resolvedServices.Select(item => item.Service.Id).ToList();

        var allSchedules = await GetOrCacheSchedulesAsync(providerId, daysOfWeek, serviceIds, cancellationToken);
        var allBookings = await GetActiveTimeSlotsForRangeAsync(providerId, startDate, endDate, cancellationToken);

        HashSet<TimeOnly>? availableOnEveryDay = null;
        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            var availableForDate = GetAvailableStartTimesForDate(
                date,
                dailyDurationMinutes,
                resolvedServices,
                unavailabilities,
                allSchedules,
                allBookings,
                providerTz);

            if (availableOnEveryDay is null)
            {
                availableOnEveryDay = availableForDate;
            }
            else
            {
                availableOnEveryDay.IntersectWith(availableForDate);
            }

            if (availableOnEveryDay.Count == 0)
            {
                break;
            }
        }

        var orderedStartTimes = (availableOnEveryDay ?? [])
            .OrderBy(time => time)
            .ToList()
            .AsReadOnly();

        var dayCount = endDate.DayNumber - startDate.DayNumber + 1;
        _logger.LogInformation(
            "Computed range availability for provider {ProviderId} from {StartDate} to {EndDate}: {SlotCount} start times, duration {DailyDurationMinutes} minutes",
            providerId,
            startDate,
            endDate,
            orderedStartTimes.Count,
            dailyDurationMinutes);

        return new ProviderRangeAvailabilityResult(
            providerId,
            startDate,
            endDate,
            dayCount,
            dailyDurationMinutes,
            orderedStartTimes,
            providerTimezone);
    }

    public async Task<ProviderMonthAvailabilityResult> GetMonthAvailabilityAsync(
        Guid providerId,
        int year,
        int month,
        IReadOnlyList<ProviderRequestedServiceItem> requestedServices,
        CancellationToken cancellationToken = default)
    {
        if (requestedServices.Count == 0)
        {
            throw new InvalidOperationException("At least one service item is required to compute availability.");
        }

        var maxAdvanceDays = await _providerRepository.GetMaxBookingAdvanceDaysAsync(providerId, cancellationToken);
        if (maxAdvanceDays is null)
        {
            throw new KeyNotFoundException($"Provider with ID '{providerId}' not found.");
        }

        var timezone = await _providerRepository.GetProviderTimezoneAsync(providerId, cancellationToken) ?? "Africa/Tunis";
        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(timezone);
        var providerLocalToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, providerTz));
        var maxBookableDate = providerLocalToday.AddDays(maxAdvanceDays.Value);

        var monthStart = new DateOnly(year, month, 1);
        var monthEnd = monthStart.AddMonths(1).AddDays(-1);
        var effectiveStart = monthStart > providerLocalToday ? monthStart : providerLocalToday;
        var effectiveEnd = monthEnd < maxBookableDate ? monthEnd : maxBookableDate;

        if (effectiveStart > effectiveEnd)
        {
            return new ProviderMonthAvailabilityResult(providerId, year, month, 0, timezone, maxBookableDate, []);
        }

        var resolvedServices = await _serviceResolutionService.ResolveAsync(
            providerId,
            requestedServices.Select(item => new ServiceItemRequest(item.ServiceId, item.Quantity)).ToList().AsReadOnly(),
            cancellationToken);

        var dailyDurationMinutes = ComputeDailyDurationMinutes(resolvedServices);
        var utcWindowStart = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(effectiveStart, providerTz);
        var utcWindowEndExclusive = ProviderAvailabilityComputation.GetUtcStartOfLocalDate(effectiveEnd.AddDays(1), providerTz);
        var unavailabilities = await _providerRepository.GetUnavailabilitiesAsync(
            providerId,
            utcWindowStart,
            utcWindowEndExclusive,
            cancellationToken);

        var daysOfWeek = Enumerable.Range(0, effectiveEnd.DayNumber - effectiveStart.DayNumber + 1)
            .Select(offset => effectiveStart.AddDays(offset).DayOfWeek)
            .Distinct()
            .ToHashSet();
        var serviceIds = resolvedServices.Select(item => item.Service.Id).ToList();

        var allSchedules = await GetOrCacheSchedulesAsync(providerId, daysOfWeek, serviceIds, cancellationToken);
        var allBookings = await GetActiveTimeSlotsForRangeAsync(
            providerId,
            effectiveStart,
            effectiveEnd,
            cancellationToken);

        var days = new List<ProviderMonthAvailabilityDayResult>();
        for (var date = monthStart; date <= monthEnd; date = date.AddDays(1))
        {
            if (date < effectiveStart || date > effectiveEnd)
            {
                days.Add(new ProviderMonthAvailabilityDayResult(date, 0));
                continue;
            }

            var availableStartTimes = GetAvailableStartTimesForDate(
                date,
                dailyDurationMinutes,
                resolvedServices,
                unavailabilities,
                allSchedules,
                allBookings,
                providerTz);

            days.Add(new ProviderMonthAvailabilityDayResult(date, availableStartTimes.Count));
        }

        return new ProviderMonthAvailabilityResult(
            providerId,
            year,
            month,
            dailyDurationMinutes,
            timezone,
            maxBookableDate,
            days.AsReadOnly());
    }

    private async Task<IReadOnlyList<ProviderSchedule>> GetOrCacheSchedulesAsync(
        Guid providerId,
        HashSet<DayOfWeek> daysOfWeek,
        List<Guid> serviceIds,
        CancellationToken cancellationToken)
    {
        var sortedDays = string.Join(",", daysOfWeek.Order().Select(d => (int)d));
        var sortedServiceIds = string.Join(",", serviceIds.Order());
        var cacheKey = $"provider-schedules:{providerId}:{sortedDays}:{sortedServiceIds}";

        if (_cache.TryGetValue(cacheKey, out IReadOnlyList<ProviderSchedule>? cached) && cached is not null)
        {
            return cached;
        }

        var schedules = await _providerRepository.GetSchedulesByDaysAsync(providerId, daysOfWeek, serviceIds, cancellationToken);
        _cache.Set(cacheKey, schedules, ScheduleCacheDuration);
        return schedules;
    }

    private async Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveTimeSlotsForRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken)
    {
        return await _sessionRepository.GetActiveProviderTimeSlotsForRangeAsync(
            providerId,
            startDate,
            endDate,
            cancellationToken);
    }

    private static HashSet<TimeOnly> GetAvailableStartTimesForDate(
        DateOnly date,
        int dailyDurationMinutes,
        IReadOnlyList<ResolvedServiceItem> resolvedServices,
        IReadOnlyList<ProviderUnavailability> unavailabilities,
        IReadOnlyList<ProviderSchedule> allSchedules,
        IReadOnlyList<BookingTimeSlotWithDateDto> allBookings,
        TimeZoneInfo providerTz)
    {
        var candidateRanges = GetCandidateScheduleRanges(date.DayOfWeek, resolvedServices, allSchedules);
        if (candidateRanges.Count == 0)
        {
            return [];
        }

        var bookingsForDate = allBookings
            .Where(b => b.StartDate <= date && b.EndDate >= date)
            .Select(b => new BookingTimeSlotDto(b.StartTime, b.EndTime, b.DurationMinutes, b.ServiceDurationMinutes))
            .ToList();

        var availableRanges = ProviderAvailabilityComputation.GetAvailableRangesForDate(
            date,
            candidateRanges,
            unavailabilities,
            bookingsForDate,
            providerTz);

        return ProviderAvailabilityComputation.GenerateCandidateStartTimes(
            date,
            availableRanges,
            dailyDurationMinutes,
            providerTz,
            AvailabilityStepMinutes);
    }

    private static List<TimeRange> GetCandidateScheduleRanges(
        DayOfWeek dayOfWeek,
        IReadOnlyList<ResolvedServiceItem> resolvedServices,
        IReadOnlyList<ProviderSchedule> allSchedules)
    {
        List<TimeRange>? candidates = null;

        foreach (var requestedService in resolvedServices)
        {
            var serviceRanges = allSchedules
                .Where(schedule => schedule.DayOfWeek == dayOfWeek
                    && (schedule.ServiceId == null || schedule.ServiceId == requestedService.Service.Id))
                .Select(schedule => new TimeRange(schedule.StartTime, schedule.EndTime))
                .Where(range => range.IsValid)
                .OrderBy(range => range.Start)
                .ToList();

            if (candidates is null)
            {
                candidates = serviceRanges;
                continue;
            }

            candidates = ProviderAvailabilityComputation.IntersectRanges(candidates, serviceRanges);
            if (candidates.Count == 0)
            {
                break;
            }
        }

        return candidates ?? [];
    }

    private static int ComputeDailyDurationMinutes(IReadOnlyList<ResolvedServiceItem> resolvedServices)
    {
        var category = resolvedServices[0].Service.Category;
        if (IServiceResolutionService.IsSingleServiceCategory(category))
        {
            return resolvedServices[0].Service.DurationMinutes ?? DefaultDurationMinutes;
        }

        var servicesMissingDuration = resolvedServices
            .Where(item => !item.Service.DurationMinutes.HasValue || item.Service.DurationMinutes.Value <= 0)
            .Select(item => item.Service.Name)
            .ToList();

        if (servicesMissingDuration.Count > 0)
        {
            throw new InvalidOperationException(
                $"Selected services must define a positive duration before they can be booked: {string.Join(", ", servicesMissingDuration)}.");
        }

        return resolvedServices.Sum(item => item.Service.DurationMinutes!.Value * item.Quantity);
    }
}

internal static class ProviderAvailabilityComputation
{
    private const int DefaultDurationMinutes = 30;

    internal static List<ProviderUnavailability> GetApplicableUnavailabilities(
        IReadOnlyList<ProviderUnavailability> all,
        DateOnly date,
        TimeZoneInfo providerTz)
    {
        var result = new List<ProviderUnavailability>();

        foreach (var entry in all)
        {
            if (entry.IsRecurring && !string.IsNullOrWhiteSpace(entry.RecurrenceRule))
            {
                if (IsRecurrenceOnDate(entry, date))
                {
                    result.Add(entry);
                }

                continue;
            }

            var startDate = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(entry.StartDatetime, DateTimeKind.Utc),
                providerTz));
            var endDate = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(entry.EndDatetime, DateTimeKind.Utc),
                providerTz));

            if (date >= startDate && date <= endDate)
            {
                result.Add(entry);
            }
        }

        return result;
    }

    internal static List<TimeRange> GetAvailableRangesForDate(
        DateOnly date,
        IReadOnlyList<TimeRange> scheduleRanges,
        IReadOnlyList<ProviderUnavailability> unavailabilities,
        IReadOnlyList<BookingTimeSlotDto> bookings,
        TimeZoneInfo providerTz)
    {
        var applicableUnavailabilities = GetApplicableUnavailabilities(unavailabilities, date, providerTz);
        if (applicableUnavailabilities.Any(entry => entry.IsAllDay))
        {
            return [];
        }

        var available = scheduleRanges
            .Where(range => range.IsValid)
            .OrderBy(range => range.Start)
            .ToList();

        foreach (var blockedRange in GetBlockedRanges(applicableUnavailabilities, bookings, providerTz))
        {
            available = SubtractRangeSet(available, blockedRange);
            if (available.Count == 0)
            {
                break;
            }
        }

        return available;
    }

    internal static HashSet<TimeOnly> GenerateCandidateStartTimes(
        DateOnly date,
        IReadOnlyList<TimeRange> availableRanges,
        int durationMinutes,
        TimeZoneInfo providerTz,
        int stepMinutes,
        DateTime? utcNow = null)
    {
        var result = new HashSet<TimeOnly>();

        foreach (var range in availableRanges)
        {
            for (var start = range.Start; ; start = start.AddMinutes(stepMinutes))
            {
                var end = start.AddMinutes(durationMinutes);
                if (CrossesMidnight(start, end, durationMinutes) || end > range.End)
                {
                    break;
                }

                if (!IsPastSameDayStartTime(date, start, providerTz, utcNow))
                {
                    result.Add(start);
                }
            }
        }

        return result;
    }

    internal static List<TimeRange> IntersectRanges(
        IReadOnlyList<TimeRange> left,
        IReadOnlyList<TimeRange> right)
    {
        var result = new List<TimeRange>();
        var leftIndex = 0;
        var rightIndex = 0;

        while (leftIndex < left.Count && rightIndex < right.Count)
        {
            var leftRange = left[leftIndex];
            var rightRange = right[rightIndex];

            var start = leftRange.Start > rightRange.Start ? leftRange.Start : rightRange.Start;
            var end = leftRange.End < rightRange.End ? leftRange.End : rightRange.End;
            if (start < end)
            {
                result.Add(new TimeRange(start, end));
            }

            if (leftRange.End <= rightRange.End)
            {
                leftIndex++;
            }
            else
            {
                rightIndex++;
            }
        }

        return result;
    }

    internal static bool IsBlockedByUnavailability(
        IReadOnlyList<ProviderUnavailability> entries,
        TimeOnly slotStart,
        TimeOnly slotEnd,
        TimeZoneInfo providerTz)
    {
        foreach (var range in GetBlockedRanges(entries, [], providerTz))
        {
            if (DoTimeRangesOverlap(slotStart, slotEnd, range.Start, range.End))
            {
                return true;
            }
        }

        return false;
    }

    internal static bool IsBlockedByBooking(
        IReadOnlyList<BookingTimeSlotDto> bookings,
        TimeOnly slotStart,
        TimeOnly slotEnd)
    {
        foreach (var booking in bookings)
        {
            var bookingEnd = ComputeBookingEndTime(booking);
            if (DoTimeRangesOverlap(slotStart, slotEnd, booking.StartTime, bookingEnd))
            {
                return true;
            }
        }

        return false;
    }

    internal static bool IsPastSameDayStartTime(
        DateOnly date,
        TimeOnly slotStart,
        TimeZoneInfo providerTz,
        DateTime? utcNow = null)
    {
        var referenceUtc = utcNow ?? DateTime.UtcNow;
        if (referenceUtc.Kind != DateTimeKind.Utc)
        {
            referenceUtc = DateTime.SpecifyKind(referenceUtc, DateTimeKind.Utc);
        }

        var providerLocalNow = TimeZoneInfo.ConvertTimeFromUtc(referenceUtc, providerTz);
        var providerLocalToday = DateOnly.FromDateTime(providerLocalNow);
        return date == providerLocalToday && slotStart <= TimeOnly.FromDateTime(providerLocalNow);
    }

    internal static bool DoesDurationFitWithinSlot(TimeOnly slotStart, TimeOnly slotEnd, int durationMinutes)
    {
        var candidateEnd = slotStart.AddMinutes(durationMinutes);
        return !CrossesMidnight(slotStart, candidateEnd, durationMinutes) && candidateEnd <= slotEnd;
    }

    internal static bool CrossesMidnight(TimeOnly startTime, TimeOnly endTime, int durationMinutes)
    {
        return durationMinutes > 0 && endTime <= startTime;
    }

    internal static DateTime GetUtcStartOfLocalDate(DateOnly date, TimeZoneInfo providerTz)
    {
        return TimeZoneInfo.ConvertTimeToUtc(
            date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified),
            providerTz);
    }

    internal static IReadOnlyList<DateOnly> GetFullyUnavailableDates(
        IReadOnlyList<ProviderUnavailability> entries,
        IReadOnlyList<ProviderSchedule> schedules,
        DateOnly windowStart,
        DateOnly windowEnd,
        TimeZoneInfo providerTz)
    {
        var dates = new List<DateOnly>();

        for (var date = windowStart; date <= windowEnd; date = date.AddDays(1))
        {
            var dailySchedules = schedules
                .Where(schedule => schedule.DayOfWeek == date.DayOfWeek)
                .Select(schedule => new TimeRange(schedule.StartTime, schedule.EndTime))
                .Where(range => range.IsValid)
                .OrderBy(range => range.Start)
                .ToList();

            if (dailySchedules.Count == 0)
            {
                continue;
            }

            var available = GetAvailableRangesForDate(date, dailySchedules, entries, [], providerTz);
            if (available.Count == 0)
            {
                dates.Add(date);
            }
        }

        return dates.AsReadOnly();
    }

    internal static List<TimeRange> GetUnavailableRangesWithinSchedules(
        IReadOnlyList<TimeRange> scheduleRanges,
        IReadOnlyList<TimeRange> availableRanges)
    {
        var remaining = scheduleRanges
            .Where(range => range.IsValid)
            .OrderBy(range => range.Start)
            .ToList();

        foreach (var availableRange in availableRanges.OrderBy(range => range.Start))
        {
            remaining = SubtractRangeSet(remaining, availableRange);
            if (remaining.Count == 0)
            {
                break;
            }
        }

        return remaining;
    }

    private static List<TimeRange> GetBlockedRanges(
        IReadOnlyList<ProviderUnavailability> entries,
        IReadOnlyList<BookingTimeSlotDto> bookings,
        TimeZoneInfo providerTz)
    {
        var ranges = new List<TimeRange>();

        foreach (var entry in entries)
        {
            if (entry.IsAllDay)
            {
                continue;
            }

            var blockStart = TimeOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(entry.StartDatetime, DateTimeKind.Utc),
                providerTz));
            var blockEnd = TimeOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(entry.EndDatetime, DateTimeKind.Utc),
                providerTz));
            if (blockStart < blockEnd)
            {
                ranges.Add(new TimeRange(blockStart, blockEnd));
            }
        }

        foreach (var booking in bookings)
        {
            var bookingEnd = ComputeBookingEndTime(booking);
            if (booking.StartTime < bookingEnd)
            {
                ranges.Add(new TimeRange(booking.StartTime, bookingEnd));
            }
        }

        return ranges.OrderBy(range => range.Start).ToList();
    }

    private static List<TimeRange> SubtractRangeSet(
        IReadOnlyList<TimeRange> ranges,
        TimeRange blocked)
    {
        var result = new List<TimeRange>();

        foreach (var range in ranges)
        {
            if (!DoTimeRangesOverlap(range.Start, range.End, blocked.Start, blocked.End))
            {
                result.Add(range);
                continue;
            }

            if (blocked.Start > range.Start)
            {
                var left = new TimeRange(range.Start, blocked.Start);
                if (left.IsValid)
                {
                    result.Add(left);
                }
            }

            if (blocked.End < range.End)
            {
                var right = new TimeRange(blocked.End, range.End);
                if (right.IsValid)
                {
                    result.Add(right);
                }
            }
        }

        return result;
    }

    private static bool IsRecurrenceOnDate(ProviderUnavailability entry, DateOnly date)
    {
        var calEvent = CreateCalendarEvent(entry);
        var dayStart = new CalDateTime(date.Year, date.Month, date.Day, 0, 0, 0);
        var nextDay = date.AddDays(1);
        var occurrences = calEvent.GetOccurrences(dayStart)
            .TakeWhile(occurrence => occurrence.Period.StartTime.Date < nextDay);

        return occurrences.Any(occurrence => occurrence.Period.StartTime.Date == date);
    }

    private static CalendarEvent CreateCalendarEvent(ProviderUnavailability entry)
    {
        var calEvent = new CalendarEvent
        {
            DtStart = new CalDateTime(entry.StartDatetime),
            DtEnd = new CalDateTime(entry.EndDatetime)
        };

#pragma warning disable CS0618
        calEvent.RecurrenceRules.Add(new RecurrencePattern(entry.RecurrenceRule!));
#pragma warning restore CS0618

        return calEvent;
    }

    private static bool DoTimeRangesOverlap(
        TimeOnly startA,
        TimeOnly endA,
        TimeOnly startB,
        TimeOnly endB)
    {
        return startA < endB && startB < endA;
    }

    private static TimeOnly ComputeBookingEndTime(BookingTimeSlotDto booking)
    {
        if (booking.EndTime.HasValue)
        {
            return booking.EndTime.Value;
        }

        var durationMinutes = booking.DurationMinutes
                              ?? booking.ServiceDurationMinutes
                              ?? DefaultDurationMinutes;

        return booking.StartTime.AddMinutes(durationMinutes);
    }
}
