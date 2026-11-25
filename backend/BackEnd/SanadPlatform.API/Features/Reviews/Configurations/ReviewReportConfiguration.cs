using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Reviews.Entities;

namespace SanadPlatform.API.Features.Reviews.Configurations;

public class ReviewReportConfiguration : IEntityTypeConfiguration<ReviewReport>
{
    public void Configure(EntityTypeBuilder<ReviewReport> builder)
    {
        builder.ToTable("review_reports");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ReviewId)
            .HasColumnName("review_id")
            .IsRequired();

        builder.Property(e => e.ReportedBy)
            .HasColumnName("reported_by")
            .IsRequired();

        builder.Property(e => e.Reason)
            .HasColumnName("reason")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("pending");

        builder.Property(e => e.ResolvedAt)
            .HasColumnName("resolved_at");

        builder.Property(e => e.ResolvedBy)
            .HasColumnName("resolved_by");

        builder.Property(e => e.ResolutionNotes)
            .HasColumnName("resolution_notes");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Review)
            .WithMany(r => r.Reports)
            .HasForeignKey(e => e.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
