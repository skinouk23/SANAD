using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Repository;

/// <summary>
/// Repository contract for canonical file metadata, audit, and outbox rows.
/// </summary>
public interface IStoredFileRepository
{
    Task CreateAsync(StoredFile file, CancellationToken cancellationToken = default);
    Task<StoredFile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<StoredFile?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StoredFile>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default);
    Task<int> CountByApplicationAsync(Guid applicationId, FileUseCase useCase, CancellationToken cancellationToken = default);
    Task CreateAuditAsync(FileAccessAudit audit, CancellationToken cancellationToken = default);
    Task CreateOutboxMessageAsync(OutboxMessage message, CancellationToken cancellationToken = default);
}
