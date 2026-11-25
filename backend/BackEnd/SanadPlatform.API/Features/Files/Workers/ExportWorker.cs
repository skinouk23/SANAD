using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// Placeholder export worker for future GDPR/archive jobs using the same file pipeline.
/// </summary>
public class ExportWorker : BackgroundService
{
    private readonly FileWorkerOptions _options;
    private readonly ILogger<ExportWorker> _logger;

    public ExportWorker(IOptions<FileWorkerOptions> options, ILogger<ExportWorker> logger)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_options.ExportWorkerEnabled)
        {
            _logger.LogInformation("File export worker is disabled.");
        }

        return Task.CompletedTask;
    }
}
