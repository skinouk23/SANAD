using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderScheduleConfiguration : IEntityTypeConfiguration<ProviderSchedule>
{
    public void Configure(EntityTypeBuilder<ProviderSchedule> builder)
    {
        builder.ToTable("provider_schedules");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.DayOfWeek)
            .HasColumnName("day_of_week")
            .IsRequired();

        builder.Property(e => e.StartTime)
            .HasColumnName("start_time")
            .IsRequired();

        builder.Property(e => e.EndTime)
            .HasColumnName("end_time")
            .IsRequired();

        builder.Property(e => e.IsAvailable)
            .HasColumnName("is_available")
            .HasDefaultValue(true);

        builder.Property(e => e.ServiceId)
            .HasColumnName("service_id");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany(e => e.Schedules)
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Service)
            .WithMany()
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);

        // Composite unique index
        builder.HasIndex(e => new { e.ProviderId, e.DayOfWeek, e.StartTime, e.ServiceId })
            .IsUnique();
    }
}
