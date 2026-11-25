using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Configurations;

/// <summary>
/// EF Core configuration for <see cref="OutboxMessage"/>.
/// </summary>
public class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage>
{
    public void Configure(EntityTypeBuilder<OutboxMessage> builder)
    {
        builder.ToTable("outbox_messages");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.EventType)
            .HasColumnName("event_type")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.AggregateType)
            .HasColumnName("aggregate_type")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.AggregateId)
            .HasColumnName("aggregate_id")
            .IsRequired();

        builder.Property(e => e.PayloadJson)
            .HasColumnName("payload_json")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(e => e.CorrelationId)
            .HasColumnName("correlation_id")
            .HasMaxLength(100);

        builder.Property(e => e.IdempotencyKey)
            .HasColumnName("idempotency_key")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.OccurredAt)
            .HasColumnName("occurred_at")
            .IsRequired();

        builder.Property(e => e.NextAttemptAt)
            .HasColumnName("next_attempt_at");

        builder.Property(e => e.PublishedAt)
            .HasColumnName("published_at");

        builder.Property(e => e.ProcessedAt)
            .HasColumnName("processed_at");

        builder.Property(e => e.RetryCount)
            .HasColumnName("retry_count")
            .HasDefaultValue(0);

        builder.Property(e => e.LockedBy)
            .HasColumnName("locked_by")
            .HasMaxLength(100);

        builder.Property(e => e.LockedUntil)
            .HasColumnName("locked_until");

        builder.Property(e => e.LastError)
            .HasColumnName("last_error")
            .HasMaxLength(2000);

        builder.Property(e => e.DeadLetteredAt)
            .HasColumnName("dead_lettered_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(e => new { e.Status, e.NextAttemptAt, e.OccurredAt })
            .HasDatabaseName("ix_outbox_messages_status_next_attempt_occurred");

        builder.HasIndex(e => e.IdempotencyKey)
            .IsUnique()
            .HasDatabaseName("ix_outbox_messages_idempotency_key");
    }
}
