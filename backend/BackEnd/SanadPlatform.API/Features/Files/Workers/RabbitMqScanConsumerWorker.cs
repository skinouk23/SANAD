using System.Text.Json;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Files.Messaging;
using SanadPlatform.API.Features.Files.Services;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// RabbitMQ consumer for scan requests from the files.scan queue.
/// </summary>
public class RabbitMqScanConsumerWorker : RabbitMqConsumerWorker
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RabbitMqScanConsumerWorker> _logger;

    public RabbitMqScanConsumerWorker(
        IRabbitMqConnectionProvider connectionProvider,
        RabbitMqTopologyInitializer topologyInitializer,
        IOptions<RabbitMqOptions> rabbitMqOptions,
        IServiceScopeFactory scopeFactory,
        ILogger<RabbitMqScanConsumerWorker> logger)
        : base(connectionProvider, topologyInitializer, rabbitMqOptions.Value, logger)
    {
        _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override string QueueName => FilesConstants.Queues.Scan;

    protected override async Task HandleMessageAsync(string body, string routingKey, CancellationToken cancellationToken)
    {
        var payload = DeserializePayload(body);
        if (payload.FileId == Guid.Empty)
        {
            throw new InvalidDataException("Scan message is missing fileId.");
        }

        await using var scope = _scopeFactory.CreateAsyncScope();
        var processor = scope.ServiceProvider.GetRequiredService<IFileScanProcessor>();
        var processed = await processor.ProcessAsync(payload.FileId, cancellationToken);
        if (!processed)
        {
            _logger.LogInformation(
                "Scan message for file {FileId} was already processed or no longer pending; acknowledging idempotently",
                payload.FileId);
        }
    }

    private static RabbitMqFileEventPayload DeserializePayload(string body)
    {
        try
        {
            return JsonSerializer.Deserialize<RabbitMqFileEventPayload>(body)
                ?? throw new InvalidDataException("Scan message payload is empty.");
        }
        catch (JsonException ex)
        {
            throw new InvalidDataException("Scan message payload is invalid JSON.", ex);
        }
    }
}
