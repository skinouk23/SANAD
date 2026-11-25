using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderCertificationConfiguration : IEntityTypeConfiguration<ProviderCertification>
{
    public void Configure(EntityTypeBuilder<ProviderCertification> builder)
    {
        builder.ToTable("provider_certifications");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.CertificationName)
            .HasColumnName("certification_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.IssuingOrganization)
            .HasColumnName("issuing_organization")
            .HasMaxLength(200);

        builder.Property(e => e.CertificationNumber)
            .HasColumnName("certification_number")
            .HasMaxLength(100);

        builder.Property(e => e.IssueDate)
            .HasColumnName("issue_date");

        builder.Property(e => e.ExpiryDate)
            .HasColumnName("expiry_date");

        builder.Property(e => e.FileId)
            .HasColumnName("file_id");

        builder.Property(e => e.IsVerified)
            .HasColumnName("is_verified")
            .HasDefaultValue(false);

        builder.Property(e => e.VerifiedAt)
            .HasColumnName("verified_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany(e => e.ProviderCertifications)
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.File)
            .WithMany()
            .HasForeignKey(e => e.FileId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
