using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Infrastructure.Database;

/// <summary>
/// Dependency injection extension methods for database infrastructure.
/// Registers EF Core DbContext, retry policy, and the Unit of Work abstraction.
/// </summary>
public static class DatabaseServiceExtensions
{
    /// <summary>
    /// Registers <see cref="SanadDbContext"/> with Npgsql and a retry-on-failure policy,
    /// and maps <see cref="IUnitOfWork"/> to the same scoped <see cref="SanadDbContext"/>
    /// instance so repositories and handlers share a single change tracker per request.
    /// </summary>
    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<SanadDbContext>(options =>
            options.UseNpgsql(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null);
            }));

        // IUnitOfWork resolves to the same scoped SanadDbContext instance —
        // do NOT register SanadDbContext separately; let AddDbContext manage the lifetime.
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<SanadDbContext>());

        // Transient by design: SeedDatabaseAsync() creates its own dedicated scope.
        services.AddTransient<DataSeeder>();

        return services;
    }

    /// <summary>
    /// Runs pending EF Core migrations and seeds reference data.
    /// Call this after WebApplication.Build() and before app.Run().
    /// Safe to run on every startup.
    /// </summary>
    public static async Task SeedDatabaseAsync(this IServiceProvider services)
    {
        // Build the retry strategy from a context created in its own short-lived scope.
        await using var strategyScope = services.CreateAsyncScope();
        var strategyUnitOfWork = strategyScope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var strategy = strategyUnitOfWork.CreateExecutionStrategy();

        await strategy.ExecuteAsync(async () =>
        {
            // Fresh scope per attempt prevents reusing a possibly faulted DbContext.
            await using var scope = services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<SanadDbContext>();
            var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();

            await db.Database.MigrateAsync();
            await seeder.SeedAsync();
        });
    }
}

