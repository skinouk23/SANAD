using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Declares durable RabbitMQ file exchanges, queues, bindings, dead-letter exchange, and DLQs.
/// </summary>
public class RabbitMqTopologyInitializer : IHostedService
{
    private readonly IRabbitMqConnectionProvider _connectionProvider;
    private readonly RabbitMqOptions _options;
    private readonly ILogger<RabbitMqTopologyInitializer> _logger;
    private readonly SemaphoreSlim _initializeLock = new(1, 1);
    private bool _initialized;

    public RabbitMqTopologyInitializer(
        IRabbitMqConnectionProvider connectionProvider,
        IOptions<RabbitMqOptions> options,
        ILogger<RabbitMqTopologyInitializer> logger)
    {
        _connectionProvider = connectionProvider ?? throw new ArgumentNullException(nameof(connectionProvider));
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task StartAsync(CancellationToken cancellationToken) => InitializeAsync(cancellationToken);

    /// <summary>
    /// Ensures RabbitMQ topology exists. Safe to call from consumers before subscribing.
    /// </summary>
    public async Task InitializeAsync(CancellationToken cancellationToken)
    {
        if (!_options.Enabled)
        {
            _logger.LogInformation("RabbitMQ topology initialization skipped because RabbitMQ is disabled.");
            return;
        }

        if (_initialized)
        {
            return;
        }

        await _initializeLock.WaitAsync(cancellationToken);
        try
        {
            if (_initialized)
            {
                return;
            }

            var connection = await _connectionProvider.GetConnectionAsync(cancellationToken);
            await using var channel = await connection.CreateChannelAsync(cancellationToken: cancellationToken);

            await channel.ExchangeDeclareAsync(
                _options.ExchangeName,
                ExchangeType.Topic,
                durable: true,
                autoDelete: false,
                cancellationToken: cancellationToken);

            await channel.ExchangeDeclareAsync(
                _options.DeadLetterExchangeName,
                ExchangeType.Topic,
                durable: true,
                autoDelete: false,
                cancellationToken: cancellationToken);

            await DeclareQueueAsync(channel, FilesConstants.Queues.Scan, FilesConstants.Events.ScanRequested, cancellationToken);
            await DeclareQueueAsync(channel, FilesConstants.Queues.Cleanup, FilesConstants.Events.CleanupRequested, cancellationToken);
            await DeclareQueueAsync(channel, FilesConstants.Queues.Derivatives, FilesConstants.Events.DerivativeRequested, cancellationToken);
            await DeclareQueueAsync(channel, FilesConstants.Queues.Exports, FilesConstants.Events.ExportRequested, cancellationToken);
            await DeclareQueueAsync(channel, FilesConstants.Queues.Audit, FilesConstants.Events.AuditRequested, cancellationToken);

            _initialized = true;
            _logger.LogInformation(
                "RabbitMQ file topology initialized for exchange {ExchangeName}",
                _options.ExchangeName);
        }
        finally
        {
            _initializeLock.Release();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task DeclareQueueAsync(
        IChannel channel,
        string queueName,
        string routingKey,
        CancellationToken cancellationToken)
    {
        var deadLetterQueueName = queueName + ".dlq";
        var queueArgs = new Dictionary<string, object?>
        {
            ["x-dead-letter-exchange"] = _options.DeadLetterExchangeName,
            ["x-dead-letter-routing-key"] = queueName + ".dead"
        };

        if (_options.UseQuorumQueues)
        {
            queueArgs["x-queue-type"] = "quorum";
        }

        var deadLetterQueueArgs = new Dictionary<string, object?>();
        if (_options.UseQuorumQueues)
        {
            deadLetterQueueArgs["x-queue-type"] = "quorum";
        }

        await channel.QueueDeclareAsync(
            queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: queueArgs!,
            cancellationToken: cancellationToken);

        await channel.QueueBindAsync(
            queueName,
            _options.ExchangeName,
            routingKey,
            cancellationToken: cancellationToken);

        await channel.QueueDeclareAsync(
            deadLetterQueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: deadLetterQueueArgs!,
            cancellationToken: cancellationToken);

        await channel.QueueBindAsync(
            deadLetterQueueName,
            _options.DeadLetterExchangeName,
            queueName + ".dead",
            cancellationToken: cancellationToken);
    }
}
