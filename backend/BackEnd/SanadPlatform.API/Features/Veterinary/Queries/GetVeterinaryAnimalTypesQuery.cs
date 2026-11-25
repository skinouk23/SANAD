using System.Globalization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.DTOs;
using SanadPlatform.API.Features.Veterinary.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Veterinary.Queries;

/// <summary>
/// Returns all active veterinary animal type options.
/// </summary>
public record GetVeterinaryAnimalTypesQuery : IRequest<IReadOnlyList<ConfigOptionResponse>>;

/// <summary>
/// Handles <see cref="GetVeterinaryAnimalTypesQuery"/> by fetching localized options
/// from the config table and caching them per UI culture for 5 minutes.
/// </summary>
public class GetVeterinaryAnimalTypesHandler
    : IRequestHandler<GetVeterinaryAnimalTypesQuery, IReadOnlyList<ConfigOptionResponse>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    private readonly SanadDbContext _db;
    private readonly IMemoryCache _cache;
    private readonly ILogger<GetVeterinaryAnimalTypesHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetVeterinaryAnimalTypesHandler"/> class.
    /// </summary>
    public GetVeterinaryAnimalTypesHandler(
        SanadDbContext db,
        IMemoryCache cache,
        ILogger<GetVeterinaryAnimalTypesHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Returns localized veterinary animal type options, cached per UI culture.
    /// </summary>
    public async Task<IReadOnlyList<ConfigOptionResponse>> Handle(
        GetVeterinaryAnimalTypesQuery request,
        CancellationToken cancellationToken)
    {
        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        var cacheKey = $"veterinary-animal-types:{lang}";

        if (_cache.TryGetValue(cacheKey, out IReadOnlyList<ConfigOptionResponse>? cached)
            && cached is not null)
        {
            _logger.LogDebug("Cache hit for veterinary animal types: {CacheKey}", cacheKey);
            return cached;
        }

        _logger.LogDebug("Cache miss for veterinary animal types: {CacheKey}", cacheKey);

        var result = await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheTtl;

            var options = await _db.VeterinaryAnimalTypeConfigs
                .AsNoTracking()
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new VeterinaryAnimalTypeConfig
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
                "Cached {Count} veterinary animal types for key {CacheKey} with TTL {CacheTtl}",
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
