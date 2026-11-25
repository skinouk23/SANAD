using SanadPlatform.API.Features.Notifications.Entities;

namespace SanadPlatform.API.Features.Notifications.Repository;

public interface IWebPushSubscriptionRepository
{
    Task<WebPushSubscription?> GetByUserAndEndpointAsync(
        Guid userId,
        string endpoint,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WebPushSubscription>> GetActiveForUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        WebPushSubscription subscription,
        CancellationToken cancellationToken = default);
}
