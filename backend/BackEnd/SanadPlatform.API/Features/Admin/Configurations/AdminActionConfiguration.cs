using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Admin.Entities;

namespace SanadPlatform.API.Features.Admin.Configurations;

public class AdminActionConfiguration : IEntityTypeConfiguration<AdminAction>
{
    public void Configure(EntityTypeBuilder<AdminAction> builder)
    {
        builder.ToTable("admin_actions");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.AdminId)
            .HasColumnName("admin_id")
            .IsRequired();

        builder.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.EntityType)
            .HasColumnName("entity_type")
            .HasMaxLength(50);

        builder.Property(e => e.EntityId)
            .HasColumnName("entity_id");

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.OldValues)
            .HasColumnName("old_values")
            .HasColumnType("jsonb");

        builder.Property(e => e.NewValues)
            .HasColumnName("new_values")
            .HasColumnType("jsonb");

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
