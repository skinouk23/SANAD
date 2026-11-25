using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Files.Repository;

/// <summary>
/// EF Core implementation for canonical file rows. Write methods only stage changes.
/// </summary>
public class StoredFileRepository : IStoredFileRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<StoredFileRepository> _logger;

    public StoredFileRepository(
        SanadDbContext context,
        ILogger<StoredFileRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public Task CreateAsync(StoredFile file, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(file);
        _context.StoredFiles.Add(file);
        _logger.LogDebug("Staged stored file {FileId} for creation", file.Id);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<StoredFile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.StoredFiles
            .AsNoTracking()
            .FirstOrDefaultAsync(file => file.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<StoredFile?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.StoredFiles
            .FirstOrDefaultAsync(file => file.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<StoredFile>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return [];
        }

        return await _context.StoredFiles
            .AsNoTracking()
            .Where(file => ids.Contains(file.Id))
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<int> CountByApplicationAsync(
        Guid applicationId,
        FileUseCase useCase,
        CancellationToken cancellationToken = default)
    {
        return await _context.StoredFiles
            .AsNoTracking()
            .CountAsync(file => file.RelatedApplicationId == applicationId && file.UseCase == useCase, cancellationToken);
    }

    /// <inheritdoc />
    public Task CreateAuditAsync(FileAccessAudit audit, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(audit);
        _context.FileAccessAudits.Add(audit);
        _logger.LogDebug("Staged file audit {AuditId} for file {FileId}", audit.Id, audit.FileId);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task CreateOutboxMessageAsync(OutboxMessage message, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(message);
        _context.OutboxMessages.Add(message);
        _logger.LogDebug("Staged outbox message {OutboxMessageId} for aggregate {AggregateId}", message.Id, message.AggregateId);
        return Task.CompletedTask;
    }
}
