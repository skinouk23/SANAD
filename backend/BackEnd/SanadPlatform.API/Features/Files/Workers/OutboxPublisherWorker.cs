using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Files.Messaging;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Files.Workers;

/// <summary>
/// Hosted outbox publisher. It preserves DB outbox rows when RabbitMQ is disabled or unavailable.
/// </summary>
public class OutboxPublisherWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly FileWorkerOptions _workerOptions;
    private readonly RabbitMqOptions _rabbitMqOptions;
    private readonly ILogger<OutboxPublisherWorker> _logger;
    private readonly string _workerId = $"outbox-{Environment.MachineName}-{Guid.NewGuid():N}";

    public OutboxPublisherWorker(
        IServiceScopeFactory scopeFactory,
        IOptions<FileWorkerOptions> workerOptions,
        IOptions<RabbitMqOptions> rabbitMqOptions,
        ILogger<OutboxPublisherWorker> logger)
    {
        _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        _workerOptions = workerOptions?.Value ?? throw new ArgumentNullException(nameof(workerOptions));
        _rabbitMqOptions = rabbitMqOptions?.Value ?? throw new ArgumentNullException(nameof(rabbitMqOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_workerOptions.OutboxPublisherEnabled)
        {
            _logger.LogInformation("Outbox publisher worker is disabled.");
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            await PublishBatchAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(_workerOptions.PollIntervalSeconds), stoppingToken);
        }
    }

    private async Task PublishBatchAsync(CancellationToken cancellationToken)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<SanadDbContext>();
        var publisher = scope.ServiceProvider.GetRequiredService<IFileEventPublisher>();
        var now = DateTime.UtcNow;
        var lockUntil = now.AddSeconds(_workerOptions.MessageLockSeconds);

        var messages = await ClaimOutboxMessagesAsync(
            db,
            now,
            lockUntil,
            _rabbitMqOptions.PublishBatchSize,
            cancellationToken);

        var hasChanges = false;
        foreach (var message in messages)
        {
            var published = false;
            string? error = null;
            try
            {
                published = await publisher.PublishAsync(message, cancellationToken);
            }
            catch (Exception ex) when (!cancellationToken.IsCancellationRequested)
            {
                error = ex.Message;
                _logger.LogWarning(
                    ex,
                    "Failed to publish outbox message {OutboxMessageId} for event {EventType}",
                    message.Id,
                    message.EventType);
            }

            if (published)
            {
                message.Status = OutboxStatus.Published;
                message.PublishedAt = DateTime.UtcNow;
                message.ProcessedAt = DateTime.UtcNow;
                message.LockedBy = null;
                message.LockedUntil = null;
                message.LastError = null;
                hasChanges = true;
                continue;
            }

            message.RetryCount++;
            message.LastError = error ?? (message.LastError ?? "RabbitMQ publisher returned false.");
            if (message.RetryCount >= _rabbitMqOptions.MaxPublishAttempts && _rabbitMqOptions.Enabled)
            {
                message.Status = OutboxStatus.DeadLettered;
                message.DeadLetteredAt = DateTime.UtcNow;
                message.LockedBy = null;
                message.LockedUntil = null;
                hasChanges = true;
                continue;
            }

            message.Status = OutboxStatus.Pending;
            message.LockedBy = null;
            message.LockedUntil = null;
            message.NextAttemptAt = DateTime.UtcNow.AddSeconds(ComputeBackoffSeconds(message.RetryCount));
            hasChanges = true;
        }

        if (hasChanges)
        {
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    private static int ComputeBackoffSeconds(int retryCount)
    {
        return Math.Min(300, (int)Math.Pow(2, Math.Min(retryCount, 8)));
    }

    private async Task<List<OutboxMessage>> ClaimOutboxMessagesAsync(
        SanadDbContext db,
        DateTime now,
        DateTime lockUntil,
        int batchSize,
        CancellationToken cancellationToken)
    {
        if (batchSize <= 0)
        {
            return new List<OutboxMessage>();
        }

        var candidateIds = await ClaimableOutboxMessages(db.OutboxMessages.AsNoTracking(), now)
            .OrderBy(message => message.OccurredAt)
            .Take(batchSize * 2)
            .Select(message => message.Id)
            .ToListAsync(cancellationToken);

        var claimedIds = new List<Guid>(batchSize);
        foreach (var candidateId in candidateIds)
        {
            if (claimedIds.Count == batchSize)
            {
                break;
            }

            var affectedRows = await ClaimableOutboxMessages(
                    db.OutboxMessages.Where(message => message.Id == candidateId),
                    now)
                .ExecuteUpdateAsync(
                    setters => setters
                        .SetProperty(message => message.Status, OutboxStatus.Publishing)
                        .SetProperty(message => message.LockedBy, _workerId)
                        .SetProperty(message => message.LockedUntil, lockUntil)
                        .SetProperty(message => message.UpdatedAt, now),
                    cancellationToken);

            if (affectedRows == 1)
            {
                claimedIds.Add(candidateId);
            }
        }

        if (claimedIds.Count == 0)
        {
            return new List<OutboxMessage>();
        }

        return await db.OutboxMessages
            .Where(message => claimedIds.Contains(message.Id))
            .OrderBy(message => message.OccurredAt)
            .ToListAsync(cancellationToken);
    }

    private static IQueryable<OutboxMessage> ClaimableOutboxMessages(
        IQueryable<OutboxMessage> messages,
        DateTime now)
    {
        return messages.Where(message =>
            ((message.Status == OutboxStatus.Pending || message.Status == OutboxStatus.Failed)
                && (message.NextAttemptAt == null || message.NextAttemptAt <= now)
                && (message.LockedUntil == null || message.LockedUntil <= now))
            || (message.Status == OutboxStatus.Publishing
                && message.LockedUntil != null
                && message.LockedUntil <= now));
    }
}
