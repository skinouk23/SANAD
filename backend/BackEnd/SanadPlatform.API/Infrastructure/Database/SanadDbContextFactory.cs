using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SanadPlatform.API.Infrastructure.Database;

/// <summary>
/// Design-time factory used by EF Core tooling when the application host cannot be constructed.
/// </summary>
public sealed class SanadDbContextFactory : IDesignTimeDbContextFactory<SanadDbContext>
{
    public SanadDbContext CreateDbContext(string[] args)
    {
        var basePath = Directory.GetCurrentDirectory();
        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");

        var optionsBuilder = new DbContextOptionsBuilder<SanadDbContext>();
        optionsBuilder.UseNpgsql(connectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null);
        });

        return new SanadDbContext(optionsBuilder.Options);
    }
}
