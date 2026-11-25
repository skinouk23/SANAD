using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace SanadPlatform.API.Infrastructure.Logging;

/// <summary>
/// Dependency injection extension methods for MediatR pipeline behaviors.
/// Registers cross-cutting behaviors that intercept every MediatR request.
/// </summary>
public static class PipelineBehaviorExtensions
{
    /// <summary>
    /// Registers the MediatR pipeline behaviors with the DI container.
    /// Behaviors execute in registration order: ValidationBehavior runs before LoggingBehavior.
    /// </summary>
    public static IServiceCollection AddPipelineBehaviors(this IServiceCollection services)
    {
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

        return services;
    }
}
