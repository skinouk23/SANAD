namespace SanadPlatform.API.Features.Files;

/// <summary>
/// File event, routing, queue, audit, and token constants.
/// </summary>
public static class FilesConstants
{
    public const string ProviderSignupUploadTokenHeader = "X-Provider-Signup-Upload-Token";
    public const string ApplicationUploadTokenHeader = "X-Application-Upload-Token";
    public const string ProviderSignupOwnerRole = "provider_signup";

    public static class Events
    {
        public const string FileStaged = "files.staged";
        public const string ScanRequested = "files.scan.requested";
        public const string ScanCompleted = "files.scan.completed";
        public const string ScanFailed = "files.scan.failed";
        public const string FileReady = "files.ready";
        public const string FileRejected = "files.rejected";
        public const string FileQuarantined = "files.quarantined";
        public const string DerivativeRequested = "files.derivative.requested";
        public const string ExportRequested = "files.export.requested";
        public const string CleanupRequested = "files.cleanup.requested";
        public const string AuditRequested = "files.audit.requested";
    }

    public static class Queues
    {
        public const string Scan = "files.scan";
        public const string Derivatives = "files.derivatives";
        public const string Exports = "files.exports";
        public const string Cleanup = "files.cleanup";
        public const string Audit = "files.audit";
    }

    public static class AuditActions
    {
        public const string UploadAccepted = "upload_accepted";
        public const string UploadDenied = "upload_denied";
        public const string MetadataRead = "metadata_read";
        public const string ContentDownloadStarted = "content_download_started";
        public const string ContentDownloadDenied = "content_download_denied";
        public const string DeleteRequested = "delete_requested";
        public const string DeleteCompleted = "delete_completed";
        public const string ScanCompleted = "scan_completed";
        public const string QuarantineApplied = "quarantine_applied";
    }

    public static class AuditOutcomes
    {
        public const string Succeeded = "succeeded";
        public const string Denied = "denied";
        public const string Failed = "failed";
    }
}
