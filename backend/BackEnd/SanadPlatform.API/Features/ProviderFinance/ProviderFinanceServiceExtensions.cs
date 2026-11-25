using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.ProviderFinance.Services;

namespace SanadPlatform.API.Features.ProviderFinance;

/// <summary>
/// Dependency injection extension methods for provider prepaid-wallet and finance flows.
/// </summary>
public static class ProviderFinanceServiceExtensions
{
    public static IServiceCollection AddProviderFinanceFeature(this IServiceCollection services)
    {
        services.AddScoped<IProviderFinanceRepository, ProviderFinanceRepository>();
        services.AddScoped<IProviderWalletService, ProviderWalletService>();

        return services;
    }
}
