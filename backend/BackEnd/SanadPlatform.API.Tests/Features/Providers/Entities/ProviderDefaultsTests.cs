using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers.Entities;

public class ProviderDefaultsTests
{
    [Fact]
    public void Provider_DefaultsMaxBookingAdvanceDaysTo365()
    {
        var provider = new Provider();

        Assert.Equal(365, provider.MaxBookingAdvanceDays);
    }

    [Fact]
    public void SanadDbContext_ConfiguresProviderMaxBookingAdvanceDays_DefaultTo365()
    {
        using var context = CreateContext();

        var property = context.Model
            .FindEntityType(typeof(Provider))?
            .FindProperty(nameof(Provider.MaxBookingAdvanceDays));

        Assert.NotNull(property);
        Assert.Equal(365, Assert.IsType<int>(property!.GetDefaultValue()));
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }
}
