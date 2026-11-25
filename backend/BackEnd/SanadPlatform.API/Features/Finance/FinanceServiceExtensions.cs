using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Finance.Repository;
using SanadPlatform.API.Features.Finance.Services;

namespace SanadPlatform.API.Features.Finance;

/// <summary>
/// Dependency injection extension methods for canonical finance services.
/// </summary>
public static class FinanceServiceExtensions
{
    public static IServiceCollection AddFinanceFeature(this IServiceCollection services)
    {
        services.AddScoped<ILedgerPostingService, LedgerPostingService>();
        services.AddScoped<IFinanceTimelineRepository, FinanceTimelineRepository>();
        return services;
    }
}
