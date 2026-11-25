using System.Text;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// RabbitMQ publisher for file outbox messages using durable messages and publisher confirms.
/// </summary>
public class RabbitMqFileEventPublisher : IFileEventPublisher
{
    private readonly IRabbitMqConnectionProvider _connectionProvider;
    private readonly RabbitMqOptions _options;
    private readonly ILogger<RabbitMqFileEventPublisher> _logger;

    public RabbitMqFileEventPublisher(
        IRabbitMqConnectionProvider connectionProvider,
        IOptions<RabbitMqOptions> options,
        ILogger<RabbitMqFileEventPublisher> logger)
    {
        _connectionProvider = connectionProvider ?? throw new ArgumentNullException(nameof(connectionProvider));
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<bool> PublishAsync(OutboxMessage message, CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
        {
            _logger.LogDebug(
                "RabbitMQ disabled; outbox message {OutboxMessageId} remains pending",
                message.Id);
            return false;
        }

        var connection = await _connectionProvider.GetConnectionAsync(cancellationToken);
        var channelOptions = new CreateChannelOptions(
            publisherConfirmationsEnabled: _options.PublisherConfirms,
            publisherConfirmationTrackingEnabled: _options.PublisherConfirms,
            outstandingPublisherConfirmationsRateLimiter: null,
            consumerDispatchConcurrency: null);

        await using var channel = await connection.CreateChannelAsync(channelOptions, cancellationToken);
        var properties = new BasicProperties
        {
            Persistent = true,
            ContentType = "application/json",
            MessageId = message.Id.ToString("D"),
            CorrelationId = message.CorrelationId,
            Type = message.EventType,
            Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds()),
            Headers = new Dictionary<string, object?>
            {
                ["aggregate-type"] = message.AggregateType,
                ["aggregate-id"] = message.AggregateId.ToString("D"),
                ["idempotency-key"] = message.IdempotencyKey
            }!
        };

        var body = Encoding.UTF8.GetBytes(message.PayloadJson);
        await channel.BasicPublishAsync(
            exchange: _options.ExchangeName,
            routingKey: message.EventType,
            mandatory: true,
            basicProperties: properties,
            body: body,
            cancellationToken: cancellationToken);

        _logger.LogInformation(
            "Published outbox message {OutboxMessageId} to RabbitMQ exchange {ExchangeName} with routing key {RoutingKey}",
            message.Id,
            _options.ExchangeName,
            message.EventType);

        return true;
    }
}
