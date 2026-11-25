using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Finance.Entities;

namespace SanadPlatform.API.Features.Finance.Configurations;

/// <summary>
/// EF Core mapping for <see cref="LedgerTransaction"/>.
/// </summary>
public class LedgerTransactionConfiguration : IEntityTypeConfiguration<LedgerTransaction>
{
    public void Configure(EntityTypeBuilder<LedgerTransaction> builder)
    {
        builder.ToTable(
            "ledger_transactions",
            table =>
            {
                table.HasCheckConstraint(
                    "ck_ledger_transactions_type",
                    "type IN ('cash_booking_fee_reserved', 'cash_booking_fee_released', 'cash_booking_fee_settled', 'wallet_top_up_credited', 'wallet_adjustment', 'compensating_adjustment')");
                table.HasCheckConstraint(
                    "ck_ledger_transactions_status",
                    "status IN ('posted', 'voided')");
            });

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ReferenceNumber)
            .HasColumnName("reference_number")
            .HasMaxLength(60)
            .IsRequired();

        builder.Property(e => e.Type)
            .HasColumnName("type")
            .HasMaxLength(60)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue(LedgerConstants.TransactionStatuses.Posted)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(e => e.SourceType)
            .HasColumnName("source_type")
            .HasMaxLength(40)
            .IsRequired();

        builder.Property(e => e.SourceId)
            .HasColumnName("source_id")
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND")
            .IsRequired();

        builder.Property(e => e.OccurredAt)
            .HasColumnName("occurred_at")
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.CreatedByUserId)
            .HasColumnName("created_by_user_id");

        builder.Property(e => e.IdempotencyKey)
            .HasColumnName("idempotency_key")
            .HasMaxLength(200);

        builder.HasIndex(e => e.ReferenceNumber)
            .IsUnique()
            .HasDatabaseName("ux_ledger_transactions_reference_number");

        builder.HasIndex(e => e.IdempotencyKey)
            .IsUnique()
            .HasFilter("idempotency_key IS NOT NULL")
            .HasDatabaseName("ux_ledger_transactions_idempotency_key");

        builder.HasIndex(e => new { e.SourceType, e.SourceId })
            .HasDatabaseName("idx_ledger_transactions_source");

        builder.HasIndex(e => e.OccurredAt)
            .HasDatabaseName("idx_ledger_transactions_occurred_at")
            .IsDescending();
    }
}
