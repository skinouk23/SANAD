using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Payments.Configurations;

public class PayoutItemConfiguration : IEntityTypeConfiguration<PayoutItem>
{
    public void Configure(EntityTypeBuilder<PayoutItem> builder)
    {
        builder.ToTable("payout_items");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PayoutId)
            .HasColumnName("payout_id")
            .IsRequired();

        builder.Property(e => e.PaymentId)
            .HasColumnName("payment_id")
            .IsRequired();

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Payout)
            .WithMany(e => e.Items)
            .HasForeignKey(e => e.PayoutId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Payment>()
            .WithMany(e => e.PayoutItems)
            .HasForeignKey(e => e.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
