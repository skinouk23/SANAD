using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Marketing.Entities;

namespace SanadPlatform.API.Features.Marketing.Configurations;

public class MarketingCampaignConfiguration : IEntityTypeConfiguration<MarketingCampaign>
{
    public void Configure(EntityTypeBuilder<MarketingCampaign> builder)
    {
        builder.ToTable("marketing_campaigns");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.CampaignType)
            .HasColumnName("campaign_type")
            .HasMaxLength(50);

        builder.Property(e => e.Objective)
            .HasColumnName("objective")
            .HasMaxLength(50);

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("draft");

        builder.Property(e => e.StartDate)
            .HasColumnName("start_date");

        builder.Property(e => e.EndDate)
            .HasColumnName("end_date");

        builder.Property(e => e.Budget)
            .HasColumnName("budget")
            .HasPrecision(10, 2);

        builder.Property(e => e.SpentAmount)
            .HasColumnName("spent_amount")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.TargetAgeMin)
            .HasColumnName("target_age_min");

        builder.Property(e => e.TargetAgeMax)
            .HasColumnName("target_age_max");

        builder.Property(e => e.TargetGender)
            .HasColumnName("target_gender")
            .HasMaxLength(20);

        builder.Property(e => e.TargetLocations)
            .HasColumnName("target_locations")
            .HasColumnType("text[]");

        builder.Property(e => e.TargetInterests)
            .HasColumnName("target_interests")
            .HasColumnType("text[]");

        builder.Property(e => e.Headline)
            .HasColumnName("headline")
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.CtaText)
            .HasColumnName("cta_text")
            .HasMaxLength(100);

        builder.Property(e => e.ImageUrl)
            .HasColumnName("image_url");

        builder.Property(e => e.LandingUrl)
            .HasColumnName("landing_url");

        builder.Property(e => e.Impressions)
            .HasColumnName("impressions")
            .HasDefaultValue(0);

        builder.Property(e => e.Clicks)
            .HasColumnName("clicks")
            .HasDefaultValue(0);

        builder.Property(e => e.Conversions)
            .HasColumnName("conversions")
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
