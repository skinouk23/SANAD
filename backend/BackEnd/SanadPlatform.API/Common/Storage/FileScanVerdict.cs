namespace SanadPlatform.API.Common.Storage;

/// <summary>
/// Scanner verdict for a completed scan attempt.
/// </summary>
public enum FileScanVerdict
{
    Unknown,
    Clean,
    Infected,
    Unsupported,
    Failed,
    TimedOut
}
