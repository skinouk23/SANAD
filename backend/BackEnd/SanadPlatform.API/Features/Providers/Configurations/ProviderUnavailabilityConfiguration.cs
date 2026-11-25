using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderUnavailabilityConfiguration : IEntityTypeConfiguration<ProviderUnavailability>
{
    public void Configure(EntityTypeBuilder<ProviderUnavailability> builder)
    {
        builder.ToTable("provider_unavailability");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.StartDatetime)
            .HasColumnName("start_datetime")
            .IsRequired();

        builder.Property(e => e.EndDatetime)
            .HasColumnName("end_datetime")
            .IsRequired();

        builder.Property(e => e.IsAllDay)
            .HasColumnName("is_all_day")
            .HasDefaultValue(false);

        builder.Property(e => e.IsRecurring)
            .HasColumnName("is_recurring")
            .HasDefaultValue(false);

        builder.Property(e => e.RecurrenceRule)
            .HasColumnName("recurrence_rule");

        builder.Property(e => e.Reason)
            .HasColumnName("reason")
            .HasMaxLength(200);

        builder.Property(e => e.Notes)
            .HasColumnName("notes");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany(e => e.Unavailabilities)
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
