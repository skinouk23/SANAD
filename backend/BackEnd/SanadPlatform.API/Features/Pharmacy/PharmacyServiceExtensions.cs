using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Pharmacy.Repository;

namespace SanadPlatform.API.Features.Pharmacy;

/// <summary>
/// Dependency injection extension methods for the Pharmacy feature.
/// Registers all repositories owned by this vertical slice.
/// </summary>
public static class PharmacyServiceExtensions
{
    /// <summary>
    /// Registers the Pharmacy feature's repositories with the DI container.
    /// </summary>
    public static IServiceCollection AddPharmacyFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IPharmacyOrderRepository, PharmacyOrderRepository>();

        return services;
    }
}
