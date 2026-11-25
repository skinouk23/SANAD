using SanadPlatform.API.Features.Notifications.DTOs;

namespace SanadPlatform.API.Features.Notifications.Services;

public interface IWebPushNotificationSender
{
    Task<bool> SendAsync(
        NotificationResponse notification,
        CancellationToken cancellationToken = default);
}
