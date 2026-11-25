using System.Globalization;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Repository;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Returns all active service categories grouped by DisplayGroup.
/// </summary>
public record GetServiceCategoriesQuery : IRequest<IReadOnlyList<ServiceCategoryGroupResponse>>;

/// <summary>
/// Handles <see cref="GetServiceCategoriesQuery"/> by fetching categories from the
/// repository and grouping them by display group with localized labels.
/// Results are cached in-memory for 5 minutes, keyed by UI culture.
/// </summary>
public class GetServiceCategoriesHandler
    : IRequestHandler<GetServiceCategoriesQuery, IReadOnlyList<ServiceCategoryGroupResponse>>
{
    private readonly IServiceRepository _repository;
    private readonly IMemoryCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetServiceCategoriesHandler"/> class.
    /// </summary>
    public GetServiceCategoriesHandler(IServiceRepository repository, IMemoryCache cache)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    /// <summary>
    /// Fetches active categories, localizes labels, and groups by DisplayGroup.
    /// Results are cached per UI culture for 5 minutes using atomic get-or-create.
    /// </summary>
    public async Task<IReadOnlyList<ServiceCategoryGroupResponse>> Handle(
        GetServiceCategoriesQuery request,
        CancellationToken cancellationToken)
    {
        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        var cacheKey = $"service-categories:{lang}";

        var result = await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

            var categories = await _repository.GetCategoriesAsync(cancellationToken);

            var grouped = categories
                .GroupBy(c => c.DisplayGroup)
                .Select(g => new ServiceCategoryGroupResponse
                {
                    DisplayGroup = g.Key.ToString(),
                    Categories = g
                        .OrderBy(c => c.DisplayOrder)
                        .Select(c => new ServiceCategoryResponse
                        {
                            Code = c.Code,
                            Label = lang == "en" ? c.NameEn
                                  : lang == "ar" ? (c.NameAr ?? c.NameFr)
                                  : c.NameFr,
                            Description = lang switch
                            {
                                "en" => c.DescriptionEn ?? c.DescriptionFr,
                                "ar" => c.DescriptionAr ?? c.DescriptionFr,
                                "de" => c.DescriptionDe ?? c.DescriptionEn ?? c.DescriptionFr,
                                _ => c.DescriptionFr
                            },
                            Icon = c.Icon,
                            Color = c.Color,
                            Badge = c.Badge,
                            DisplayOrder = c.DisplayOrder,
                            MinPrice = c.MinPrice,
                            MaxPrice = c.MaxPrice
                        })
                        .ToList()
                })
                .ToList();

            return (IReadOnlyList<ServiceCategoryGroupResponse>)grouped;
        });

        return result!;
    }
}
