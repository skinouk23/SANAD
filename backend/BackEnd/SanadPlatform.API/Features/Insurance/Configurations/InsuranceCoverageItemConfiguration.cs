using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Insurance.Entities;

namespace SanadPlatform.API.Features.Insurance.Configurations;

public class InsuranceCoverageItemConfiguration : IEntityTypeConfiguration<InsuranceCoverageItem>
{
    public void Configure(EntityTypeBuilder<InsuranceCoverageItem> builder)
    {
        builder.ToTable("insurance_coverage_items");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.CoverageId)
            .HasColumnName("coverage_id")
            .IsRequired();

        builder.Property(e => e.Text)
            .HasColumnName("text")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.Limit)
            .HasColumnName("limit")
            .HasMaxLength(100)
            .IsRequired();

        // Relationships
        builder.HasOne(e => e.Coverage)
            .WithMany(c => c.Items)
            .HasForeignKey(e => e.CoverageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
