namespace SanadPlatform.API.Common.Storage;

/// <summary>
/// Product lifecycle status for a canonical stored file.
/// </summary>
public enum StoredFileStatus
{
    Uploading,
    Staged,
    PendingScan,
    Scanning,
    ScanFailed,
    Ready,
    Rejected,
    Quarantined,
    Deleting,
    Cleaning,
    Deleted
}
