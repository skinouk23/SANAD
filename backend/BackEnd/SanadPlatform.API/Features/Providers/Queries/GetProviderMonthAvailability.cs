using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns the number of valid daily start times that remain for each day in a selected calendar month.
/// </summary>
public record GetProviderMonthAvailabilityQuery(
    Guid ProviderId,
    int Year,
    int Month,
    IReadOnlyList<Guid> ServiceIds) : IRequest<ProviderMonthAvailabilityResponse>;

/// <summary>
/// Handles <see cref="GetProviderMonthAvailabilityQuery"/>.
/// </summary>
public class GetProviderMonthAvailabilityHandler
    : IRequestHandler<GetProviderMonthAvailabilityQuery, ProviderMonthAvailabilityResponse>
{
    private readonly IProviderRangeAvailabilityService _rangeAvailabilityService;

    public GetProviderMonthAvailabilityHandler(IProviderRangeAvailabilityService rangeAvailabilityService)
    {
        _rangeAvailabilityService = rangeAvailabilityService ?? throw new ArgumentNullException(nameof(rangeAvailabilityService));
    }

    public async Task<ProviderMonthAvailabilityResponse> Handle(
        GetProviderMonthAvailabilityQuery query,
        CancellationToken cancellationToken)
    {
        var availability = await _rangeAvailabilityService.GetMonthAvailabilityAsync(
            query.ProviderId,
            query.Year,
            query.Month,
            query.ServiceIds
                .Distinct()
                .Select(serviceId => new ProviderRequestedServiceItem(serviceId, 1))
                .ToList()
                .AsReadOnly(),
            cancellationToken);

        return new ProviderMonthAvailabilityResponse
        {
            ProviderId = availability.ProviderId,
            Year = availability.Year,
            Month = availability.Month,
            DailyDurationMinutes = availability.DailyDurationMinutes,
            Timezone = availability.Timezone,
            MaxBookableDate = availability.MaxBookableDate,
            Days = availability.Days
                .Select(day => new ProviderMonthAvailabilityDayResponse
                {
                    Date = day.Date,
                    SlotCount = day.SlotCount
                })
                .ToList()
                .AsReadOnly()
        };
    }
}
