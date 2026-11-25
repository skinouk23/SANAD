using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Files.Configurations;

/// <summary>
/// EF Core configuration for <see cref="StoredFile"/>.
/// </summary>
public class StoredFileConfiguration : IEntityTypeConfiguration<StoredFile>
{
    public void Configure(EntityTypeBuilder<StoredFile> builder)
    {
        builder.ToTable("stored_files");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.UseCase)
            .HasColumnName("use_case")
            .HasConversion<string>()
            .HasMaxLength(80)
            .IsRequired();

        builder.Property(e => e.Category)
            .HasColumnName("category")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Visibility)
            .HasColumnName("visibility")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.ScanStatus)
            .HasColumnName("scan_status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.ScanVerdict)
            .HasColumnName("scan_verdict")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.ScanEngine)
            .HasColumnName("scan_engine")
            .HasMaxLength(100);

        builder.Property(e => e.ScanEngineVersion)
            .HasColumnName("scan_engine_version")
            .HasMaxLength(100);

        builder.Property(e => e.Bucket)
            .HasColumnName("bucket")
            .HasMaxLength(63)
            .IsRequired();

        builder.Property(e => e.ObjectKey)
            .HasColumnName("object_key")
            .HasMaxLength(1024)
            .IsRequired();

        builder.Property(e => e.ObjectVersionId)
            .HasColumnName("object_version_id")
            .HasMaxLength(200);

        builder.Property(e => e.StagingBucket)
            .HasColumnName("staging_bucket")
            .HasMaxLength(63)
            .IsRequired();

        builder.Property(e => e.StagingObjectKey)
            .HasColumnName("staging_object_key")
            .HasMaxLength(1024)
            .IsRequired();

        builder.Property(e => e.QuarantineBucket)
            .HasColumnName("quarantine_bucket")
            .HasMaxLength(63);

        builder.Property(e => e.QuarantineObjectKey)
            .HasColumnName("quarantine_object_key")
            .HasMaxLength(1024);

        builder.Property(e => e.OriginalFileName)
            .HasColumnName("original_file_name")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(e => e.DeclaredContentType)
            .HasColumnName("declared_content_type")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.DetectedContentType)
            .HasColumnName("detected_content_type")
            .HasMaxLength(100);

        builder.Property(e => e.SizeBytes)
            .HasColumnName("size_bytes")
            .IsRequired();

        builder.Property(e => e.Sha256)
            .HasColumnName("sha256")
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(e => e.ETag)
            .HasColumnName("etag")
            .HasMaxLength(200);

        builder.Property(e => e.OwnerUserId)
            .HasColumnName("owner_user_id");

        builder.Property(e => e.OwnerRole)
            .HasColumnName("owner_role")
            .HasMaxLength(50);

        builder.Property(e => e.RelatedPatientId)
            .HasColumnName("related_patient_id");

        builder.Property(e => e.RelatedProviderId)
            .HasColumnName("related_provider_id");

        builder.Property(e => e.RelatedServiceId)
            .HasColumnName("related_service_id");

        builder.Property(e => e.RelatedBookingId)
            .HasColumnName("related_booking_id");

        builder.Property(e => e.RelatedApplicationId)
            .HasColumnName("related_application_id");

        builder.Property(e => e.RetentionPolicy)
            .HasColumnName("retention_policy")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.RetentionExpiresAt)
            .HasColumnName("retention_expires_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.ReadyAt)
            .HasColumnName("ready_at");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        builder.Property(e => e.RejectionReason)
            .HasColumnName("rejection_reason")
            .HasMaxLength(1000);

        builder.HasMany(e => e.AccessAudits)
            .WithOne(e => e.File)
            .HasForeignKey(e => e.FileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => new { e.OwnerUserId, e.Status, e.CreatedAt })
            .HasDatabaseName("ix_stored_files_owner_status_created");

        builder.HasIndex(e => new { e.Bucket, e.ObjectKey })
            .HasDatabaseName("ix_stored_files_bucket_object_key");

        builder.HasIndex(e => new { e.StagingBucket, e.StagingObjectKey })
            .IsUnique()
            .HasDatabaseName("ix_stored_files_staging_bucket_object_key");

        builder.HasIndex(e => new { e.UseCase, e.RelatedApplicationId })
            .HasDatabaseName("ix_stored_files_use_case_related_application_id");
    }
}
