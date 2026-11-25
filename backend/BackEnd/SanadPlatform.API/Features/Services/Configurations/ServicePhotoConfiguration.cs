using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Configurations;

/// <summary>
/// EF Core configuration for <see cref="ServicePhoto"/>.
/// </summary>
public class ServicePhotoConfiguration : IEntityTypeConfiguration<ServicePhoto>
{
    public void Configure(EntityTypeBuilder<ServicePhoto> builder)
    {
        builder.ToTable("service_photos");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ServiceId)
            .HasColumnName("service_id")
            .IsRequired();

        builder.Property(e => e.FileId)
            .HasColumnName("file_id")
            .IsRequired();

        builder.Property(e => e.SortOrder)
            .HasColumnName("sort_order")
            .HasDefaultValue(0);

        builder.Property(e => e.IsMain)
            .HasColumnName("is_main")
            .HasDefaultValue(false);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(e => new { e.ServiceId, e.FileId })
            .IsUnique()
            .HasDatabaseName("ix_service_photos_service_file");

        builder.HasIndex(e => new { e.ServiceId, e.IsMain })
            .HasDatabaseName("ix_service_photos_service_main");

        builder.HasOne(e => e.Service)
            .WithMany(e => e.Photos)
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.File)
            .WithMany()
            .HasForeignKey(e => e.FileId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
