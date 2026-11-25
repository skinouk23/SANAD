using MediatR;
using Microsoft.Extensions.Caching.Memory;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Features.Equipment.Repository;

namespace SanadPlatform.API.Features.Equipment.Queries;

/// <summary>
/// Returns all active equipment categories.
/// </summary>
public record GetEquipmentCategoriesQuery : IRequest<IReadOnlyList<EquipmentCategoryResponse>>;

/// <summary>
/// Handles <see cref="GetEquipmentCategoriesQuery"/> by querying the repository
/// and caching the result for one hour.
/// </summary>
public class GetEquipmentCategoriesHandler
    : IRequestHandler<GetEquipmentCategoriesQuery, IReadOnlyList<EquipmentCategoryResponse>>
{
    private readonly IEquipmentRepository _repository;
    private readonly IMemoryCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEquipmentCategoriesHandler"/> class.
    /// </summary>
    public GetEquipmentCategoriesHandler(IEquipmentRepository repository, IMemoryCache cache)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    /// <summary>
    /// Returns cached equipment categories, loading from the database on cache miss.
    /// </summary>
    public async Task<IReadOnlyList<EquipmentCategoryResponse>> Handle(
        GetEquipmentCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        if (!_cache.TryGetValue(EquipmentConstants.CategoriesCacheKey, out IReadOnlyList<EquipmentCategoryResponse>? categories))
        {
            categories = await _repository.GetCategoriesAsync(cancellationToken);

            categories ??= Array.Empty<EquipmentCategoryResponse>();

            _cache.Set(EquipmentConstants.CategoriesCacheKey, categories, TimeSpan.FromHours(1));
        }

        return categories!;
    }
}
