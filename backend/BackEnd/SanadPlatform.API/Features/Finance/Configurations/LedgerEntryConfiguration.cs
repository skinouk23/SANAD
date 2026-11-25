using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Finance.Entities;

namespace SanadPlatform.API.Features.Finance.Configurations;

/// <summary>
/// EF Core mapping for <see cref="LedgerEntry"/>.
/// </summary>
public class LedgerEntryConfiguration : IEntityTypeConfiguration<LedgerEntry>
{
    public void Configure(EntityTypeBuilder<LedgerEntry> builder)
    {
        builder.ToTable(
            "ledger_entries",
            table =>
            {
                table.HasCheckConstraint(
                    "ck_ledger_entries_amount_positive",
                    "amount > 0");
                table.HasCheckConstraint(
                    "ck_ledger_entries_signed_amount_non_zero",
                    "signed_amount <> 0");
                table.HasCheckConstraint(
                    "ck_ledger_entries_amount_matches_signed_amount",
                    "amount = ABS(signed_amount)");
            });

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.LedgerTransactionId)
            .HasColumnName("ledger_transaction_id")
            .IsRequired();

        builder.Property(e => e.AccountCode)
            .HasColumnName("account_code")
            .HasMaxLength(80)
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.PaymentId)
            .HasColumnName("payment_id");

        builder.Property(e => e.ProviderWalletTopUpId)
            .HasColumnName("provider_wallet_top_up_id");

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(e => e.SignedAmount)
            .HasColumnName("signed_amount")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND")
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.LedgerTransaction)
            .WithMany(e => e.Entries)
            .HasForeignKey(e => e.LedgerTransactionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Account)
            .WithMany(e => e.LedgerEntries)
            .HasForeignKey(e => e.AccountCode)
            .HasPrincipalKey(e => e.Code)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Payment)
            .WithMany()
            .HasForeignKey(e => e.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ProviderWalletTopUp)
            .WithMany()
            .HasForeignKey(e => e.ProviderWalletTopUpId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.LedgerTransactionId)
            .HasDatabaseName("idx_ledger_entries_ledger_transaction_id");

        builder.HasIndex(e => e.AccountCode)
            .HasDatabaseName("idx_ledger_entries_account_code");

        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_ledger_entries_provider_id");

        builder.HasIndex(e => e.BookingId)
            .HasDatabaseName("idx_ledger_entries_booking_id");

        builder.HasIndex(e => e.PaymentId)
            .HasDatabaseName("idx_ledger_entries_payment_id");

        builder.HasIndex(e => e.ProviderWalletTopUpId)
            .HasDatabaseName("idx_ledger_entries_provider_wallet_top_up_id");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_ledger_entries_created_at")
            .IsDescending();
    }
}
