using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Services;

public static class ProviderAvailabilityMapping
{
    internal static ProviderAvailabilityIntervalResponse ToIntervalResponse(this TimeRange timeRange)
    {
        return new ProviderAvailabilityIntervalResponse
        {
            StartTime = timeRange.Start.ToString("HH:mm"),
            EndTime = timeRange.End.ToString("HH:mm")
        };
    }

    public static ProviderScheduleIntervalResponse ToScheduleResponse(this ProviderSchedule schedule)
    {
        return new ProviderScheduleIntervalResponse
        {
            Id = schedule.Id,
            DayOfWeek = schedule.DayOfWeek,
            ServiceId = schedule.ServiceId,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime
        };
    }

    public static ProviderUnavailabilityResponse ToResponse(this ProviderUnavailability unavailability, TimeZoneInfo providerTz)
    {
        return new ProviderUnavailabilityResponse
        {
            Id = unavailability.Id,
            StartDatetime = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(unavailability.StartDatetime, DateTimeKind.Utc),
                providerTz),
            EndDatetime = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(unavailability.EndDatetime, DateTimeKind.Utc),
                providerTz),
            IsAllDay = unavailability.IsAllDay,
            IsRecurring = unavailability.IsRecurring,
            RecurrenceRule = unavailability.RecurrenceRule,
            Reason = unavailability.Reason,
            Notes = unavailability.Notes
        };
    }
}
