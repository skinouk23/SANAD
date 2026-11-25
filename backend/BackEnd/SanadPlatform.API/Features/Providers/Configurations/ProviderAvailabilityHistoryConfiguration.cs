using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderAvailabilityHistoryConfiguration : IEntityTypeConfiguration<ProviderAvailabilityHistory>
{
    public void Configure(EntityTypeBuilder<ProviderAvailabilityHistory> builder)
    {
        builder.ToTable("provider_availability_history");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.IsAvailable)
            .HasColumnName("is_available")
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.StatusChangedAt)
            .HasColumnName("status_changed_at")
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.Reason)
            .HasColumnName("reason")
            .HasMaxLength(500);

        builder.Property(e => e.ChangedBy)
            .HasColumnName("changed_by")
            .IsRequired();

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.ChangedByUser)
            .WithMany()
            .HasForeignKey(e => e.ChangedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.ProviderId);
        builder.HasIndex(e => e.StatusChangedAt);
    }
}
