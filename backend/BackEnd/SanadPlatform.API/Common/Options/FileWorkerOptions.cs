using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Local hosted-worker settings. Production can run the same workers as separate services.
/// </summary>
public class FileWorkerOptions
{
    public const string SectionName = "FileWorkers";

    public bool OutboxPublisherEnabled { get; set; } = true;
    public bool ScanWorkerEnabled { get; set; }
    public bool CleanupWorkerEnabled { get; set; }
    public bool DerivativeWorkerEnabled { get; set; }
    public bool ExportWorkerEnabled { get; set; }

    [Range(1, int.MaxValue)]
    public int PollIntervalSeconds { get; set; } = 10;

    [Range(1, int.MaxValue)]
    public int CleanupPollIntervalSeconds { get; set; } = 300;

    [Range(1, int.MaxValue)]
    public int MessageLockSeconds { get; set; } = 120;
}
