using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Notifications.Repository;

namespace SanadPlatform.API.Features.Notifications.Services;

public class WebPushSubscriptionService : IWebPushSubscriptionService
{
    private readonly IWebPushSubscriptionRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly WebPushSettings _settings;

    public WebPushSubscriptionService(
        IWebPushSubscriptionRepository repository,
        IUnitOfWork unitOfWork,
        IOptions<WebPushSettings> settings)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
    }

    public WebPushPublicKeyResponse GetPublicKey()
    {
        EnsureConfigured();
        return new WebPushPublicKeyResponse { PublicKey = _settings.PublicKey };
    }

    public async Task<WebPushSubscriptionResponse> RegisterAsync(
        Guid userId,
        RegisterWebPushSubscriptionRequest request,
        string? userAgent,
        CancellationToken cancellationToken = default)
    {
        EnsureConfigured();
        ValidateRequest(request);

        var now = DateTime.UtcNow;
        var subscription = await _repository.GetByUserAndEndpointAsync(
            userId,
            request.Endpoint,
            cancellationToken);

        if (subscription is null)
        {
            subscription = new WebPushSubscription
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Endpoint = request.Endpoint,
                CreatedAt = now
            };

            await _repository.AddAsync(subscription, cancellationToken);
        }

        subscription.P256dh = request.Keys.P256dh;
        subscription.Auth = request.Keys.Auth;
        subscription.ExpirationTime = ConvertExpirationTime(request.ExpirationTime);
        subscription.UserAgent = NormalizeUserAgent(request.UserAgent) ?? NormalizeUserAgent(userAgent);
        subscription.IsActive = true;
        subscription.UpdatedAt = now;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return MapToResponse(subscription);
    }

    public async Task<bool> DeactivateAsync(
        Guid userId,
        DeleteWebPushSubscriptionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Endpoint))
        {
            throw new ArgumentException("Endpoint is required.", nameof(request));
        }

        var subscription = await _repository.GetByUserAndEndpointAsync(
            userId,
            request.Endpoint,
            cancellationToken);

        if (subscription is null)
        {
            return false;
        }

        subscription.IsActive = false;
        subscription.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    private void EnsureConfigured()
    {
        if (!_settings.IsConfigured)
        {
            throw new InvalidOperationException("Web Push is not configured.");
        }
    }

    private static void ValidateRequest(RegisterWebPushSubscriptionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Endpoint))
        {
            throw new ArgumentException("Endpoint is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Keys.P256dh))
        {
            throw new ArgumentException("P256dh key is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Keys.Auth))
        {
            throw new ArgumentException("Auth key is required.", nameof(request));
        }
    }

    private static DateTime? ConvertExpirationTime(long? expirationTime)
    {
        return expirationTime.HasValue
            ? DateTimeOffset.FromUnixTimeMilliseconds(expirationTime.Value).UtcDateTime
            : null;
    }

    private static string? NormalizeUserAgent(string? userAgent)
    {
        var normalized = userAgent?.Trim();
        if (string.IsNullOrWhiteSpace(normalized))
        {
            return null;
        }

        return normalized.Length > 512 ? normalized[..512] : normalized;
    }

    private static WebPushSubscriptionResponse MapToResponse(WebPushSubscription subscription)
    {
        return new WebPushSubscriptionResponse
        {
            Id = subscription.Id,
            Endpoint = subscription.Endpoint,
            ExpirationTime = subscription.ExpirationTime,
            IsActive = subscription.IsActive,
            LastUsedAt = subscription.LastUsedAt,
            CreatedAt = subscription.CreatedAt,
            UpdatedAt = subscription.UpdatedAt
        };
    }
}
