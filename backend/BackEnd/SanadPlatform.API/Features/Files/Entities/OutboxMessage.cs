using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.Entities;

/// <summary>
/// Durable integration-event row used to publish file work to RabbitMQ without losing messages.
/// </summary>
public class OutboxMessage : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string EventType { get; set; } = string.Empty;
    public string AggregateType { get; set; } = string.Empty;
    public Guid AggregateId { get; set; }
    public string PayloadJson { get; set; } = string.Empty;
    public string? CorrelationId { get; set; }
    public string IdempotencyKey { get; set; } = string.Empty;
    public OutboxStatus Status { get; set; } = OutboxStatus.Pending;
    public DateTime OccurredAt { get; set; }
    public DateTime? NextAttemptAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int RetryCount { get; set; }
    public string? LockedBy { get; set; }
    public DateTime? LockedUntil { get; set; }
    public string? LastError { get; set; }
    public DateTime? DeadLetteredAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
