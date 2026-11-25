using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Payments.Configurations;

/// <summary>
/// EF Core mapping for <see cref="PaymentAttempt"/>.
/// </summary>
public class PaymentAttemptConfiguration : IEntityTypeConfiguration<PaymentAttempt>
{
    public void Configure(EntityTypeBuilder<PaymentAttempt> builder)
    {
        builder.ToTable(
            "payment_attempts",
            table =>
            {
                table.HasCheckConstraint(
                    "ck_payment_attempts_method_type",
                    "method_type IN ('cash', 'manual_bank_transfer', 'manual_d17', 'external_placeholder', 'admin_adjustment')");
                table.HasCheckConstraint(
                    "ck_payment_attempts_status",
                    "status IN ('initiated', 'submitted', 'processing', 'succeeded', 'failed', 'expired', 'cancelled')");
                table.HasCheckConstraint(
                    "ck_payment_attempts_attempt_number_positive",
                    "attempt_number > 0");
                table.HasCheckConstraint(
                    "ck_payment_attempts_amount_non_negative",
                    "amount >= 0");
            });

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PaymentId)
            .HasColumnName("payment_id")
            .IsRequired();

        builder.Property(e => e.AttemptNumber)
            .HasColumnName("attempt_number")
            .IsRequired();

        builder.Property(e => e.MethodType)
            .HasColumnName("method_type")
            .HasMaxLength(40)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(30)
            .HasDefaultValue(PaymentConstants.AttemptStatuses.Initiated)
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

        builder.Property(e => e.ProviderCode)
            .HasColumnName("provider_code")
            .HasMaxLength(100);

        builder.Property(e => e.ExternalReference)
            .HasColumnName("external_reference")
            .HasMaxLength(200);

        builder.Property(e => e.ManualReference)
            .HasColumnName("manual_reference")
            .HasMaxLength(200);

        builder.Property(e => e.SafeMetadataJson)
            .HasColumnName("safe_metadata_json")
            .HasColumnType("jsonb");

        builder.Property(e => e.Gateway)
            .HasColumnName("gateway")
            .HasMaxLength(50);

        builder.Property(e => e.GatewayPaymentId)
            .HasColumnName("gateway_payment_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayChargeId)
            .HasColumnName("gateway_charge_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayTransferId)
            .HasColumnName("gateway_transfer_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayRefundId)
            .HasColumnName("gateway_refund_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayPayoutId)
            .HasColumnName("gateway_payout_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayResponse)
            .HasColumnName("gateway_response")
            .HasColumnType("jsonb");

        builder.Property(e => e.GatewayFraudResponse)
            .HasColumnName("gateway_fraud_response")
            .HasColumnType("jsonb");

        builder.Property(e => e.FraudScore)
            .HasColumnName("fraud_score")
            .HasPrecision(5, 2);

        builder.Property(e => e.FraudDecision)
            .HasColumnName("fraud_decision")
            .HasMaxLength(50);

        builder.Property(e => e.FraudFlags)
            .HasColumnName("fraud_flags")
            .HasColumnType("text[]");

        builder.Property(e => e.IsFlagged)
            .HasColumnName("is_flagged")
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(e => e.DeviceFingerprint)
            .HasColumnName("device_fingerprint")
            .HasMaxLength(255);

        builder.Property(e => e.CardLastFour)
            .HasColumnName("card_last_four")
            .HasMaxLength(4);

        builder.Property(e => e.CardBrand)
            .HasColumnName("card_brand")
            .HasMaxLength(20);

        builder.Property(e => e.CardCountry)
            .HasColumnName("card_country")
            .HasMaxLength(2)
            .IsFixedLength();

        builder.Property(e => e.AuthorizedAt)
            .HasColumnName("authorized_at");

        builder.Property(e => e.HeldAt)
            .HasColumnName("held_at");

        builder.Property(e => e.CapturedAt)
            .HasColumnName("captured_at");

        builder.Property(e => e.ReleasedAt)
            .HasColumnName("released_at");

        builder.Property(e => e.IdempotencyKey)
            .HasColumnName("idempotency_key")
            .HasMaxLength(200);

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

        builder.HasOne(e => e.Payment)
            .WithMany(e => e.PaymentAttempts)
            .HasForeignKey(e => e.PaymentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => new { e.PaymentId, e.AttemptNumber })
            .IsUnique()
            .HasDatabaseName("ux_payment_attempts_payment_id_attempt_number");

        builder.HasIndex(e => e.IdempotencyKey)
            .IsUnique()
            .HasFilter("idempotency_key IS NOT NULL")
            .HasDatabaseName("ux_payment_attempts_idempotency_key");

        builder.HasIndex(e => e.PaymentId)
            .HasDatabaseName("idx_payment_attempts_payment_id");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_payment_attempts_created_at")
            .IsDescending();
    }
}
