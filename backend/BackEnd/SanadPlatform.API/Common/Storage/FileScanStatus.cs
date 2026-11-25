namespace SanadPlatform.API.Common.Storage;

/// <summary>
/// Scanner lifecycle status for a canonical stored file.
/// </summary>
public enum FileScanStatus
{
    NotRequired,
    Pending,
    Scanning,
    Clean,
    Infected,
    Unsupported,
    Failed,
    TimedOut
}
