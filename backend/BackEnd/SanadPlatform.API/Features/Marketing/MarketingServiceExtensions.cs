namespace SanadPlatform.API.Features.Marketing;

/// <summary>
/// Registers the Marketing feature's repositories with the DI container.
/// </summary>
public static class MarketingServiceExtensions
{
    public static IServiceCollection AddMarketingFeature(this IServiceCollection services)
    {
        services.AddScoped<Repository.IMarketingRepository, Repository.MarketingRepository>();
        return services;
    }
}
