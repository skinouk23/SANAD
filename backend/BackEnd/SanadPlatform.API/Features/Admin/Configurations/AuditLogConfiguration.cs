using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Admin.Entities;

namespace SanadPlatform.API.Features.Admin.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.TableName)
            .HasColumnName("table_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.RecordId)
            .HasColumnName("record_id")
            .IsRequired();

        builder.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.UserId)
            .HasColumnName("user_id");

        builder.Property(e => e.OldData)
            .HasColumnName("old_data")
            .HasColumnType("jsonb");

        builder.Property(e => e.NewData)
            .HasColumnName("new_data")
            .HasColumnType("jsonb");

        builder.Property(e => e.ChangedFields)
            .HasColumnName("changed_fields")
            .HasColumnType("text[]");

        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(e => e.UserAgent)
            .HasColumnName("user_agent");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}
