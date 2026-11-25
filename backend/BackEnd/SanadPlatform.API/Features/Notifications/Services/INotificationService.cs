using SanadPlatform.API.Features.Notifications.Entities;

namespace SanadPlatform.API.Features.Notifications.Services;

public interface INotificationService
{
    Task DispatchAsync(Notification notification, CancellationToken cancellationToken = default);
}
