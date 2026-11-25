using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Payments.Configurations;

/// <summary>
/// EF Core mapping for <see cref="Payment"/>.
/// </summary>
public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable(
            "payments",
            table =>
            {
                table.HasCheckConstraint(
                    "ck_payments_purpose",
                    "purpose IN ('booking_payment', 'wallet_top_up')");
                table.HasCheckConstraint(
                    "ck_payments_method_type",
                    "method_type IN ('cash', 'manual_bank_transfer', 'manual_d17', 'external_placeholder', 'admin_adjustment')");
                table.HasCheckConstraint(
                    "ck_payments_status",
                    "status IN ('pending', 'processing', 'reserved', 'settled', 'failed', 'expired', 'cancelled')");
                table.HasCheckConstraint(
                    "ck_payments_single_source",
                    "((CASE WHEN booking_id IS NULL THEN 0 ELSE 1 END) + (CASE WHEN provider_wallet_top_up_id IS NULL THEN 0 ELSE 1 END)) = 1");
                table.HasCheckConstraint(
                    "ck_payments_amount_non_negative",
                    "amount >= 0");
            });

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ReferenceNumber)
            .HasColumnName("reference_number")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Purpose)
            .HasColumnName("purpose")
            .HasMaxLength(40)
            .IsRequired();

        builder.Property(e => e.MethodType)
            .HasColumnName("method_type")
            .HasMaxLength(40)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(30)
            .HasDefaultValue(PaymentConstants.Statuses.Pending)
            .IsRequired();

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND")
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.ProviderWalletTopUpId)
            .HasColumnName("provider_wallet_top_up_id");

        builder.Property(e => e.SettledAt)
            .HasColumnName("settled_at");

        builder.Property(e => e.FailedAt)
            .HasColumnName("failed_at");

        builder.Property(e => e.CancelledAt)
            .HasColumnName("cancelled_at");

        builder.Property(e => e.ExpiredAt)
            .HasColumnName("expired_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        builder.HasOne(e => e.Booking)
            .WithOne(e => e.Payment)
            .HasForeignKey<Payment>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ProviderWalletTopUp)
            .WithOne(e => e.Payment)
            .HasForeignKey<Payment>(e => e.ProviderWalletTopUpId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.ReferenceNumber)
            .IsUnique()
            .HasDatabaseName("ux_payments_reference_number");

        builder.HasIndex(e => e.BookingId)
            .IsUnique()
            .HasFilter("booking_id IS NOT NULL")
            .HasDatabaseName("ux_payments_booking_id");

        builder.HasIndex(e => e.ProviderWalletTopUpId)
            .IsUnique()
            .HasFilter("provider_wallet_top_up_id IS NOT NULL")
            .HasDatabaseName("ux_payments_provider_wallet_top_up_id");

        builder.HasIndex(e => e.Status)
            .HasDatabaseName("idx_payments_status");

        builder.HasIndex(e => e.Purpose)
            .HasDatabaseName("idx_payments_purpose");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_payments_created_at")
            .IsDescending();
    }
}
