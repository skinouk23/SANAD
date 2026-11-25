using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Scanner request passed to a pluggable antivirus or content inspection provider.
/// </summary>
public sealed record FileScanRequest(
    Guid FileId,
    Stream Content,
    string OriginalFileName,
    string DeclaredContentType,
    string? DetectedContentType,
    long SizeBytes,
    string Sha256,
    FileUseCase UseCase,
    TimeSpan Timeout);

/// <summary>
/// Scanner verdict returned by the pluggable scanning boundary.
/// </summary>
public sealed record FileScanResult(
    FileScanVerdict Verdict,
    string? Reason,
    string EngineName,
    string EngineVersion,
    TimeSpan Duration,
    string? ThreatName,
    string? DetectedContentType);

/// <summary>
/// Pluggable malware/content scanning boundary.
/// </summary>
public interface IFileScanner
{
    Task<FileScanResult> ScanAsync(FileScanRequest request, CancellationToken cancellationToken = default);
}
