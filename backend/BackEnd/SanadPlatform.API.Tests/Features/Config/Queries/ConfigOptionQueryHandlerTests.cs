using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Features.Ambulance.Queries;
using SanadPlatform.API.Features.Nutrition.Entities;
using SanadPlatform.API.Features.Nutrition.Queries;
using SanadPlatform.API.Features.Veterinary.Entities;
using SanadPlatform.API.Features.Veterinary.Queries;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Config.Queries;

public class ConfigOptionQueryHandlerTests
{
    [Fact]
    public async Task GetNutritionSubcategoriesHandler_UsesCultureAwareCache_AndLogsHitMiss()
    {
        await using var context = CreateContext();
        context.NutritionSubcategoryConfigs.Add(CreateNutritionSubcategory(
            code: "consultation",
            nameEn: "Consultation",
            nameFr: "Consultation FR",
            nameAr: "استشارة",
            nameDe: "Beratung",
            displayOrder: 1));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetNutritionSubcategoriesHandler>();
        var handler = new GetNutritionSubcategoriesHandler(context, cache, logger);

        IReadOnlyList<SanadPlatform.API.Common.DTOs.ConfigOptionResponse> firstEnglish;
        using (new UiCultureScope("en"))
        {
            firstEnglish = await handler.Handle(new GetNutritionSubcategoriesQuery(), CancellationToken.None);
        }

        Assert.Single(firstEnglish);
        Assert.Equal("Consultation", firstEnglish[0].Label);

        context.NutritionSubcategoryConfigs.Add(CreateNutritionSubcategory(
            code: "meal_plan",
            nameEn: "Meal Plan",
            nameFr: "Plan alimentaire",
            nameAr: "خطة وجبات",
            nameDe: null,
            displayOrder: 2));
        await context.SaveChangesAsync();

        IReadOnlyList<SanadPlatform.API.Common.DTOs.ConfigOptionResponse> cachedEnglish;
        using (new UiCultureScope("en"))
        {
            cachedEnglish = await handler.Handle(new GetNutritionSubcategoriesQuery(), CancellationToken.None);
        }

        Assert.Single(cachedEnglish);
        Assert.Equal("Consultation", cachedEnglish[0].Label);

        IReadOnlyList<SanadPlatform.API.Common.DTOs.ConfigOptionResponse> french;
        using (new UiCultureScope("fr"))
        {
            french = await handler.Handle(new GetNutritionSubcategoriesQuery(), CancellationToken.None);
        }

        Assert.Equal(2, french.Count);
        Assert.Equal("Consultation FR", french[0].Label);
        Assert.Contains(logger.Entries, entry => entry.Message.Contains("Cache miss for nutrition subcategories", StringComparison.Ordinal));
        Assert.Contains(logger.Entries, entry => entry.Message.Contains("Cache hit for nutrition subcategories", StringComparison.Ordinal));
    }

