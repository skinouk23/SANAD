using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Publishes durable outbox events to the configured message broker.
/// </summary>
public interface IFileEventPublisher
{
    Task<bool> PublishAsync(OutboxMessage message, CancellationToken cancellationToken = default);
}
