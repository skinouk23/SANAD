using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Fraud.Entities;

namespace SanadPlatform.API.Features.Fraud.Configurations;

public class FraudEventConfiguration : IEntityTypeConfiguration<FraudEvent>
{
    public void Configure(EntityTypeBuilder<FraudEvent> builder)
    {
        builder.ToTable("fraud_events");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.EventType)
            .HasColumnName("event_type")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.UserId)
            .HasColumnName("user_id");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.PaymentAttemptId)
            .HasColumnName("payment_attempt_id");

        builder.Property(e => e.ReviewId)
            .HasColumnName("review_id");

        builder.Property(e => e.FraudScore)
            .HasColumnName("fraud_score")
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(e => e.Decision)
            .HasColumnName("decision")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.RiskLevel)
            .HasColumnName("risk_level")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Features)
            .HasColumnName("features")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(e => e.TopRiskFactors)
            .HasColumnName("top_risk_factors")
            .HasColumnType("jsonb");

        builder.Property(e => e.ModelVersion)
            .HasColumnName("model_version")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.ProcessingTimeMs)
            .HasColumnName("processing_time_ms");

        builder.Property(e => e.RequiresReview)
            .HasColumnName("requires_review")
            .HasDefaultValue(false);

        builder.Property(e => e.ReviewedAt)
            .HasColumnName("reviewed_at");

        builder.Property(e => e.ReviewedBy)
            .HasColumnName("reviewed_by");

        builder.Property(e => e.ReviewDecision)
            .HasColumnName("review_decision")
            .HasMaxLength(20);

        builder.Property(e => e.ReviewNotes)
            .HasColumnName("review_notes");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("idx_fraud_events_user");

        builder.HasIndex(e => e.Decision)
            .HasDatabaseName("idx_fraud_events_decision");

        builder.HasIndex(e => e.FraudScore)
            .HasDatabaseName("idx_fraud_events_score");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_fraud_events_created")
            .IsDescending();
    }
}
