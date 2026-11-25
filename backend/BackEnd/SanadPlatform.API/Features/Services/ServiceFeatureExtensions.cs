using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Features.Services.Services;
using SanadPlatform.API.Features.Services.Services.Policies;

namespace SanadPlatform.API.Features.Services;

/// <summary>
/// Dependency injection extension methods for the Services feature.
/// Registers all repositories and services owned by this vertical slice.
/// </summary>
public static class ServiceFeatureExtensions
{
    /// <summary>
    /// Registers the Services feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddServiceFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<IServicePhotoRepository, ServicePhotoRepository>();

        // ==================== Shared Services ====================
        services.AddScoped<IServiceResolutionService, ServiceResolutionService>();

        // ==================== Category Policies ====================
        services.AddScoped<IServiceCategoryPolicy, DefaultServiceCategoryPolicy>();
        services.AddScoped<IServiceCategoryPolicy, EquipmentRentalServiceCategoryPolicy>();
        services.AddScoped<IServiceCategoryPolicy, NutritionServiceCategoryPolicy>();
        services.AddScoped<IServiceCategoryPolicy, AmbulanceServiceCategoryPolicy>();
        services.AddScoped<IServiceCategoryPolicy, VeterinaryServiceCategoryPolicy>();
        services.AddScoped<DefaultServiceCategoryPolicy>();
        services.AddScoped<ServiceCategoryPolicyRegistry>();

        return services;
    }
}
