using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Safe publisher abstraction. When RabbitMQ is disabled or the client package is absent,
/// outbox rows are preserved and publication is logged rather than silently discarded.
/// </summary>
public class LoggingFileEventPublisher : IFileEventPublisher
{
    private readonly RabbitMqOptions _options;
    private readonly ILogger<LoggingFileEventPublisher> _logger;

    public LoggingFileEventPublisher(
        IOptions<RabbitMqOptions> options,
        ILogger<LoggingFileEventPublisher> logger)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public Task<bool> PublishAsync(OutboxMessage message, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
        {
            _logger.LogDebug(
                "RabbitMQ is disabled; outbox message {OutboxMessageId} remains pending for event {EventType}",
                message.Id,
                message.EventType);
            return Task.FromResult(false);
        }

        _logger.LogWarning(
            "RabbitMQ is enabled but RabbitMQ.Client is not wired in this build; preserving outbox message {OutboxMessageId} for event {EventType}",
            message.Id,
            message.EventType);
        return Task.FromResult(false);
    }
}
