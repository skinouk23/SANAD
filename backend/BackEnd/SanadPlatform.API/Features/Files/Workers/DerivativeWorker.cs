using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// Placeholder derivative worker. Derivatives are optional and do not block ready status.
/// </summary>
public class DerivativeWorker : BackgroundService
{
    private readonly FileWorkerOptions _options;
    private readonly ILogger<DerivativeWorker> _logger;

    public DerivativeWorker(IOptions<FileWorkerOptions> options, ILogger<DerivativeWorker> logger)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_options.DerivativeWorkerEnabled)
        {
            _logger.LogInformation("File derivative worker is disabled.");
        }

        return Task.CompletedTask;
    }
}
