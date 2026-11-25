using System.Globalization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.DTOs;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Ambulance.Queries;

/// <summary>
/// Returns all active ambulance service type options.
/// </summary>
public record GetAmbulanceServiceTypesQuery : IRequest<IReadOnlyList<ConfigOptionResponse>>;

/// <summary>
/// Handles <see cref="GetAmbulanceServiceTypesQuery"/> by fetching localized options
/// from the config table and caching them per UI culture for 5 minutes.
/// </summary>
public class GetAmbulanceServiceTypesHandler
    : IRequestHandler<GetAmbulanceServiceTypesQuery, IReadOnlyList<ConfigOptionResponse>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    private readonly SanadDbContext _db;
    private readonly IMemoryCache _cache;
    private readonly ILogger<GetAmbulanceServiceTypesHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAmbulanceServiceTypesHandler"/> class.
    /// </summary>
    public GetAmbulanceServiceTypesHandler(
        SanadDbContext db,
        IMemoryCache cache,
        ILogger<GetAmbulanceServiceTypesHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Returns localized ambulance service type options, cached per UI culture.
    /// </summary>
    public async Task<IReadOnlyList<ConfigOptionResponse>> Handle(
        GetAmbulanceServiceTypesQuery request,
        CancellationToken cancellationToken)
    {
        var lang = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
        var cacheKey = $"ambulance-service-types:{lang}";

        if (_cache.TryGetValue(cacheKey, out IReadOnlyList<ConfigOptionResponse>? cached)
            && cached is not null)
        {
            _logger.LogDebug("Cache hit for ambulance service types: {CacheKey}", cacheKey);
            return cached;
        }

        _logger.LogDebug("Cache miss for ambulance service types: {CacheKey}", cacheKey);

        var result = await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheTtl;

            var options = await _db.AmbulanceServiceTypeConfigs
                .AsNoTracking()
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new AmbulanceServiceTypeConfig
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
                "Cached {Count} ambulance service types for key {CacheKey} with TTL {CacheTtl}",
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
