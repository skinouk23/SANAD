using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers.Entities;

public class ProviderNutritionSubtypeModelTests
{
    [Fact]
    public void Provider_DefaultsNutritionProviderSubtypeToNull()
    {
        var provider = new Provider();

        Assert.Null(provider.NutritionProviderSubtype);
    }

    [Fact]
    public void SanadDbContext_ModelIncludesNullableNutritionProviderSubtypeProperty()
    {
        using var context = CreateContext();

        var property = GetNutritionProviderSubtypeProperty(context);

        Assert.NotNull(property);
        Assert.Equal(typeof(NutritionProviderSubtype?), property!.ClrType);
        Assert.True(property.IsNullable);
        Assert.Equal(50, property.GetMaxLength());
    }

    [Theory]
    [InlineData(NutritionProviderSubtype.Restaurant, "Restaurant")]
    [InlineData(NutritionProviderSubtype.Chef, "Chef")]
    [InlineData(NutritionProviderSubtype.Nutritionist, "Nutritionist")]
    public void SanadDbContext_ConfiguresNutritionProviderSubtype_AsStringBackedConversion(
        NutritionProviderSubtype subtype,
        string expectedValue)
    {
        using var context = CreateContext();

        var property = GetNutritionProviderSubtypeProperty(context);
        var converter = Assert.IsAssignableFrom<ValueConverter>(property!.GetTypeMapping().Converter);

        Assert.Equal(typeof(string), converter.ProviderClrType);
        Assert.Equal(expectedValue, converter.ConvertToProvider(subtype));
        Assert.Equal(subtype, converter.ConvertFromProvider(expectedValue));
    }

    private static Microsoft.EntityFrameworkCore.Metadata.IProperty? GetNutritionProviderSubtypeProperty(
        SanadDbContext context)
    {
        return context.Model
            .FindEntityType(typeof(Provider))?
            .FindProperty(nameof(Provider.NutritionProviderSubtype));
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }
}
