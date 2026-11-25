using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients;

/// <summary>
/// Dependency injection extension methods for the Patients feature.
/// Registers all repositories and services owned by this vertical slice.
/// </summary>
public static class PatientServiceExtensions
{
    /// <summary>
    /// Registers the Patients feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddPatientFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IPatientRepository, PatientRepository>();

        return services;
    }
}
