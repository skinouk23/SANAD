using System.Text.Json;
using System.Text.RegularExpressions;
using SanadPlatform.API.Features.Notifications.Entities;

namespace SanadPlatform.API.Features.Notifications.DTOs;

public sealed class GetMyNotificationsRequest
{
    public string? Status { get; init; }
    public string? Category { get; init; }
    public string? Cursor { get; init; }
    public bool UnreadOnly { get; init; }
    public int Limit { get; init; } = 50;
}

public sealed class NotificationFeedResponse
{
    public IReadOnlyList<NotificationFeedItemResponse> Items { get; init; } = [];
    public string? NextCursor { get; init; }
}

public sealed class NotificationResponse
{
    public Guid Id { get; init; }
    public Guid RecipientUserId { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public Guid? BookingId { get; init; }
    public Guid? ProviderId { get; init; }
    public string? ActionUrl { get; init; }
    public string? ActionData { get; init; }
    public bool IsRead { get; init; }
    public bool SentViaPush { get; init; }
    public bool SentViaEmail { get; init; }
    public bool SentViaSms { get; init; }
    public DateTime? ReadAt { get; init; }
    public DateTime CreatedAt { get; init; }
}

public sealed class NotificationRealtimePayload
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public Guid? BookingId { get; init; }
    public Guid? ProviderId { get; init; }
    public string? ActionUrl { get; init; }
    public DateTime CreatedAt { get; init; }
}

public sealed class WebPushPublicKeyResponse
{
    public string PublicKey { get; init; } = string.Empty;
}

public sealed class WebPushSubscriptionKeysRequest
{
    public string P256dh { get; init; } = string.Empty;
    public string Auth { get; init; } = string.Empty;
}

public sealed class RegisterWebPushSubscriptionRequest
{
    public string Endpoint { get; init; } = string.Empty;
    public long? ExpirationTime { get; init; }
    public WebPushSubscriptionKeysRequest Keys { get; init; } = new();
    public string? UserAgent { get; init; }
}

public sealed class DeleteWebPushSubscriptionRequest
{
    public string Endpoint { get; init; } = string.Empty;
}

