using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Idempotent scanner processor used by RabbitMQ consumers and disabled-broker polling fallback.
/// </summary>
public class FileScanProcessor : IFileScanProcessor
{
    private const int StaleScanningMinutes = 15;
    private const int ClaimLookaheadCount = 10;
    private const int MaxRejectionReasonLength = 1000;

    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IObjectStorageService _objectStorage;
    private readonly IFileScanner _scanner;
    private readonly FileScannerOptions _scannerOptions;

    public FileScanProcessor(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        IObjectStorageService objectStorage,
        IFileScanner scanner,
        IOptions<FileScannerOptions> scannerOptions)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _objectStorage = objectStorage ?? throw new ArgumentNullException(nameof(objectStorage));
        _scanner = scanner ?? throw new ArgumentNullException(nameof(scanner));
        _scannerOptions = scannerOptions?.Value ?? throw new ArgumentNullException(nameof(scannerOptions));
    }

    /// <inheritdoc />
    public async Task<bool> ProcessAsync(Guid? fileId = null, CancellationToken cancellationToken = default)
    {
        await RecoverStaleScanningFilesAsync(cancellationToken);

        var file = await ClaimPendingScanFileAsync(fileId, cancellationToken);
        if (file is null)
        {
            return false;
        }

        try
        {
            var readResult = await _objectStorage.ReadObjectAsync(file.StagingBucket, file.StagingObjectKey, cancellationToken: cancellationToken);
            await using var content = readResult.Content;
            var scanResult = await _scanner.ScanAsync(
                new FileScanRequest(
                    file.Id,
                    content,
                    file.OriginalFileName,
                    file.DeclaredContentType,
                    file.DetectedContentType,
                    file.SizeBytes,
                    file.Sha256,
                    file.UseCase,
                    TimeSpan.FromSeconds(_scannerOptions.TimeoutSeconds)),
                cancellationToken);
            await readResult.Completion.ConfigureAwait(false);

            var scanReason = TruncateRejectionReason(scanResult.Reason);
            var threatName = TruncateRejectionReason(scanResult.ThreatName);

            if (scanResult.Verdict == FileScanVerdict.Clean)
            {
                var metadata = await _objectStorage.CopyObjectAsync(
                    file.StagingBucket,
                    file.StagingObjectKey,
                    file.Bucket,
                    file.ObjectKey,
                    file.DetectedContentType ?? file.DeclaredContentType,
                    cancellationToken);
                file.ObjectVersionId = metadata.VersionId;
                file.ETag = metadata.ETag;
                file.Status = StoredFileStatus.Ready;
                file.ScanStatus = FileScanStatus.Clean;
                file.ScanVerdict = FileScanVerdict.Clean;
                file.ReadyAt = DateTime.UtcNow;
            }
            else if (scanResult.Verdict == FileScanVerdict.Infected)
            {
                file.QuarantineObjectKey = file.StagingObjectKey.Replace("staging/", "quarantine/", StringComparison.Ordinal);
                await _objectStorage.CopyObjectAsync(file.StagingBucket, file.StagingObjectKey, file.QuarantineBucket!, file.QuarantineObjectKey, file.DeclaredContentType, cancellationToken);
                file.Status = StoredFileStatus.Quarantined;
                file.ScanStatus = FileScanStatus.Infected;
                file.ScanVerdict = FileScanVerdict.Infected;
                file.RejectionReason = threatName ?? scanReason;
            }
            else
            {
                file.Status = StoredFileStatus.ScanFailed;
                file.ScanStatus = scanResult.Verdict switch
                {
                    FileScanVerdict.TimedOut => FileScanStatus.TimedOut,
                    FileScanVerdict.Unsupported => FileScanStatus.Unsupported,
                    _ => FileScanStatus.Failed
                };
                file.ScanVerdict = scanResult.Verdict;
                file.RejectionReason = scanReason;
            }

            file.ScanEngine = scanResult.EngineName;
            file.ScanEngineVersion = scanResult.EngineVersion;
            file.DetectedContentType = scanResult.DetectedContentType ?? file.DetectedContentType;

            _db.FileAccessAudits.Add(new FileAccessAudit
            {
                FileId = file.Id,
                ActorUserId = file.OwnerUserId,
                ActorRole = file.OwnerRole,
                Action = FilesConstants.AuditActions.ScanCompleted,
                Outcome = scanResult.Verdict == FileScanVerdict.Clean ? FilesConstants.AuditOutcomes.Succeeded : FilesConstants.AuditOutcomes.Failed,
                DetailsJson = JsonSerializer.Serialize(new
                {
                    verdict = scanResult.Verdict.ToString(),
                    status = file.Status.ToString(),
                    engine = scanResult.EngineName,
                    reason = scanReason,
                    threat = threatName
                })
            });

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            await MarkClaimedFileScanFailedAsync(file, ex, CancellationToken.None);
            return true;
        }
    }

    private async Task<StoredFile?> ClaimPendingScanFileAsync(Guid? fileId, CancellationToken cancellationToken)
    {
        var candidateQuery = _db.StoredFiles
            .AsNoTracking()
            .Where(candidate => candidate.Status == StoredFileStatus.PendingScan
                && candidate.ScanStatus == FileScanStatus.Pending);

        if (fileId.HasValue)
        {
            candidateQuery = candidateQuery.Where(candidate => candidate.Id == fileId.Value);
        }

        var candidateIds = await candidateQuery
            .OrderBy(candidate => candidate.CreatedAt)
            .Select(candidate => candidate.Id)
            .Take(fileId.HasValue ? 1 : ClaimLookaheadCount)
            .ToListAsync(cancellationToken);

        foreach (var candidateId in candidateIds)
        {
            var now = DateTime.UtcNow;
            var affectedRows = await _db.StoredFiles
                .Where(candidate => candidate.Id == candidateId
                    && candidate.Status == StoredFileStatus.PendingScan
                    && candidate.ScanStatus == FileScanStatus.Pending)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(candidate => candidate.Status, StoredFileStatus.Scanning)
                    .SetProperty(candidate => candidate.ScanStatus, FileScanStatus.Scanning)
                    .SetProperty(candidate => candidate.UpdatedAt, now),
                    cancellationToken);

            if (affectedRows == 1)
            {
                return await _db.StoredFiles
                    .FirstOrDefaultAsync(candidate => candidate.Id == candidateId, cancellationToken);
            }
        }

        return null;
    }

    private async Task MarkClaimedFileScanFailedAsync(StoredFile file, Exception exception, CancellationToken cancellationToken)
    {
        var rejectionReason = TruncateRejectionReason(string.IsNullOrWhiteSpace(exception.Message)
            ? exception.GetType().Name
            : exception.Message);

        file.Status = StoredFileStatus.ScanFailed;
        file.ScanStatus = FileScanStatus.Failed;
        file.ScanVerdict = FileScanVerdict.Failed;
        file.RejectionReason = rejectionReason;
        file.UpdatedAt = DateTime.UtcNow;

        _db.FileAccessAudits.Add(new FileAccessAudit
        {
            FileId = file.Id,
            ActorUserId = file.OwnerUserId,
            ActorRole = file.OwnerRole,
            Action = FilesConstants.AuditActions.ScanCompleted,
            Outcome = FilesConstants.AuditOutcomes.Failed,
            DetailsJson = JsonSerializer.Serialize(new
            {
                verdict = file.ScanVerdict.ToString(),
                status = file.Status.ToString(),
                engine = file.ScanEngine,
                reason = rejectionReason,
                threat = (string?)null
            })
        });

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task RecoverStaleScanningFilesAsync(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var staleBefore = now.AddMinutes(-StaleScanningMinutes);
        var rejectionReason = TruncateRejectionReason($"File scan was stuck in scanning state for more than {StaleScanningMinutes} minutes.");

        var staleFiles = await _db.StoredFiles
            .Where(candidate => candidate.Status == StoredFileStatus.Scanning
                && candidate.ScanStatus == FileScanStatus.Scanning
                && candidate.UpdatedAt < staleBefore)
            .OrderBy(candidate => candidate.UpdatedAt)
            .Take(10)
            .ToListAsync(cancellationToken);

        if (staleFiles.Count == 0)
        {
            return;
        }

        foreach (var staleFile in staleFiles)
        {
            staleFile.Status = StoredFileStatus.ScanFailed;
            staleFile.ScanStatus = FileScanStatus.Failed;
            staleFile.ScanVerdict = FileScanVerdict.Failed;
            staleFile.RejectionReason = rejectionReason;
            staleFile.UpdatedAt = now;

            _db.FileAccessAudits.Add(new FileAccessAudit
            {
                FileId = staleFile.Id,
                ActorUserId = staleFile.OwnerUserId,
                ActorRole = staleFile.OwnerRole,
                Action = FilesConstants.AuditActions.ScanCompleted,
                Outcome = FilesConstants.AuditOutcomes.Failed,
                DetailsJson = JsonSerializer.Serialize(new
                {
                    verdict = staleFile.ScanVerdict.ToString(),
                    status = staleFile.Status.ToString(),
                    engine = staleFile.ScanEngine,
                    reason = rejectionReason,
                    threat = (string?)null
                })
            });
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static string? TruncateRejectionReason(string? rejectionReason)
    {
        if (string.IsNullOrEmpty(rejectionReason) || rejectionReason.Length <= MaxRejectionReasonLength)
        {
            return rejectionReason;
        }

        return rejectionReason[..MaxRejectionReasonLength];
    }
}
