using System.Globalization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.DTOs;
using SanadPlatform.API.Features.Nutrition.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Nutrition.Queries;

/// <summary>
/// Returns all active nutrition diet type options.
/// </summary>
public record GetNutritionDietTypesQuery : IRequest<IReadOnlyList<ConfigOptionResponse>>;

/// <summary>
/// Handles <see cref="GetNutritionDietTypesQuery"/> by fetching localized options
/// from the config table and caching them per UI culture for 5 minutes.
/// </summary>
public class GetNutritionDietTypesHandler
    : IRequestHandler<GetNutritionDietTypesQuery, IReadOnlyList<ConfigOptionResponse>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    private readonly SanadDbContext _db;
    private readonly IMemoryCache _cache;
    private readonly ILogger<GetNutritionDietTypesHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetNutritionDietTypesHandler"/> class.
    /// </summary>
    public GetNutritionDietTypesHandler(
        SanadDbContext db,
        IMemoryCache cache,
        ILogger<GetNutritionDietTypesHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Returns localized nutrition diet type options, cached per UI culture.
    /// </summary>
    public async Task<IReadOnlyList<ConfigOptionResponse>> Handle(
        GetNutritionDietTypesQuery request,
        CancellationToken cancellationToken)
    {
        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        var cacheKey = $"nutrition-diet-types:{lang}";

        if (_cache.TryGetValue(cacheKey, out IReadOnlyList<ConfigOptionResponse>? cached)
            && cached is not null)
        {
            _logger.LogDebug("Cache hit for nutrition diet types: {CacheKey}", cacheKey);
            return cached;
        }

        _logger.LogDebug("Cache miss for nutrition diet types: {CacheKey}", cacheKey);

        var result = await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheTtl;

            var options = await _db.NutritionDietTypeConfigs
                .AsNoTracking()
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new NutritionDietTypeConfig
                {
                    Code = c.Code,
                    NameEn = c.NameEn,
                    NameFr = c.NameFr,
                    NameAr = c.NameAr,
                    NameDe = c.NameDe,
                    Icon = c.Icon,
                    Color = c.Color,
                })
                .ToListAsync(cancellationToken);

            var items = options
                .Select(c => new ConfigOptionResponse
                {
                    Code = c.Code,
                    Label = GetLocalizedLabel(lang, c.NameEn, c.NameFr, c.NameAr, c.NameDe),
                    Icon = c.Icon,
                    Color = c.Color
                })
                .ToList();

            _logger.LogDebug(
                "Cached {Count} nutrition diet types for key {CacheKey} with TTL {CacheTtl}",
                items.Count,
                cacheKey,
                CacheTtl);

            return (IReadOnlyList<ConfigOptionResponse>)items;
        }) ?? Array.Empty<ConfigOptionResponse>();

        return result;
    }

    private static string GetLocalizedLabel(
        string lang,
        string nameEn,
        string nameFr,
        string? nameAr,
        string? nameDe)
        => lang == "en" ? nameEn
         : lang == "ar" ? (nameAr ?? nameFr)
         : lang == "de" ? (nameDe ?? nameEn)
         : nameFr;
}
