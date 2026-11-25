using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Subscriptions.Entities;

namespace SanadPlatform.API.Features.Subscriptions.Configurations;

public class SubscriptionPaymentConfiguration : IEntityTypeConfiguration<SubscriptionPayment>
{
    public void Configure(EntityTypeBuilder<SubscriptionPayment> builder)
    {
        builder.ToTable("subscription_payments");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.SubscriptionId)
            .HasColumnName("subscription_id")
            .IsRequired();

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND");

        builder.Property(e => e.BillingPeriodStart)
            .HasColumnName("billing_period_start")
            .IsRequired();

        builder.Property(e => e.BillingPeriodEnd)
            .HasColumnName("billing_period_end")
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("pending");

        builder.Property(e => e.GatewayPaymentId)
            .HasColumnName("gateway_payment_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayResponse)
            .HasColumnName("gateway_response")
            .HasColumnType("jsonb");

        builder.Property(e => e.PaidAt)
            .HasColumnName("paid_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Subscription)
            .WithMany(e => e.Payments)
            .HasForeignKey(e => e.SubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
