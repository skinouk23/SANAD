using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Admin.Entities;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Features.Nutrition.Entities;
using SanadPlatform.API.Features.Veterinary.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Infrastructure.Database;

public class DataSeederConfigLookupTests
{
    [Fact]
    public void SanadDbContext_ExposesDbSets_ForNewConfigEntities()
    {
        AssertDbSet<NutritionSubcategoryConfig>(nameof(SanadDbContext.NutritionSubcategoryConfigs));
        AssertDbSet<NutritionDietTypeConfig>(nameof(SanadDbContext.NutritionDietTypeConfigs));
        AssertDbSet<AmbulanceServiceTypeConfig>(nameof(SanadDbContext.AmbulanceServiceTypeConfigs));
        AssertDbSet<VeterinaryAnimalTypeConfig>(nameof(SanadDbContext.VeterinaryAnimalTypeConfigs));
    }

    [Fact]
    public void SanadDbContext_MapsNewConfigEntities_ToExpectedTablesWithUniqueCodeIndexes()
    {
        using var context = CreateContext();

        AssertEntityMapping<NutritionSubcategoryConfig>(context, "nutrition_subcategories_config");
        AssertEntityMapping<NutritionDietTypeConfig>(context, "nutrition_diet_types_config");
        AssertEntityMapping<AmbulanceServiceTypeConfig>(context, "ambulance_service_types_config");
        AssertEntityMapping<VeterinaryAnimalTypeConfig>(context, "veterinary_animal_types_config");
    }

    [Fact]
    public async Task SeedNutritionSubcategoriesAsync_AddsExpectedRows_AndIsIdempotent()
    {
        await AssertSeedMethodAsync<NutritionSubcategoryConfig>(
            "SeedNutritionSubcategoriesAsync",
            "consultation",
            "meal_plan",
            "meal_delivery");
    }

    [Fact]
    public async Task SeedNutritionDietTypesAsync_AddsExpectedRows_AndIsIdempotent()
    {
        await AssertSeedMethodAsync<NutritionDietTypeConfig>(
            "SeedNutritionDietTypesAsync",
            "diabetic",
            "low_salt",
            "cardiac",
            "gluten_free",
            "vegetarian",
            "vegan");
    }

    [Fact]
    public async Task SeedAmbulanceServiceTypesAsync_AddsExpectedRows_AndIsIdempotent()
    {
        await AssertSeedMethodAsync<AmbulanceServiceTypeConfig>(
            "SeedAmbulanceServiceTypesAsync",
            "emergency",
            "inter_hospital",
            "repatriation",
            "event_assistance");
    }

    [Fact]
    public async Task SeedVeterinaryAnimalTypesAsync_AddsExpectedRows_AndIsIdempotent()
    {
        await AssertSeedMethodAsync<VeterinaryAnimalTypeConfig>(
            "SeedVeterinaryAnimalTypesAsync",
            "dog",
            "cat",
            "bird",
            "reptile",
            "nac",
            "horse");
    }

    [Fact]
    public async Task SeedSystemSettingsAsync_AddsBookingAdvanceWindowAs365_AndIsIdempotent()
    {
        using var context = CreateContext();
        var seeder = new DataSeeder(context, context, NullLogger<DataSeeder>.Instance);

        await InvokePrivateSeedAsync(seeder, "SeedSystemSettingsAsync");
        await InvokePrivateSeedAsync(seeder, "SeedSystemSettingsAsync");

        var settings = await context.Set<SystemSetting>()
            .AsNoTracking()
            .ToDictionaryAsync(setting => setting.SettingKey, StringComparer.Ordinal);

        Assert.Equal(10, settings.Count);
        Assert.True(settings.TryGetValue("max_booking_advance_days", out var bookingAdvanceSetting));
        Assert.NotNull(bookingAdvanceSetting);
        Assert.Equal("365", bookingAdvanceSetting!.SettingValue);
        Assert.Equal("number", bookingAdvanceSetting.SettingType);
        Assert.True(bookingAdvanceSetting.IsPublic);
    }

