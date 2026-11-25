using SanadPlatform.API.Features.Notifications.DTOs;

namespace SanadPlatform.API.Features.Notifications.Services;

public interface IWebPushSubscriptionService
{
    WebPushPublicKeyResponse GetPublicKey();

    Task<WebPushSubscriptionResponse> RegisterAsync(
        Guid userId,
        RegisterWebPushSubscriptionRequest request,
        string? userAgent,
        CancellationToken cancellationToken = default);

    Task<bool> DeactivateAsync(
        Guid userId,
        DeleteWebPushSubscriptionRequest request,
        CancellationToken cancellationToken = default);
}
