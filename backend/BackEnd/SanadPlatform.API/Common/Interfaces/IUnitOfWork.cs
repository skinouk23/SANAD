using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace SanadPlatform.API.Common.Interfaces;

/// <summary>
/// Abstraction over EF Core's DbContext for transaction and save-change management.
///
/// Repositories stage changes via the EF change tracker (Add / Update / Remove) but
/// do NOT call SaveChangesAsync themselves. Handlers inject IUnitOfWork and decide:
///   - When to flush all staged changes to the database (SaveChangesAsync).
///   - When a multi-step operation must be atomic (Begin / Commit / Rollback).
///
/// Usage — simple single-step write:
/// <code>
///     await _repository.UpdateAsync(entity, ct);   // stages the change
///     await _unitOfWork.SaveChangesAsync(ct);       // one DB roundtrip
/// </code>
///
/// Usage — multi-step atomic write (preferred):
/// <code>
///     return await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
///     {
///         await _repoA.CreateAsync(a, ct);
///         await _repoB.CreateAsync(b, ct);
///         await _unitOfWork.SaveChangesAsync(ct);
///         return result;
///     }, cancellationToken);
/// </code>
///
/// The wrapper handles Begin / Commit / Rollback and the execution strategy
/// internally, so handlers stay free of try-catch while guaranteeing cleanup.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Persists all staged change-tracker changes to the database.
    /// Returns the number of state entries written.
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Opens a new database transaction.
    /// Must be followed by either <see cref="CommitTransactionAsync"/> or
    /// <see cref="RollbackTransactionAsync"/>.
    /// </summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commits the current transaction and disposes it.
    /// </summary>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current transaction and disposes it.
    /// </summary>
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns an execution strategy that wraps operations with the configured
    /// retry-on-failure policy (required when combining explicit transactions with
    /// Npgsql's EnableRetryOnFailure).
    /// </summary>
    IExecutionStrategy CreateExecutionStrategy();

    /// <summary>
    /// Executes <paramref name="operation"/> inside an explicit transaction with
    /// retry support. Guarantees rollback on failure so handlers stay free of
    /// try-catch while the transaction is always cleaned up.
    /// </summary>
    Task<T> ExecuteInTransactionAsync<T>(
        Func<CancellationToken, Task<T>> operation,
        CancellationToken cancellationToken = default);

    /// <inheritdoc cref="ExecuteInTransactionAsync{T}"/>
    Task ExecuteInTransactionAsync(
        Func<CancellationToken, Task> operation,
        CancellationToken cancellationToken = default);
}