    private static void AssertDbSet<TEntity>(string propertyName)
        where TEntity : class
    {
        var property = typeof(SanadDbContext).GetProperty(propertyName);

        Assert.NotNull(property);
        Assert.Equal(typeof(DbSet<TEntity>), property!.PropertyType);
    }

    private static void AssertEntityMapping<TEntity>(SanadDbContext context, string tableName)
        where TEntity : class
    {
        var entityType = context.Model.FindEntityType(typeof(TEntity));

        Assert.NotNull(entityType);
        Assert.Equal(tableName, entityType!.GetTableName());
        Assert.Contains(
            entityType.GetIndexes(),
            index => index.IsUnique
                && index.Properties.Count == 1
                && index.Properties[0].Name == nameof(NutritionSubcategoryConfig.Code));
    }

    private static async Task AssertSeedMethodAsync<TEntity>(string methodName, params string[] expectedCodes)
        where TEntity : class, IHasCreatedAt
    {
        using var context = CreateContext();
        var seeder = new DataSeeder(context, context, NullLogger<DataSeeder>.Instance);

        await InvokePrivateSeedAsync(seeder, methodName);
        await InvokePrivateSeedAsync(seeder, methodName);

        var rows = await context.Set<TEntity>()
            .AsNoTracking()
            .ToListAsync();

        Assert.Equal(expectedCodes.Length, rows.Count);

        var actualCodes = rows
            .Select(row => GetRequiredStringProperty(row, nameof(NutritionSubcategoryConfig.Code)))
            .OrderBy(code => code, StringComparer.Ordinal)
            .ToArray();

        Assert.Equal(
            expectedCodes.OrderBy(code => code, StringComparer.Ordinal).ToArray(),
            actualCodes);

        Assert.All(rows, row =>
        {
            Assert.NotEqual(default, row.CreatedAt);
            AssertPropertyPopulated(row, nameof(NutritionSubcategoryConfig.NameEn));
            AssertPropertyPopulated(row, nameof(NutritionSubcategoryConfig.NameFr));
            AssertPropertyPopulated(row, nameof(NutritionSubcategoryConfig.NameAr));
            AssertPropertyPopulated(row, nameof(NutritionSubcategoryConfig.Icon));
            AssertPropertyPopulated(row, nameof(NutritionSubcategoryConfig.Color));
            Assert.True(GetRequiredBoolProperty(row, nameof(NutritionSubcategoryConfig.IsActive)));
            Assert.True(GetRequiredIntProperty(row, nameof(NutritionSubcategoryConfig.DisplayOrder)) > 0);
        });
    }

    private static async Task InvokePrivateSeedAsync(DataSeeder seeder, string methodName)
    {
        var method = typeof(DataSeeder).GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic);

        Assert.NotNull(method);

        var result = method!.Invoke(seeder, new object[] { CancellationToken.None });
        var task = Assert.IsAssignableFrom<Task>(result);
        await task;
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    private static void AssertPropertyPopulated<TEntity>(TEntity entity, string propertyName)
        where TEntity : class
    {
        _ = GetRequiredStringProperty(entity, propertyName);
    }

    private static string GetRequiredStringProperty<TEntity>(TEntity entity, string propertyName)
        where TEntity : class
    {
        var property = typeof(TEntity).GetProperty(propertyName);

        Assert.NotNull(property);

        var value = property!.GetValue(entity) as string;

        Assert.False(
            string.IsNullOrWhiteSpace(value),
            $"{typeof(TEntity).Name}.{propertyName} should be populated.");

        return value!;
    }

    private static bool GetRequiredBoolProperty<TEntity>(TEntity entity, string propertyName)
        where TEntity : class
    {
        var property = typeof(TEntity).GetProperty(propertyName);

        Assert.NotNull(property);
        return Assert.IsType<bool>(property!.GetValue(entity));
    }

    private static int GetRequiredIntProperty<TEntity>(TEntity entity, string propertyName)
        where TEntity : class
    {
        var property = typeof(TEntity).GetProperty(propertyName);

        Assert.NotNull(property);
        return Assert.IsType<int>(property!.GetValue(entity));
    }
}
