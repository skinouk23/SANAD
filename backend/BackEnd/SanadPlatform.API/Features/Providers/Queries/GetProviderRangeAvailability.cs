using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns the daily start times that remain valid for every day in a selected booking range.
/// </summary>
public record GetProviderRangeAvailabilityQuery(
    Guid ProviderId,
    DateOnly StartDate,
    DateOnly EndDate,
    IReadOnlyList<Guid> ServiceIds) : IRequest<ProviderRangeAvailabilityResponse>;

/// <summary>
/// Handles <see cref="GetProviderRangeAvailabilityQuery"/>.
/// </summary>
public class GetProviderRangeAvailabilityHandler
    : IRequestHandler<GetProviderRangeAvailabilityQuery, ProviderRangeAvailabilityResponse>
{
    private readonly IProviderRangeAvailabilityService _rangeAvailabilityService;

    public GetProviderRangeAvailabilityHandler(IProviderRangeAvailabilityService rangeAvailabilityService)
    {
        _rangeAvailabilityService = rangeAvailabilityService ?? throw new ArgumentNullException(nameof(rangeAvailabilityService));
    }

    public async Task<ProviderRangeAvailabilityResponse> Handle(
        GetProviderRangeAvailabilityQuery query,
        CancellationToken cancellationToken)
    {
        var availability = await _rangeAvailabilityService.GetRangeAvailabilityAsync(
            query.ProviderId,
            query.StartDate,
            query.EndDate,
            query.ServiceIds
                .Distinct()
                .Select(serviceId => new ProviderRequestedServiceItem(serviceId, 1))
                .ToList()
                .AsReadOnly(),
            cancellationToken);

        return new ProviderRangeAvailabilityResponse
        {
            ProviderId = availability.ProviderId,
            StartDate = availability.StartDate,
            EndDate = availability.EndDate,
            DayCount = availability.DayCount,
            DailyDurationMinutes = availability.DailyDurationMinutes,
            AvailableStartTimes = availability.AvailableStartTimes
                .Select(time => time.ToString("HH:mm"))
                .ToList()
                .AsReadOnly(),
            Timezone = availability.Timezone
        };
    }
}
