using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns the authenticated provider's weekly schedule intervals.
/// </summary>
public record GetMyProviderSchedulesQuery(Guid UserId) : IRequest<IReadOnlyList<ProviderScheduleIntervalResponse>>;

/// <summary>
/// Handles <see cref="GetMyProviderSchedulesQuery"/>.
/// </summary>
public class GetMyProviderSchedulesQueryHandler : IRequestHandler<GetMyProviderSchedulesQuery, IReadOnlyList<ProviderScheduleIntervalResponse>>
{
    private readonly IProviderRepository _providerRepository;

    public GetMyProviderSchedulesQueryHandler(IProviderRepository providerRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
    }

    public async Task<IReadOnlyList<ProviderScheduleIntervalResponse>> Handle(
        GetMyProviderSchedulesQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken);
        if (providerId is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{query.UserId}'.");
        }

        var schedules = await _providerRepository.GetSchedulesByUserIdAsync(query.UserId, cancellationToken);
        return schedules
            .Select(schedule => schedule.ToScheduleResponse())
            .ToList()
            .AsReadOnly();
    }
}
