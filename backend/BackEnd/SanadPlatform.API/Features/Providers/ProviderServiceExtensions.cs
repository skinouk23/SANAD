using SanadPlatform.API.Features.Providers.Services;
using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers;

/// <summary>
/// Dependency injection extension methods for the Providers feature.
/// Registers all repositories and services owned by this vertical slice.
/// </summary>
public static class ProviderServiceExtensions
{
    /// <summary>
    /// Registers the Providers feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddProviderFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IProviderRepository, ProviderRepository>();
        services.AddScoped<IProviderPaymentHistoryRepository, ProviderPaymentHistoryRepository>();

        // ==================== Services ====================
        services.AddScoped<IProviderRangeAvailabilityService, ProviderRangeAvailabilityService>();

        return services;
    }
}
