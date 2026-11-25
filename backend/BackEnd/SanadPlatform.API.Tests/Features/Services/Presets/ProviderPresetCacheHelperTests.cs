using Microsoft.Extensions.Caching.Memory;
using SanadPlatform.API.Features.Services.Helpers;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class ProviderPresetCacheHelperTests
{
    [Theory]
    [InlineData("en", "en")]
    [InlineData("ar", "ar")]
    [InlineData("de", "de")]
    [InlineData("fr", "fr")]
    [InlineData("nl", "fr")]
    [InlineData("zh", "fr")]
    [InlineData("", "fr")]
    [InlineData("  ", "fr")]
    public void NormalizeLanguage_MapsCulturesToSupportedBuckets(string input, string expected)
    {
        var normalized = ProviderPresetCacheHelper.NormalizeLanguage(input);

        Assert.Equal(expected, normalized);
    }

    [Fact]
    public void GetCacheKey_NormalizesUnsupportedCultures()
    {
        var cacheKey = ProviderPresetCacheHelper.GetCacheKey("nutrition", "nl");

        Assert.Equal("provider-presets:nutrition:fr", cacheKey);
    }

    [Fact]
    public void InvalidateCategory_RemovesAllSupportedLanguageEntries_ForCategoryOnly()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());

        cache.Set(ProviderPresetCacheHelper.GetCacheKey("nutrition", "fr"), "fr");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey("nutrition", "en"), "en");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey("nutrition", "ar"), "ar");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey("nutrition", "de"), "de");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey("nursing", "fr"), "other-category");

        ProviderPresetCacheHelper.InvalidateCategory(cache, "nutrition");

        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "fr"), out _));
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "en"), out _));
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "ar"), out _));
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "de"), out _));
        Assert.True(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nursing", "fr"), out _));
    }
}
