using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Configurations;

/// <summary>
/// EF Core configuration for <see cref="FileAccessAudit"/>.
/// </summary>
public class FileAccessAuditConfiguration : IEntityTypeConfiguration<FileAccessAudit>
{
    public void Configure(EntityTypeBuilder<FileAccessAudit> builder)
    {
        builder.ToTable("file_access_audit");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.FileId)
            .HasColumnName("file_id")
            .IsRequired();

        builder.Property(e => e.ActorUserId)
            .HasColumnName("actor_user_id");

        builder.Property(e => e.ActorRole)
            .HasColumnName("actor_role")
            .HasMaxLength(50);

        builder.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Outcome)
            .HasColumnName("outcome")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(100);

        builder.Property(e => e.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(1000);

        builder.Property(e => e.CorrelationId)
            .HasColumnName("correlation_id")
            .HasMaxLength(100);

        builder.Property(e => e.DetailsJson)
            .HasColumnName("details_json")
            .HasColumnType("jsonb");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(e => new { e.FileId, e.CreatedAt })
            .HasDatabaseName("ix_file_access_audit_file_created");
    }
}
