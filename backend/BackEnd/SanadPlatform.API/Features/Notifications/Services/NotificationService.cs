using Microsoft.AspNetCore.SignalR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Notifications.Hubs;

namespace SanadPlatform.API.Features.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;
    private readonly IWebPushNotificationSender _webPushNotificationSender;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IHubContext<NotificationHub, INotificationClient> hubContext,
        IWebPushNotificationSender webPushNotificationSender,
        IUnitOfWork unitOfWork,
        ILogger<NotificationService> logger)
    {
        _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        _webPushNotificationSender = webPushNotificationSender ?? throw new ArgumentNullException(nameof(webPushNotificationSender));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task DispatchAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(notification);

        var response = NotificationResponseMapper.ToResponse(notification);

        await DeliverRealtimeAsync(response);

        try
        {
            var sentViaPush = await _webPushNotificationSender.SendAsync(response, cancellationToken);
            if (sentViaPush && !notification.SentViaPush)
            {
                notification.SentViaPush = true;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Web Push delivery failed for notification {NotificationId}",
                notification.Id);
        }
    }

    private async Task DeliverRealtimeAsync(NotificationResponse notification)
    {
        try
        {
            await _hubContext.Clients
                .User(notification.RecipientUserId.ToString())
                .ReceiveNotification(MapToRealtimePayload(notification));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Realtime notification delivery failed for user {RecipientUserId}",
                notification.RecipientUserId);
        }
    }

    private static NotificationRealtimePayload MapToRealtimePayload(NotificationResponse notification)
    {
        return new NotificationRealtimePayload
        {
            Id = notification.Id,
            Type = notification.Type,
            Title = notification.Title,
            Message = notification.Message,
            BookingId = notification.BookingId,
            ProviderId = notification.ProviderId,
            ActionUrl = notification.ActionUrl,
            CreatedAt = notification.CreatedAt
        };
    }
}
