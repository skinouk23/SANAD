using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Idempotent cleanup processor used by RabbitMQ consumers and disabled-broker polling fallback.
/// </summary>
public class FileCleanupProcessor : IFileCleanupProcessor
{
    private const int StaleCleaningMinutes = 15;
    private const int ClaimLookaheadCount = 10;

    private readonly SanadDbContext _db;
    private readonly IObjectStorageService _objectStorage;

    public FileCleanupProcessor(
        SanadDbContext db,
        IObjectStorageService objectStorage)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _objectStorage = objectStorage ?? throw new ArgumentNullException(nameof(objectStorage));
    }

    /// <inheritdoc />
    public async Task<bool> ProcessAsync(Guid? fileId = null, CancellationToken cancellationToken = default)
    {
        await RecoverStaleCleaningFilesAsync(cancellationToken);

        var file = await ClaimDeletingFileAsync(fileId, cancellationToken);
        if (file is null)
        {
            return false;
        }

        FileAccessAudit? successAudit = null;

        try
        {
            await DeleteObjectIfPresentAsync(file.StagingBucket, file.StagingObjectKey, cancellationToken);
            await DeleteObjectIfPresentAsync(file.Bucket, file.ObjectKey, cancellationToken);
            await DeleteObjectIfPresentAsync(file.QuarantineBucket, file.QuarantineObjectKey, cancellationToken);

            file.Status = StoredFileStatus.Deleted;
            file.UpdatedAt = DateTime.UtcNow;
            successAudit = new FileAccessAudit
            {
                FileId = file.Id,
                ActorUserId = file.OwnerUserId,
                ActorRole = file.OwnerRole,
                Action = FilesConstants.AuditActions.DeleteCompleted,
                Outcome = FilesConstants.AuditOutcomes.Succeeded
            };
            _db.FileAccessAudits.Add(successAudit);
            await _db.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            if (successAudit is not null && _db.Entry(successAudit).State == EntityState.Added)
            {
                _db.Entry(successAudit).State = EntityState.Detached;
            }

            file.Status = StoredFileStatus.Deleting;
            file.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(CancellationToken.None);
            throw;
        }
    }

    private async Task<StoredFile?> ClaimDeletingFileAsync(Guid? fileId, CancellationToken cancellationToken)
    {
        var candidateQuery = _db.StoredFiles
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Where(candidate => candidate.Status == StoredFileStatus.Deleting);

        if (fileId.HasValue)
        {
            candidateQuery = candidateQuery.Where(candidate => candidate.Id == fileId.Value);
        }

        var candidateIds = await candidateQuery
            .OrderBy(candidate => candidate.UpdatedAt)
            .Select(candidate => candidate.Id)
            .Take(fileId.HasValue ? 1 : ClaimLookaheadCount)
            .ToListAsync(cancellationToken);

        foreach (var candidateId in candidateIds)
        {
            var now = DateTime.UtcNow;
            var affectedRows = await _db.StoredFiles
                .IgnoreQueryFilters()
                .Where(candidate => candidate.Id == candidateId
                    && candidate.Status == StoredFileStatus.Deleting)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(candidate => candidate.Status, StoredFileStatus.Cleaning)
                    .SetProperty(candidate => candidate.UpdatedAt, now),
                    cancellationToken);

            if (affectedRows == 1)
            {
                return await _db.StoredFiles
                    .IgnoreQueryFilters()
                    .AsTracking()
                    .FirstOrDefaultAsync(candidate => candidate.Id == candidateId, cancellationToken);
            }
        }

        return null;
    }

    private async Task RecoverStaleCleaningFilesAsync(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var staleBefore = now.AddMinutes(-StaleCleaningMinutes);

        await _db.StoredFiles
            .IgnoreQueryFilters()
            .Where(candidate => candidate.Status == StoredFileStatus.Cleaning
                && candidate.UpdatedAt < staleBefore)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(candidate => candidate.Status, StoredFileStatus.Deleting)
                .SetProperty(candidate => candidate.UpdatedAt, now),
                cancellationToken);
    }

    private async Task DeleteObjectIfPresentAsync(string? bucket, string? objectKey, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(bucket) || string.IsNullOrWhiteSpace(objectKey))
        {
            return;
        }

        try
        {
            await _objectStorage.DeleteObjectAsync(bucket, objectKey, cancellationToken);
        }
        catch (KeyNotFoundException)
        {
        }
    }
}
