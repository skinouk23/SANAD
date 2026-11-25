namespace SanadPlatform.API.Features.Insurance;

/// <summary>
/// Registers the Insurance feature's repositories with the DI container.
/// </summary>
public static class InsuranceServiceExtensions
{
    public static IServiceCollection AddInsuranceFeature(this IServiceCollection services)
    {
        services.AddScoped<Repository.IInsuranceRepository, Repository.InsuranceRepository>();
        return services;
    }
}
