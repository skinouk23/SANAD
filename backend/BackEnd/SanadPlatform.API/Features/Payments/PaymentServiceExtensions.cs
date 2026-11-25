using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Payments.Repository;

namespace SanadPlatform.API.Features.Payments;

/// <summary>
/// Dependency injection extension methods for canonical payment services.
/// </summary>
public static class PaymentServiceExtensions
{
    public static IServiceCollection AddPaymentFeature(this IServiceCollection services)
    {
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        return services;
    }
}
