using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Fraud.Entities;

namespace SanadPlatform.API.Features.Fraud.Configurations;

public class FraudRuleConfiguration : IEntityTypeConfiguration<FraudRule>
{
    public void Configure(EntityTypeBuilder<FraudRule> builder)
    {
        builder.ToTable("fraud_rules");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.RuleType)
            .HasColumnName("rule_type")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Config)
            .HasColumnName("config")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Priority)
            .HasColumnName("priority")
            .HasDefaultValue(0);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}
