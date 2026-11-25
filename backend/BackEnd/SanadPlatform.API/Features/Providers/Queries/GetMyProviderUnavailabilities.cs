using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Returns the authenticated provider's unavailability windows in provider-local time.
/// </summary>
public record GetMyProviderUnavailabilitiesQuery(
    Guid UserId,
    DateOnly From,
    DateOnly To) : IRequest<IReadOnlyList<ProviderUnavailabilityResponse>>;

/// <summary>
/// Handles <see cref="GetMyProviderUnavailabilitiesQuery"/>.
/// </summary>
public class GetMyProviderUnavailabilitiesQueryHandler
    : IRequestHandler<GetMyProviderUnavailabilitiesQuery, IReadOnlyList<ProviderUnavailabilityResponse>>
{
    private readonly IProviderRepository _providerRepository;

    public GetMyProviderUnavailabilitiesQueryHandler(IProviderRepository providerRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
    }

    public async Task<IReadOnlyList<ProviderUnavailabilityResponse>> Handle(
        GetMyProviderUnavailabilitiesQuery query,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(query.UserId, cancellationToken);
        if (provider is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{query.UserId}'.");
        }

        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone ?? "Africa/Tunis");
        var utcWindowStart = TimeZoneInfo.ConvertTimeToUtc(
            query.From.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified),
            providerTz);
        var utcWindowEndExclusive = TimeZoneInfo.ConvertTimeToUtc(
            query.To.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified),
            providerTz);

        var items = await _providerRepository.GetUnavailabilitiesByUserIdAsync(
            query.UserId,
            utcWindowStart,
            utcWindowEndExclusive,
            cancellationToken);

        return items
            .Select(item => item.ToResponse(providerTz))
            .ToList()
            .AsReadOnly();
    }
}
