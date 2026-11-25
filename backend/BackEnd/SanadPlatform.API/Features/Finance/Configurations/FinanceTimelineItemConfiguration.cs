using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Finance.Entities;

namespace SanadPlatform.API.Features.Finance.Configurations;

/// <summary>
/// EF Core mapping for the read-only finance timeline view.
/// </summary>
public class FinanceTimelineItemConfiguration : IEntityTypeConfiguration<FinanceTimelineItem>
{
    public void Configure(EntityTypeBuilder<FinanceTimelineItem> builder)
    {
        builder.HasNoKey();
        builder.ToView("vw_finance_timeline_items");

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.Type)
            .HasColumnName("type");

        builder.Property(e => e.Direction)
            .HasColumnName("direction");

        builder.Property(e => e.Status)
            .HasColumnName("status");

        builder.Property(e => e.Amount)
            .HasColumnName("amount");

        builder.Property(e => e.Currency)
            .HasColumnName("currency");

        builder.Property(e => e.Title)
            .HasColumnName("title");

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.OccurredAt)
            .HasColumnName("occurred_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(e => e.SourceType)
            .HasColumnName("source_type");

        builder.Property(e => e.SourceId)
            .HasColumnName("source_id");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id");

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.PaymentId)
            .HasColumnName("payment_id");

        builder.Property(e => e.PaymentAttemptId)
            .HasColumnName("payment_attempt_id");

        builder.Property(e => e.ProviderWalletTopUpId)
            .HasColumnName("provider_wallet_top_up_id");

        builder.Property(e => e.LedgerTransactionId)
            .HasColumnName("ledger_transaction_id");

        builder.Property(e => e.ReferenceNumber)
            .HasColumnName("reference_number");
    }
}
