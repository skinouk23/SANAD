using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;

namespace SanadPlatform.API.Features.Authentication;

/// <summary>
/// Dependency injection extension methods for the Authentication feature.
/// Registers all repositories and services owned by this vertical slice.
/// </summary>
public static class AuthenticationServiceExtensions
{
    /// <summary>
    /// Registers the Authentication feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddAuthenticationFeature(this IServiceCollection services)
    {
        // ==================== Repositories ====================
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserSessionRepository, UserSessionRepository>();
        services.AddScoped<ILoginOtpChallengeRepository, LoginOtpChallengeRepository>();

        // ==================== Services ====================
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ILoginOtpCodeGenerator, LoginOtpCodeGenerator>();
        services.AddScoped<ILoginOtpCodeHasher, LoginOtpCodeHasher>();
        services.AddScoped<IEmailSender, SmtpEmailSender>();
        services.AddScoped<ITunisiaPhoneNumberNormalizer, TunisiaPhoneNumberNormalizer>();
        services.AddHttpClient<ISmsSender, TunisieSmsSender>();

        return services;
    }
}
