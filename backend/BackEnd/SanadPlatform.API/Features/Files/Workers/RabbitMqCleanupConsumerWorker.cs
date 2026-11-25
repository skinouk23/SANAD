using System.Text.Json;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Files.Messaging;
using SanadPlatform.API.Features.Files.Services;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// RabbitMQ consumer for cleanup requests from the files.cleanup queue.
/// </summary>
public class RabbitMqCleanupConsumerWorker : RabbitMqConsumerWorker
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RabbitMqCleanupConsumerWorker> _logger;

    public RabbitMqCleanupConsumerWorker(
        IRabbitMqConnectionProvider connectionProvider,
        RabbitMqTopologyInitializer topologyInitializer,
        IOptions<RabbitMqOptions> rabbitMqOptions,
        IServiceScopeFactory scopeFactory,
        ILogger<RabbitMqCleanupConsumerWorker> logger)
        : base(connectionProvider, topologyInitializer, rabbitMqOptions.Value, logger)
    {
        _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override string QueueName => FilesConstants.Queues.Cleanup;

    protected override async Task HandleMessageAsync(string body, string routingKey, CancellationToken cancellationToken)
    {
        var payload = DeserializePayload(body);
        var fileId = payload.FileId == Guid.Empty ? (Guid?)null : payload.FileId;

        await using var scope = _scopeFactory.CreateAsyncScope();
        var processor = scope.ServiceProvider.GetRequiredService<IFileCleanupProcessor>();
        var processed = await processor.ProcessAsync(fileId, cancellationToken);
        if (!processed)
        {
            _logger.LogInformation(
                "Cleanup message for file {FileId} had no deleting file to process; acknowledging idempotently",
                fileId);
        }
    }

    private static RabbitMqFileEventPayload DeserializePayload(string body)
    {
        try
        {
            return JsonSerializer.Deserialize<RabbitMqFileEventPayload>(body)
                ?? throw new InvalidDataException("Cleanup message payload is empty.");
        }
        catch (JsonException ex)
        {
            throw new InvalidDataException("Cleanup message payload is invalid JSON.", ex);
        }
    }
}
