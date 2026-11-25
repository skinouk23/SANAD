using SanadPlatform.API.Features.Providers.Services;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.DTOs;

namespace SanadPlatform.API.Tests.Features.Providers.Services;

public class ProviderAvailabilityComputationTests
{
    private static readonly TimeZoneInfo ProviderTimezone = TimeZoneInfo.FindSystemTimeZoneById("Africa/Tunis");

    [Fact]
    public void IsPastSameDayStartTime_ReturnsTrue_ForPastSlotOnProviderLocalToday()
    {
        var utcNow = new DateTime(2026, 4, 12, 12, 11, 0, DateTimeKind.Utc);

        var isPast = ProviderAvailabilityComputation.IsPastSameDayStartTime(
            new DateOnly(2026, 4, 12),
            new TimeOnly(0, 1),
            ProviderTimezone,
            utcNow);

        Assert.True(isPast);
    }

    [Fact]
    public void IsPastSameDayStartTime_ReturnsFalse_ForFutureSlotOnProviderLocalToday()
    {
        var utcNow = new DateTime(2026, 4, 12, 12, 11, 0, DateTimeKind.Utc);

        var isPast = ProviderAvailabilityComputation.IsPastSameDayStartTime(
            new DateOnly(2026, 4, 12),
            new TimeOnly(23, 0),
            ProviderTimezone,
            utcNow);

        Assert.False(isPast);
    }

    [Fact]
    public void IsPastSameDayStartTime_ReturnsFalse_ForFutureDate()
    {
        var utcNow = new DateTime(2026, 4, 12, 12, 11, 0, DateTimeKind.Utc);

        var isPast = ProviderAvailabilityComputation.IsPastSameDayStartTime(
            new DateOnly(2026, 4, 13),
            new TimeOnly(0, 1),
            ProviderTimezone,
            utcNow);

        Assert.False(isPast);
    }

    [Fact]
    public void GetAvailableRangesForDate_SplitsBroadWindowAroundPartialBlocksAndBookings()
    {
        var date = new DateOnly(2026, 4, 13);
        var schedules = new List<TimeRange>
        {
            new(new TimeOnly(9, 0), new TimeOnly(17, 0))
        };
        var unavailabilities = new List<ProviderUnavailability>
        {
            new()
            {
                StartDatetime = new DateTime(2026, 4, 13, 12, 0, 0, DateTimeKind.Utc),
                EndDatetime = new DateTime(2026, 4, 13, 13, 0, 0, DateTimeKind.Utc)
            }
        };
        var bookings = new List<BookingTimeSlotDto>
        {
            new(new TimeOnly(15, 0), new TimeOnly(16, 0), 60, 60)
        };

        var result = ProviderAvailabilityComputation.GetAvailableRangesForDate(
            date,
            schedules,
            unavailabilities,
            bookings,
            TimeZoneInfo.Utc);

        Assert.Equal(3, result.Count);
        Assert.Equal(new TimeOnly(9, 0), result[0].Start);
        Assert.Equal(new TimeOnly(12, 0), result[0].End);
        Assert.Equal(new TimeOnly(13, 0), result[1].Start);
        Assert.Equal(new TimeOnly(15, 0), result[1].End);
        Assert.Equal(new TimeOnly(16, 0), result[2].Start);
        Assert.Equal(new TimeOnly(17, 0), result[2].End);
    }

    [Fact]
    public void GenerateCandidateStartTimes_ReturnsMultipleStartsWithinBroadAvailabilityWindow()
    {
        var date = new DateOnly(2026, 4, 13);
        var ranges = new List<TimeRange>
        {
            new(new TimeOnly(9, 0), new TimeOnly(12, 0)),
            new(new TimeOnly(13, 0), new TimeOnly(15, 0))
        };

        var result = ProviderAvailabilityComputation.GenerateCandidateStartTimes(
            date,
            ranges,
            60,
            TimeZoneInfo.Utc,
            30,
            new DateTime(2026, 4, 12, 10, 0, 0, DateTimeKind.Utc));

        Assert.Equal(
            [new TimeOnly(9, 0), new TimeOnly(9, 30), new TimeOnly(10, 0), new TimeOnly(10, 30), new TimeOnly(11, 0), new TimeOnly(13, 0), new TimeOnly(13, 30), new TimeOnly(14, 0)],
            result.OrderBy(time => time).ToArray());
    }

    [Fact]
    public void GetFullyUnavailableDates_DoesNotMarkPartialDayAsUnavailable()
    {
        var date = new DateOnly(2026, 4, 13);
        var schedules = new List<ProviderSchedule>
        {
            new()
            {
                DayOfWeek = date.DayOfWeek,
                StartTime = new TimeOnly(9, 0),
                EndTime = new TimeOnly(17, 0),
                IsAvailable = true
            }
        };
        var unavailabilities = new List<ProviderUnavailability>
        {
            new()
            {
                StartDatetime = new DateTime(2026, 4, 13, 10, 0, 0, DateTimeKind.Utc),
                EndDatetime = new DateTime(2026, 4, 13, 11, 0, 0, DateTimeKind.Utc),
                IsAllDay = false
            }
        };

        var result = ProviderAvailabilityComputation.GetFullyUnavailableDates(
            unavailabilities,
            schedules,
            date,
            date,
            TimeZoneInfo.Utc);

        Assert.Empty(result);
    }
}
