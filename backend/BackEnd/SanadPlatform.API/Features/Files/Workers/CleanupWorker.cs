using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Files.Services;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// Cleanup worker for soft-deleted file objects and staging leftovers.
/// </summary>
public class CleanupWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly FileWorkerOptions _workerOptions;
    private readonly RabbitMqOptions _rabbitMqOptions;
    private readonly ILogger<CleanupWorker> _logger;

    public CleanupWorker(
        IServiceScopeFactory scopeFactory,
        IOptions<FileWorkerOptions> workerOptions,
        IOptions<RabbitMqOptions> rabbitMqOptions,
        ILogger<CleanupWorker> logger)
    {
        _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        _workerOptions = workerOptions?.Value ?? throw new ArgumentNullException(nameof(workerOptions));
        _rabbitMqOptions = rabbitMqOptions?.Value ?? throw new ArgumentNullException(nameof(rabbitMqOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_workerOptions.CleanupWorkerEnabled)
        {
            _logger.LogInformation("File cleanup worker is disabled.");
            return;
        }

        if (_rabbitMqOptions.Enabled)
        {
            _logger.LogInformation("File cleanup polling worker is disabled because RabbitMQ cleanup consumer is active.");
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var processor = scope.ServiceProvider.GetRequiredService<IFileCleanupProcessor>();
            await processor.ProcessAsync(cancellationToken: stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(_workerOptions.CleanupPollIntervalSeconds), stoppingToken);
        }
    }
}