    [Fact]
    public async Task GetNutritionDietTypesHandler_UsesArabicFallbackToFrench_WhenArabicNameIsMissing()
    {
        await using var context = CreateContext();
        context.NutritionDietTypeConfigs.Add(new NutritionDietTypeConfig
        {
            Code = "low_salt",
            NameEn = "Low Salt",
            NameFr = "Faible en sel",
            NameAr = null,
            NameDe = null,
            Icon = "salt",
            Color = "#64748b",
            IsActive = true,
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetNutritionDietTypesHandler>();
        var handler = new GetNutritionDietTypesHandler(context, cache, logger);

        IReadOnlyList<SanadPlatform.API.Common.DTOs.ConfigOptionResponse> result;
        using (new UiCultureScope("ar"))
        {
            result = await handler.Handle(new GetNutritionDietTypesQuery(), CancellationToken.None);
        }

        Assert.Single(result);
        Assert.Equal("Faible en sel", result[0].Label);
        Assert.Contains(logger.Entries, entry => entry.Message.Contains("Cache miss for nutrition diet types", StringComparison.Ordinal));
    }

    [Fact]
    public async Task GetAmbulanceServiceTypesHandler_UsesGermanFallbackToEnglish_WhenGermanNameIsMissing()
    {
        await using var context = CreateContext();
        context.AmbulanceServiceTypeConfigs.Add(new AmbulanceServiceTypeConfig
        {
            Code = "emergency",
            NameEn = "Emergency",
            NameFr = "Urgence",
            NameAr = "طوارئ",
            NameDe = null,
            Icon = "ambulance",
            Color = "#ef4444",
            IsActive = true,
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetAmbulanceServiceTypesHandler>();
        var handler = new GetAmbulanceServiceTypesHandler(context, cache, logger);

        IReadOnlyList<SanadPlatform.API.Common.DTOs.ConfigOptionResponse> result;
        using (new UiCultureScope("de"))
        {
            result = await handler.Handle(new GetAmbulanceServiceTypesQuery(), CancellationToken.None);
        }

        Assert.Single(result);
        Assert.Equal("Emergency", result[0].Label);
        Assert.Contains(logger.Entries, entry => entry.Message.Contains("Cache miss for ambulance service types", StringComparison.Ordinal));
    }

    [Fact]
    public async Task GetVeterinaryAnimalTypesHandler_UsesGermanName_WhenAvailable()
    {
        await using var context = CreateContext();
        context.VeterinaryAnimalTypeConfigs.Add(new VeterinaryAnimalTypeConfig
        {
            Code = "dog",
            NameEn = "Dog",
            NameFr = "Chien",
            NameAr = "كلب",
            NameDe = "Hund",
            Icon = "paw-print",
            Color = "#f59e0b",
            IsActive = true,
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetVeterinaryAnimalTypesHandler>();
        var handler = new GetVeterinaryAnimalTypesHandler(context, cache, logger);

        IReadOnlyList<SanadPlatform.API.Common.DTOs.ConfigOptionResponse> result;
        using (new UiCultureScope("de"))
        {
            result = await handler.Handle(new GetVeterinaryAnimalTypesQuery(), CancellationToken.None);
        }

        Assert.Single(result);
        Assert.Equal("Hund", result[0].Label);
        Assert.Contains(logger.Entries, entry => entry.Message.Contains("Cache miss for veterinary animal types", StringComparison.Ordinal));
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    private static NutritionSubcategoryConfig CreateNutritionSubcategory(
        string code,
        string nameEn,
        string nameFr,
        string? nameAr,
        string? nameDe,
        int displayOrder)
    {
        return new NutritionSubcategoryConfig
        {
            Code = code,
            NameEn = nameEn,
            NameFr = nameFr,
            NameAr = nameAr,
            NameDe = nameDe,
            Icon = "utensils-crossed",
            Color = "#f59e0b",
            IsActive = true,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow
        };
    }

    private sealed class UiCultureScope : IDisposable
    {
        private readonly CultureInfo _previousCulture;
        private readonly CultureInfo _previousUiCulture;

        public UiCultureScope(string cultureName)
        {
            _previousCulture = CultureInfo.CurrentCulture;
            _previousUiCulture = CultureInfo.CurrentUICulture;

            var culture = CultureInfo.GetCultureInfo(cultureName);
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;
        }

        public void Dispose()
        {
            CultureInfo.CurrentCulture = _previousCulture;
            CultureInfo.CurrentUICulture = _previousUiCulture;
        }
    }

    private sealed class ListLogger<T> : ILogger<T>
    {
        public List<LogEntry> Entries { get; } = [];

        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull
            => NullScope.Instance;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            Entries.Add(new LogEntry(logLevel, formatter(state, exception)));
        }
    }

    private sealed record LogEntry(LogLevel Level, string Message);

    private sealed class NullScope : IDisposable
    {
        public static NullScope Instance { get; } = new();

        public void Dispose()
        {
        }
    }
}
