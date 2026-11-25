using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Fraud.Entities;

namespace SanadPlatform.API.Features.Fraud.Configurations;

public class FraudBlacklistConfiguration : IEntityTypeConfiguration<FraudBlacklist>
{
    public void Configure(EntityTypeBuilder<FraudBlacklist> builder)
    {
        builder.ToTable("fraud_blacklist");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.EntityType)
            .HasColumnName("entity_type")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.EntityValue)
            .HasColumnName("entity_value")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.Reason)
            .HasColumnName("reason");

        builder.Property(e => e.Severity)
            .HasColumnName("severity")
            .HasMaxLength(20)
            .HasDefaultValue("high");

        builder.Property(e => e.Source)
            .HasColumnName("source")
            .HasMaxLength(50);

        builder.Property(e => e.AddedBy)
            .HasColumnName("added_by");

        builder.Property(e => e.ExpiresAt)
            .HasColumnName("expires_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(e => new { e.EntityType, e.EntityValue })
            .IsUnique()
            .HasDatabaseName("idx_fraud_blacklist_type_value");
    }
}
