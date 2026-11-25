using System.Net;
using System.Text.Json;
using Lib.Net.Http.WebPush;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Notifications.Repository;

namespace SanadPlatform.API.Features.Notifications.Services;

public class WebPushNotificationSender : IWebPushNotificationSender
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly IWebPushSubscriptionRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly PushServiceClient _pushServiceClient;
    private readonly WebPushSettings _settings;
    private readonly ILogger<WebPushNotificationSender> _logger;

    public WebPushNotificationSender(
        IWebPushSubscriptionRepository repository,
        IUnitOfWork unitOfWork,
        PushServiceClient pushServiceClient,
        IOptions<WebPushSettings> settings,
        ILogger<WebPushNotificationSender> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _pushServiceClient = pushServiceClient ?? throw new ArgumentNullException(nameof(pushServiceClient));
        _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<bool> SendAsync(
        NotificationResponse notification,
        CancellationToken cancellationToken = default)
    {
        if (!_settings.IsConfigured)
        {
            _logger.LogWarning("Web Push delivery skipped because VAPID settings are missing.");
            return false;
        }

        var subscriptions = await _repository.GetActiveForUserAsync(
            notification.RecipientUserId,
            cancellationToken);

        if (subscriptions.Count == 0)
        {
            return false;
        }

        var payload = BuildPayload(notification);
        var message = new PushMessage(JsonSerializer.Serialize(payload, JsonOptions))
        {
            Topic = notification.Type,
            TimeToLive = 3600,
            Urgency = PushMessageUrgency.Normal
        };

        var now = DateTime.UtcNow;
        var sent = false;
        var changed = false;

        foreach (var subscription in subscriptions)
        {
            try
            {
                await _pushServiceClient.RequestPushMessageDeliveryAsync(
                    ToPushSubscription(subscription),
                    message,
                    cancellationToken);

                subscription.LastUsedAt = now;
                subscription.UpdatedAt = now;
                sent = true;
                changed = true;
            }
            catch (PushServiceClientException ex) when (IsExpiredOrRejected(ex.StatusCode))
            {
                subscription.IsActive = false;
                subscription.UpdatedAt = now;
                changed = true;

                _logger.LogInformation(
                    ex,
                    "Web Push subscription {SubscriptionId} disabled after push service response {StatusCode}.",
                    subscription.Id,
                    ex.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Web Push delivery failed for subscription {SubscriptionId}.",
                    subscription.Id);
            }
        }

        if (changed)
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return sent;
    }

    private static WebPushNotificationPayload BuildPayload(NotificationResponse notification)
    {
        return new WebPushNotificationPayload
        {
            Title = notification.Title,
            Body = notification.Message,
            Tag = notification.Type,
            Data = new WebPushNotificationData
            {
                Url = string.IsNullOrWhiteSpace(notification.ActionUrl) ? "/" : notification.ActionUrl,
                NotificationId = notification.Id,
                Type = notification.Type
            }
        };
    }

    private static PushSubscription ToPushSubscription(WebPushSubscription subscription)
    {
        return new PushSubscription
        {
            Endpoint = subscription.Endpoint,
            Keys = new Dictionary<string, string>
            {
                ["p256dh"] = subscription.P256dh,
                ["auth"] = subscription.Auth
            }
        };
    }

    private static bool IsExpiredOrRejected(HttpStatusCode statusCode)
    {
        return statusCode is HttpStatusCode.Gone or HttpStatusCode.NotFound;
    }
}
