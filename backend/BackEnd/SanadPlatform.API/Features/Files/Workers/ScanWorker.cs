using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Files.Services;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// Polling scan worker for local single-process deployments. Production can run this class in a worker service.
/// </summary>
public class ScanWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly FileWorkerOptions _workerOptions;
    private readonly RabbitMqOptions _rabbitMqOptions;
    private readonly ILogger<ScanWorker> _logger;

    public ScanWorker(
        IServiceScopeFactory scopeFactory,
        IOptions<FileWorkerOptions> workerOptions,
        IOptions<RabbitMqOptions> rabbitMqOptions,
        ILogger<ScanWorker> logger)
    {
        _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        _workerOptions = workerOptions?.Value ?? throw new ArgumentNullException(nameof(workerOptions));
        _rabbitMqOptions = rabbitMqOptions?.Value ?? throw new ArgumentNullException(nameof(rabbitMqOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_workerOptions.ScanWorkerEnabled)
        {
            _logger.LogInformation("File scan worker is disabled.");
            return;
        }

        if (_rabbitMqOptions.Enabled)
        {
            _logger.LogInformation("File scan polling worker is disabled because RabbitMQ scan consumer is active.");
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var processor = scope.ServiceProvider.GetRequiredService<IFileScanProcessor>();
            await processor.ProcessAsync(cancellationToken: stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(_workerOptions.PollIntervalSeconds), stoppingToken);
        }
    }
}
