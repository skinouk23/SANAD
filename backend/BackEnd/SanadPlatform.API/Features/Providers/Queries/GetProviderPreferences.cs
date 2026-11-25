using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve a provider's notification and privacy preferences.
/// </summary>
public record GetProviderPreferencesQuery(Guid UserId) : IRequest<ProviderPreferencesResponse>;

/// <summary>
/// Handler for <see cref="GetProviderPreferencesQuery"/>.
/// Returns persisted preferences when present, or sensible defaults for providers
/// who have not saved their preferences yet.
/// </summary>
public class GetProviderPreferencesHandler : IRequestHandler<GetProviderPreferencesQuery, ProviderPreferencesResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetProviderPreferencesHandler> _logger;

    public GetProviderPreferencesHandler(
        IProviderRepository providerRepository,
        ILogger<GetProviderPreferencesHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderPreferencesResponse> Handle(
        GetProviderPreferencesQuery request,
        CancellationToken cancellationToken)
    {
        var preferences = await _providerRepository.GetPreferencesByUserIdAsync(request.UserId, cancellationToken);

        if (preferences != null)
        {
            return preferences;
        }

        _logger.LogInformation("Returning default preferences for provider with user ID: {UserId}", request.UserId);

        return new ProviderPreferencesResponse
        {
            EmailNotifications = true,
            SmsNotifications = true,
            PushNotifications = true,
            MarketingEmails = false,
            AllowPatientMessages = true,
            ProfileVisibility = "public",
            UpdatedAt = DateTime.UtcNow,
        };
    }
}
