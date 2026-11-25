using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderDocumentConfiguration : IEntityTypeConfiguration<ProviderDocument>
{
    public void Configure(EntityTypeBuilder<ProviderDocument> builder)
    {
        builder.ToTable("provider_documents");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.DocumentType)
            .HasColumnName("document_type")
            .IsRequired();

        builder.Property(e => e.DocumentName)
            .HasColumnName("document_name")
            .HasMaxLength(200);

        builder.Property(e => e.FileId)
            .HasColumnName("file_id")
            .IsRequired();

        builder.Property(e => e.FileSizeBytes)
            .HasColumnName("file_size_bytes");

        builder.Property(e => e.MimeType)
            .HasColumnName("mime_type")
            .HasMaxLength(100);

        builder.Property(e => e.ExtractedData)
            .HasColumnName("extracted_data")
            .HasColumnType("jsonb");

        builder.Property(e => e.IsVerified)
            .HasColumnName("is_verified")
            .HasDefaultValue(false);

        builder.Property(e => e.VerifiedAt)
            .HasColumnName("verified_at");

        builder.Property(e => e.VerifiedBy)
            .HasColumnName("verified_by");

        builder.Property(e => e.VerificationNotes)
            .HasColumnName("verification_notes");

        builder.Property(e => e.IssueDate)
            .HasColumnName("issue_date");

        builder.Property(e => e.ExpiryDate)
            .HasColumnName("expiry_date");

        builder.Property(e => e.IsExpired)
            .HasColumnName("is_expired")
            .HasDefaultValue(false);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany(e => e.Documents)
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.File)
            .WithMany()
            .HasForeignKey(e => e.FileId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.FileId)
            .IsUnique()
            .HasDatabaseName("ix_provider_documents_file_id");
    }
}
