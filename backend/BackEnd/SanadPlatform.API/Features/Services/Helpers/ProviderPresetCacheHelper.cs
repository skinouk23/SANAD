using Microsoft.Extensions.Caching.Memory;

namespace SanadPlatform.API.Features.Services.Helpers;

/// <summary>
/// Shared cache helpers for provider preset read and mutation flows.
/// </summary>
public static class ProviderPresetCacheHelper
{
    private static readonly string[] SupportedLanguages = ["fr", "en", "ar", "de"];

    /// <summary>
    /// Normalizes the incoming UI culture code onto a supported provider preset cache bucket.
    /// Unsupported cultures fall back to the French localization bucket.
    /// </summary>
    public static string NormalizeLanguage(string twoLetterLang)
    {
        if (string.IsNullOrWhiteSpace(twoLetterLang))
        {
            return "fr";
        }

        return twoLetterLang.Trim().ToLowerInvariant() switch
        {
            "en" => "en",
            "ar" => "ar",
            "de" => "de",
            _ => "fr"
        };
    }

    /// <summary>
    /// Builds the provider preset cache key for a category and normalized language bucket.
    /// </summary>
    public static string GetCacheKey(string category, string lang)
        => $"provider-presets:{category}:{NormalizeLanguage(lang)}";

    /// <summary>
    /// Invalidates every localized cache entry for a provider category.
    /// </summary>
    public static void InvalidateCategory(IMemoryCache cache, string category)
    {
        ArgumentNullException.ThrowIfNull(cache);
        ArgumentNullException.ThrowIfNull(category);

        foreach (var language in SupportedLanguages)
        {
            cache.Remove(GetCacheKey(category, language));
        }
    }
}
