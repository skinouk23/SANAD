using MediatR;
using Microsoft.Extensions.Caching.Memory;
using SanadPlatform.API.Features.AppFeatures.DTOs;
using SanadPlatform.API.Features.AppFeatures.Repository;

namespace SanadPlatform.API.Features.AppFeatures.Queries;

/// <summary>
/// Returns all global app features, including inactive rows.
/// </summary>
public record GetFeaturesQuery : IRequest<IReadOnlyList<FeatureResponse>>;

/// <summary>
/// Handles <see cref="GetFeaturesQuery"/> using a short-lived in-memory cache.
/// </summary>
public class GetFeaturesQueryHandler : IRequestHandler<GetFeaturesQuery, IReadOnlyList<FeatureResponse>>
{
    private const string CacheKey = "app-features:all";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

    private readonly IFeatureRepository _repository;
    private readonly IMemoryCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetFeaturesQueryHandler"/> class.
    /// </summary>
    public GetFeaturesQueryHandler(IFeatureRepository repository, IMemoryCache cache)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    /// <summary>
    /// Retrieves cached feature DTOs, or refreshes them from the repository.
    /// </summary>
    public async Task<IReadOnlyList<FeatureResponse>> Handle(
        GetFeaturesQuery request,
        CancellationToken cancellationToken)
    {
        var result = await _cache.GetOrCreateAsync(CacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;

            return await _repository.GetAllAsync(cancellationToken);
        });

        return result!;
    }
}
