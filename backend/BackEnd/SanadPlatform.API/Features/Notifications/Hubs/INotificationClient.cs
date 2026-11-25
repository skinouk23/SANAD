using SanadPlatform.API.Features.Notifications.DTOs;

namespace SanadPlatform.API.Features.Notifications.Hubs;

public interface INotificationClient
{
    Task ReceiveNotification(NotificationRealtimePayload notification);
}
