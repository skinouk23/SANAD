using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Equipment.Repository;

namespace SanadPlatform.API.Features.Equipment;

/// <summary>
/// Dependency injection extension methods for the Equipment feature.
/// Registers all repositories and services owned by this vertical slice.
/// </summary>
public static class EquipmentServiceExtensions
{
    /// <summary>
    /// Registers the Equipment feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddEquipmentFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();

        return services;
    }
}
