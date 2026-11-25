using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Scanner configuration for the pluggable file scanning boundary.
/// </summary>
public class FileScannerOptions
{
    public const string SectionName = "FileScanner";

    /// <summary>Supported values: NoopDevelopment, ClamAv.</summary>
    [Required]
    public string Provider { get; set; } = "NoopDevelopment";

    /// <summary>
    /// Allows the no-op scanner to return clean. This must stay false outside development.
    /// </summary>
    public bool AllowUnsafeNoopScanner { get; set; }

    public string? ClamAvHost { get; set; }

    [Range(1, 65535)]
    public int ClamAvPort { get; set; } = 3310;

    [Range(1, int.MaxValue)]
    public int TimeoutSeconds { get; set; } = 30;

    [Range(1, long.MaxValue)]
    public long MaxScanBytes { get; set; } = 100 * 1024 * 1024;
}
