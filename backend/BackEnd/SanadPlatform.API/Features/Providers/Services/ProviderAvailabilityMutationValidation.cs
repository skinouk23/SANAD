using SanadPlatform.API.Features.Providers.DTOs;

namespace SanadPlatform.API.Features.Providers.Services;

internal static class ProviderAvailabilityMutationValidation
{
    internal static void ValidateScheduleIntervals(IReadOnlyList<ProviderScheduleIntervalRequest> intervals)
    {
        var duplicateKeys = new HashSet<string>(StringComparer.Ordinal);

        foreach (var interval in intervals)
        {
            if (interval.StartTime >= interval.EndTime)
            {
                throw new InvalidOperationException("Schedule start time must be earlier than end time.");
            }

            var duplicateKey = $"{(int)interval.DayOfWeek}:{interval.ServiceId}:{interval.StartTime}:{interval.EndTime}";
            if (!duplicateKeys.Add(duplicateKey))
            {
                throw new InvalidOperationException("Duplicate schedule intervals are not allowed.");
            }
        }

        foreach (var dayGroup in intervals.GroupBy(item => new { item.DayOfWeek, item.ServiceId }))
        {
            var ordered = dayGroup
                .OrderBy(item => item.StartTime)
                .ThenBy(item => item.EndTime)
                .ToList();

            for (var index = 1; index < ordered.Count; index++)
            {
                if (ordered[index].StartTime < ordered[index - 1].EndTime)
                {
                    throw new InvalidOperationException("Overlapping schedule intervals are not allowed for the same day and service.");
                }
            }
        }
    }

    internal static void ValidateUnavailabilityRequest(ProviderUnavailabilityUpsertRequest request)
    {
        if (request.StartDatetime >= request.EndDatetime)
        {
            throw new InvalidOperationException("Unavailability startDatetime must be earlier than endDatetime.");
        }

        if (request.StartDatetime.Date != request.EndDatetime.Date)
        {
            throw new InvalidOperationException("Cross-midnight unavailability windows are not supported.");
        }
    }
}
