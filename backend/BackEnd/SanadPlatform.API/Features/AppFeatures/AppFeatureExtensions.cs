using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.AppFeatures.Repository;

namespace SanadPlatform.API.Features.AppFeatures;

/// <summary>
/// Dependency injection extension methods for the AppFeatures slice.
/// </summary>
public static class AppFeatureExtensions
{
    /// <summary>
    /// Registers the AppFeatures feature's repositories with the DI container.
    /// </summary>
    public static IServiceCollection AddAppFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IFeatureRepository, FeatureRepository>();

        return services;
    }
}
