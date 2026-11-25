using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Subscriptions.Entities;

namespace SanadPlatform.API.Features.Subscriptions.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("subscriptions");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.Tier)
            .HasColumnName("tier")
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("active");

        builder.Property(e => e.StartDate)
            .HasColumnName("start_date")
            .IsRequired();

        builder.Property(e => e.EndDate)
            .HasColumnName("end_date");

        builder.Property(e => e.TrialEndDate)
            .HasColumnName("trial_end_date");

        builder.Property(e => e.NextBillingDate)
            .HasColumnName("next_billing_date");

        builder.Property(e => e.CancelledAt)
            .HasColumnName("cancelled_at");

        builder.Property(e => e.MonthlyPrice)
            .HasColumnName("monthly_price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND");

        builder.Property(e => e.CommissionRate)
            .HasColumnName("commission_rate")
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(e => e.MarketingBudget)
            .HasColumnName("marketing_budget")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.PriorityListing)
            .HasColumnName("priority_listing")
            .HasDefaultValue(false);

        builder.Property(e => e.AdvancedAnalytics)
            .HasColumnName("advanced_analytics")
            .HasDefaultValue(false);

        builder.Property(e => e.ApiAccess)
            .HasColumnName("api_access")
            .HasDefaultValue(false);

        builder.Property(e => e.DedicatedSupport)
            .HasColumnName("dedicated_support")
            .HasDefaultValue(false);

        builder.Property(e => e.AutoRenew)
            .HasColumnName("auto_renew")
            .HasDefaultValue(true);

        builder.Property(e => e.GatewaySubscriptionId)
            .HasColumnName("gateway_subscription_id")
            .HasMaxLength(200);

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
