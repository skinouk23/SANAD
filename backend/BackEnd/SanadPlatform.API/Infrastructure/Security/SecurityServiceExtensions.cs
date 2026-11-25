using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Dependency injection extension methods for infrastructure security services.
/// Registers all security-related services with the DI container.
/// </summary>
public static class SecurityServiceExtensions
{
    /// <summary>
    /// Registers hashing, encryption, certificate validation, and claims services
    /// with the DI container.
    /// </summary>
    public static IServiceCollection AddSecurityServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHashingService, PasswordHashingService>();
        services.AddScoped<ICertificateValidationService, CertificateValidationService>();
        services.AddScoped<IClaimsService, ClaimsService>();

        // IEncryptionService requires the encryption key from configuration at construction time.
        // The factory reads SecuritySettings (already validated at startup) and passes
        // the key directly to EncryptionService, avoiding any runtime null-ref.
        services.AddScoped<IEncryptionService>(provider =>
        {
            var security = provider.GetRequiredService<IOptions<SecuritySettings>>().Value;
            if (string.IsNullOrEmpty(security.EncryptionKey))
                throw new InvalidOperationException("Security:EncryptionKey must be configured.");
            return new EncryptionService(security.EncryptionKey);
        });

        services.AddScoped<IEncryptedFieldService, EncryptedFieldService>();

        return services;
    }
}