public sealed class WebPushSubscriptionResponse
{
    public Guid Id { get; init; }
    public string Endpoint { get; init; } = string.Empty;
    public DateTime? ExpirationTime { get; init; }
    public bool IsActive { get; init; }
    public DateTime? LastUsedAt { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public sealed class WebPushNotificationPayload
{
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public string Tag { get; init; } = string.Empty;
    public string Icon { get; init; } = "/icons/icon-192x192.png";
    public string Badge { get; init; } = "/icons/badge-72x72.png";
    public WebPushNotificationData Data { get; init; } = new();
}

public sealed class WebPushNotificationData
{
    public string Url { get; init; } = "/";
    public Guid NotificationId { get; init; }
    public string Type { get; init; } = string.Empty;
}

public sealed class NotificationFeedItemResponse
{
    public Guid Id { get; init; }
    public string Category { get; init; } = "system";
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime? ReadAt { get; init; }
    public DateTime? ArchivedAt { get; init; }
    public string Severity { get; init; } = "info";
    public NotificationActionResponse? Action { get; init; }
    public NotificationActorResponse? Actor { get; init; }
    public IReadOnlyDictionary<string, object?> Metadata { get; init; }
        = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
}

public sealed class NotificationActionResponse
{
    public string Label { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
}

public sealed class NotificationActorResponse
{
    public string? Name { get; init; }
    public string? AvatarUrl { get; init; }
}

public sealed class NotificationUnreadCountResponse
{
    public int Count { get; init; }
}

public sealed class MarkAllNotificationsReadResponse
{
    public int Count { get; init; }
    public int UpdatedCount { get; init; }
}

internal static class NotificationResponseMapper
{
    public static NotificationResponse ToResponse(Notification notification)
    {
        ArgumentNullException.ThrowIfNull(notification);

        return new NotificationResponse
        {
            Id = notification.Id,
            RecipientUserId = notification.UserId,
            Type = notification.Type,
            Title = notification.Title,
            Message = notification.Message,
            BookingId = notification.BookingId,
            ProviderId = notification.ProviderId,
            ActionUrl = notification.ActionUrl,
            ActionData = notification.ActionData,
            IsRead = notification.IsRead,
            SentViaPush = notification.SentViaPush,
            SentViaEmail = notification.SentViaEmail,
            SentViaSms = notification.SentViaSms,
            ReadAt = notification.ReadAt,
            CreatedAt = notification.CreatedAt,
        };
    }
}

internal static class NotificationFeedItemResponseMapper
{
    private static readonly Regex MessageSenderRegex = new(
        @"^(?<name>.+?) vous a envoye un message\.",
        RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.IgnoreCase);

    private static readonly Regex ConfirmedProviderRegex = new(
        @"avec (?<name>.+?) est confirme",
        RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.IgnoreCase);

    public static NotificationFeedItemResponse ToResponse(Notification notification)
    {
        ArgumentNullException.ThrowIfNull(notification);

        var category = ResolveCategory(notification.Type);

        return new NotificationFeedItemResponse
        {
            Id = notification.Id,
            Category = category,
            Title = notification.Title,
            Body = notification.Message,
            CreatedAt = notification.CreatedAt,
            ReadAt = notification.ReadAt,
            ArchivedAt = null,
            Severity = ResolveSeverity(notification.Type),
            Action = BuildAction(notification, category),
            Actor = BuildActor(notification),
            Metadata = BuildMetadata(notification),
        };
    }

    private static string ResolveCategory(string type)
    {
        if (string.IsNullOrWhiteSpace(type))
        {
            return "system";
        }

        if (type.StartsWith("booking_", StringComparison.OrdinalIgnoreCase))
        {
            return "booking";
        }

        return type.ToLowerInvariant() switch
        {
            "validation_pending" => "reminder",
            "new_message" => "message",
            "security_alert" => "security",
            "account_update" => "account",
            _ => "system",
        };
    }

    private static string ResolveSeverity(string type)
    {
        if (string.IsNullOrWhiteSpace(type))
        {
            return "info";
        }

        return type.ToLowerInvariant() switch
        {
            "booking_confirmed" => "success",
            "validation_pending" => "warning",
            "security_alert" => "error",
            _ => "info",
        };
    }

    private static NotificationActionResponse? BuildAction(Notification notification, string category)
    {
        if (string.IsNullOrWhiteSpace(notification.ActionUrl))
        {
            return null;
        }

        var label = notification.ActionUrl.Contains("schedule", StringComparison.OrdinalIgnoreCase)
            ? "Voir le planning"
            : category switch
            {
                "booking" => "Voir la reservation",
                "message" => "Ouvrir la conversation",
                "finance" => "Voir les transactions",
                "security" => "Verifier le compte",
                _ => "Voir le detail",
            };

        return new NotificationActionResponse
        {
            Label = label,
            Url = notification.ActionUrl,
        };
    }

    private static NotificationActorResponse? BuildActor(Notification notification)
    {
        var actorName =
            TryReadActionDataName(notification.ActionData, "PatientName")
            ?? TryReadActionDataName(notification.ActionData, "ProviderName")
            ?? TryExtractSenderName(notification.Type, notification.Message);

        return string.IsNullOrWhiteSpace(actorName)
            ? null
            : new NotificationActorResponse
            {
                Name = actorName,
                AvatarUrl = null,
            };
    }

    private static IReadOnlyDictionary<string, object?> BuildMetadata(Notification notification)
    {
        var metadata = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
        {
            ["type"] = notification.Type,
            ["sentViaPush"] = notification.SentViaPush,
            ["sentViaEmail"] = notification.SentViaEmail,
            ["sentViaSms"] = notification.SentViaSms,
        };

        if (notification.BookingId.HasValue)
        {
            metadata["bookingId"] = notification.BookingId.Value;
        }

        if (notification.ProviderId.HasValue)
        {
            metadata["providerId"] = notification.ProviderId.Value;
        }

        if (!string.IsNullOrWhiteSpace(notification.ActionData))
        {
            metadata["actionData"] = notification.ActionData;
        }

        return metadata;
    }

    private static string? TryReadActionDataName(string? actionData, string propertyName)
    {
        if (string.IsNullOrWhiteSpace(actionData))
        {
            return null;
        }

        try
        {
            using var document = JsonDocument.Parse(actionData);
            if (!document.RootElement.TryGetProperty(propertyName, out var property))
            {
                return null;
            }

            var value = property.GetString();
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static string? TryExtractSenderName(string type, string message)
    {
        if (string.Equals(type, "new_message", StringComparison.OrdinalIgnoreCase))
        {
            var senderMatch = MessageSenderRegex.Match(message);
            if (senderMatch.Success)
            {
                return senderMatch.Groups["name"].Value.Trim();
            }
        }

        if (string.Equals(type, "booking_confirmed", StringComparison.OrdinalIgnoreCase))
        {
            var providerMatch = ConfirmedProviderRegex.Match(message);
            if (providerMatch.Success)
            {
                return providerMatch.Groups["name"].Value.Trim();
            }
        }

        return null;
    }
}
