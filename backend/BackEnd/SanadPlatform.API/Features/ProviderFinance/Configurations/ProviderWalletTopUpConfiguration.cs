using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.Configurations;

/// <summary>
/// EF Core mapping for <see cref="ProviderWalletTopUp"/>.
/// </summary>
public class ProviderWalletTopUpConfiguration : IEntityTypeConfiguration<ProviderWalletTopUp>
{
    public void Configure(EntityTypeBuilder<ProviderWalletTopUp> builder)
    {
        builder.ToTable(
            "provider_wallet_top_ups",
            table =>
            {
                table.HasCheckConstraint(
                    "ck_provider_wallet_top_ups_method_type",
                    "method_type IN ('manual_bank_transfer', 'manual_d17')");
                table.HasCheckConstraint(
                    "ck_provider_wallet_top_ups_status",
                    "status IN ('credited', 'failed', 'expired', 'cancelled')");
                table.HasCheckConstraint(
                    "ck_provider_wallet_top_ups_initiated_amount_positive",
                    "initiated_amount > 0");
                table.HasCheckConstraint(
                    "ck_provider_wallet_top_ups_credited_amount_positive",
                    "credited_amount IS NULL OR credited_amount > 0");
            });

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ReferenceNumber)
            .HasColumnName("reference_number")
            .HasMaxLength(40)
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.InitiatedAmount)
            .HasColumnName("initiated_amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.CreditedAmount)
            .HasColumnName("credited_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue(ProviderFinanceConstants.DefaultCurrency)
            .IsRequired();

        builder.Property(e => e.MethodType)
            .HasColumnName("method_type")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(e => e.ProviderSubmittedReference)
            .HasColumnName("provider_submitted_reference")
            .HasMaxLength(120);

        builder.Property(e => e.EvidenceUrl)
            .HasColumnName("evidence_url")
            .HasMaxLength(500);

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(30)
            .HasDefaultValue(ProviderFinanceConstants.TopUpStatuses.Credited)
            .IsRequired();

        builder.Property(e => e.InitiatedAt)
            .HasColumnName("initiated_at")
            .IsRequired();

        builder.Property(e => e.SubmittedAt)
            .HasColumnName("submitted_at");

        builder.Property(e => e.CreditedAt)
            .HasColumnName("credited_at");

        builder.Property(e => e.FailedAt)
            .HasColumnName("failed_at");

        builder.Property(e => e.CancelledAt)
            .HasColumnName("cancelled_at");

        builder.Property(e => e.ExpiresAt)
            .HasColumnName("expires_at")
            .IsRequired();

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

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.ReferenceNumber)
            .IsUnique()
            .HasDatabaseName("ux_provider_wallet_top_ups_reference_number");

        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_provider_wallet_top_ups_provider");

        builder.HasIndex(e => e.Status)
            .HasDatabaseName("idx_provider_wallet_top_ups_status");

        builder.HasIndex(e => e.InitiatedAt)
            .HasDatabaseName("idx_provider_wallet_top_ups_initiated_at")
            .IsDescending();

    }
}
