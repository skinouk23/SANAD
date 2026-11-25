using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Base hosted service for RabbitMQ consumers using async APIs, QoS, manual acks, and per-message DI scopes.
/// </summary>
public abstract class RabbitMqConsumerWorker : BackgroundService
{
    private readonly IRabbitMqConnectionProvider _connectionProvider;
    private readonly RabbitMqTopologyInitializer _topologyInitializer;
    private readonly RabbitMqOptions _rabbitMqOptions;
    private readonly ILogger _logger;
    private IChannel? _channel;
    private string? _consumerTag;

    protected RabbitMqConsumerWorker(
        IRabbitMqConnectionProvider connectionProvider,
        RabbitMqTopologyInitializer topologyInitializer,
        RabbitMqOptions rabbitMqOptions,
        ILogger logger)
    {
        _connectionProvider = connectionProvider ?? throw new ArgumentNullException(nameof(connectionProvider));
        _topologyInitializer = topologyInitializer ?? throw new ArgumentNullException(nameof(topologyInitializer));
        _rabbitMqOptions = rabbitMqOptions ?? throw new ArgumentNullException(nameof(rabbitMqOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected abstract string QueueName { get; }

    protected abstract Task HandleMessageAsync(string body, string routingKey, CancellationToken cancellationToken);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_rabbitMqOptions.Enabled)
        {
            _logger.LogInformation("RabbitMQ consumer for queue {QueueName} is disabled because RabbitMQ is disabled.", QueueName);
            return;
        }

        await _topologyInitializer.InitializeAsync(stoppingToken);

        var connection = await _connectionProvider.GetConnectionAsync(stoppingToken);
        _channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);
        await _channel.BasicQosAsync(0, _rabbitMqOptions.PrefetchCount, global: false, stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += OnReceivedAsync;

        _consumerTag = await _channel.BasicConsumeAsync(
            QueueName,
            autoAck: false,
            consumerTag: string.Empty,
            noLocal: false,
            exclusive: false,
            arguments: null,
            consumer,
            stoppingToken);

        _logger.LogInformation("RabbitMQ consumer {ConsumerTag} started for queue {QueueName}", _consumerTag, QueueName);

        try
        {
            await Task.Delay(Timeout.InfiniteTimeSpan, stoppingToken);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            // Graceful shutdown.
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_channel is not null && _channel.IsOpen && !string.IsNullOrWhiteSpace(_consumerTag))
        {
            await _channel.BasicCancelAsync(_consumerTag, noWait: false, cancellationToken);
        }

        await base.StopAsync(cancellationToken);
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        base.Dispose();
    }

    private async Task OnReceivedAsync(object sender, BasicDeliverEventArgs args)
    {
        if (_channel is null)
        {
            return;
        }

        try
        {
            var body = Encoding.UTF8.GetString(args.Body.ToArray());
            await HandleMessageAsync(body, args.RoutingKey, args.CancellationToken);
            await _channel.BasicAckAsync(args.DeliveryTag, multiple: false, args.CancellationToken);
        }
        catch (OperationCanceledException) when (args.CancellationToken.IsCancellationRequested)
        {
            await _channel.BasicNackAsync(args.DeliveryTag, multiple: false, requeue: true, CancellationToken.None);
        }
        catch (InvalidDataException ex)
        {
            _logger.LogWarning(
                ex,
                "Rejecting invalid RabbitMQ message from queue {QueueName} with routing key {RoutingKey}",
                QueueName,
                args.RoutingKey);
            await _channel.BasicNackAsync(args.DeliveryTag, multiple: false, requeue: false, args.CancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "RabbitMQ consumer for queue {QueueName} failed to process routing key {RoutingKey}; message will be dead-lettered",
                QueueName,
                args.RoutingKey);
            await _channel.BasicNackAsync(args.DeliveryTag, multiple: false, requeue: false, args.CancellationToken);
        }
    }
}
