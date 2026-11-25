using System.Globalization;
using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Query to retrieve localized service presets for the authenticated provider's category.
/// </summary>
public record GetProviderPresetsQuery(Guid UserId) : IRequest<IReadOnlyList<ProviderServicePresetResponse>>;

/// <summary>
/// Handles <see cref="GetProviderPresetsQuery"/> by resolving the provider category,
/// loading active presets, localizing labels, and caching the results per UI culture.
/// </summary>
public class GetProviderPresetsHandler
    : IRequestHandler<GetProviderPresetsQuery, IReadOnlyList<ProviderServicePresetResponse>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    private readonly SanadDbContext _db;
    private readonly IProviderRepository _providerRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<GetProviderPresetsHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetProviderPresetsHandler"/> class.
    /// </summary>
    public GetProviderPresetsHandler(
        SanadDbContext db,
        IProviderRepository providerRepository,
        IMemoryCache cache,
        ILogger<GetProviderPresetsHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Returns localized presets for the authenticated provider's service category.
    /// </summary>
    public async Task<IReadOnlyList<ProviderServicePresetResponse>> Handle(
        GetProviderPresetsQuery request,
        CancellationToken cancellationToken)
    {
        var providerInfo = await _providerRepository.GetProviderIdAndCategoryByUserIdAsync(
            request.UserId,
            cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        var category = providerInfo.ServiceCategory;
        var lang = ProviderPresetCacheHelper.NormalizeLanguage(
            CultureInfo.CurrentUICulture.TwoLetterISOLanguageName);
        var cacheKey = ProviderPresetCacheHelper.GetCacheKey(category, lang);

        if (_cache.TryGetValue(cacheKey, out IReadOnlyList<ProviderServicePresetResponse>? cached)
            && cached is not null)
        {
            _logger.LogDebug("Cache hit for provider presets: {CacheKey}", cacheKey);
            return cached;
        }

        _logger.LogDebug("Cache miss for provider presets: {CacheKey}", cacheKey);

        var result = await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheTtl;

            var presets = await _db.ProviderServicePresets
                .AsNoTracking()
                .Where(p => p.ProviderCategory == category && p.IsActive)
                .OrderBy(p => p.DisplayOrder)
                .ThenBy(p => p.Code)
                .Select(p => new
                {
                    p.Id,
                    p.Code,
                    p.NameEn,
                    p.NameFr,
                    p.NameAr,
                    p.NameDe,
                    p.DescriptionEn,
                    p.DescriptionFr,
                    p.DescriptionAr,
                    p.DescriptionDe,
                    p.DisplayOrder,
                    p.Price,
                    p.PriceType,
                    p.Currency,
                    p.DurationMinutes,
                    p.ServiceLocation,
                    p.RequiresPrescription,
                    p.IsUrgent,
                    p.RequiresMedicalHistory,
                    p.TypeConfig
                })
                .ToListAsync(cancellationToken);

            var items = presets
                .Select(p => new ProviderServicePresetResponse
                {
                    Id = p.Id,
                    Code = p.Code,
                    Name = GetLocalizedName(lang, p.NameEn, p.NameFr, p.NameAr, p.NameDe),
                    Description = GetLocalizedDescription(
                        lang,
                        p.DescriptionEn,
                        p.DescriptionFr,
                        p.DescriptionAr,
                        p.DescriptionDe),
                    DisplayOrder = p.DisplayOrder,
                    Draft = new ProviderServicePresetDraftPayload
                    {
                        Price = p.Price,
                        PriceType = p.PriceType,
                        Currency = p.Currency,
                        DurationMinutes = p.DurationMinutes,
                        ServiceLocation = p.ServiceLocation,
                        RequiresPrescription = p.RequiresPrescription,
                        IsUrgent = p.IsUrgent,
                        RequiresMedicalHistory = p.RequiresMedicalHistory,
                        TypeConfig = DeserializeTypeConfig(p.TypeConfig)
                    }
                })
                .ToList();

            _logger.LogDebug(
                "Cached {Count} provider presets for key {CacheKey} with TTL {CacheTtl}",
                items.Count,
                cacheKey,
                CacheTtl);

            return (IReadOnlyList<ProviderServicePresetResponse>)items;
        }) ?? Array.Empty<ProviderServicePresetResponse>();

        return result;
    }

    private static string GetLocalizedName(
        string lang,
        string nameEn,
        string nameFr,
        string? nameAr,
        string? nameDe)
        => lang == "en" ? nameEn
         : lang == "ar" ? (nameAr ?? nameFr)
         : lang == "de" ? (nameDe ?? nameEn)
         : nameFr;

    private static string? GetLocalizedDescription(
        string lang,
        string? descriptionEn,
        string? descriptionFr,
        string? descriptionAr,
        string? descriptionDe)
        => lang == "en" ? (descriptionEn ?? descriptionFr)
         : lang == "ar" ? (descriptionAr ?? descriptionFr)
         : lang == "de" ? (descriptionDe ?? descriptionEn ?? descriptionFr)
         : descriptionFr;

    private static JsonElement? DeserializeTypeConfig(string? typeConfig)
    {
        if (string.IsNullOrWhiteSpace(typeConfig))
            return null;

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(typeConfig);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
