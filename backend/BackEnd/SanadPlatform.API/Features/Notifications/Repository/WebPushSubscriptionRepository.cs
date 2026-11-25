using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Notifications.Repository;

public class WebPushSubscriptionRepository : IWebPushSubscriptionRepository
{
    private readonly SanadDbContext _context;

    public WebPushSubscriptionRepository(SanadDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<WebPushSubscription?> GetByUserAndEndpointAsync(
        Guid userId,
        string endpoint,
        CancellationToken cancellationToken = default)
    {
        return await _context.WebPushSubscriptions
            .FirstOrDefaultAsync(
                subscription => subscription.UserId == userId && subscription.Endpoint == endpoint,
                cancellationToken);
    }

    public async Task<IReadOnlyList<WebPushSubscription>> GetActiveForUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.WebPushSubscriptions
            .Where(subscription => subscription.UserId == userId && subscription.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        WebPushSubscription subscription,
        CancellationToken cancellationToken = default)
    {
        await _context.WebPushSubscriptions.AddAsync(subscription, cancellationToken);
    }
}
