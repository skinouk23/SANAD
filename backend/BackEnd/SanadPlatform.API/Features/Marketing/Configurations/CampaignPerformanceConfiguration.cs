using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Marketing.Entities;

namespace SanadPlatform.API.Features.Marketing.Configurations;

public class CampaignPerformanceConfiguration : IEntityTypeConfiguration<CampaignPerformance>
{
    public void Configure(EntityTypeBuilder<CampaignPerformance> builder)
    {
        builder.ToTable("campaign_performance");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.CampaignId)
            .HasColumnName("campaign_id")
            .IsRequired();

        builder.Property(e => e.Date)
            .HasColumnName("date")
            .IsRequired();

        builder.Property(e => e.Impressions)
            .HasColumnName("impressions")
            .HasDefaultValue(0);

        builder.Property(e => e.Clicks)
            .HasColumnName("clicks")
            .HasDefaultValue(0);

        builder.Property(e => e.Conversions)
            .HasColumnName("conversions")
            .HasDefaultValue(0);

        builder.Property(e => e.SpentAmount)
            .HasColumnName("spent_amount")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Campaign)
            .WithMany(e => e.DailyPerformance)
            .HasForeignKey(e => e.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => new { e.CampaignId, e.Date })
            .IsUnique();
    }
}
