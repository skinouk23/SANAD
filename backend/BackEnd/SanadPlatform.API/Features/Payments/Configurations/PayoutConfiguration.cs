using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Payments.Configurations;

public class PayoutConfiguration : IEntityTypeConfiguration<Payout>
{
    public void Configure(EntityTypeBuilder<Payout> builder)
    {
        builder.ToTable("payouts");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PayoutNumber)
            .HasColumnName("payout_number")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
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

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("pending");

        builder.Property(e => e.PayoutMethod)
            .HasColumnName("payout_method")
            .HasMaxLength(50);

        builder.Property(e => e.BankAccountLastFour)
            .HasColumnName("bank_account_last_four")
            .HasMaxLength(4);

        builder.Property(e => e.Gateway)
            .HasColumnName("gateway")
            .HasMaxLength(50);

        builder.Property(e => e.GatewayPayoutId)
            .HasColumnName("gateway_payout_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayResponse)
            .HasColumnName("gateway_response")
            .HasColumnType("jsonb");

        builder.Property(e => e.ScheduledFor)
            .HasColumnName("scheduled_for");

        builder.Property(e => e.ProcessedAt)
            .HasColumnName("processed_at");

        builder.Property(e => e.CompletedAt)
            .HasColumnName("completed_at");

        builder.Property(e => e.FailureReason)
            .HasColumnName("failure_reason");

        builder.Property(e => e.Notes)
            .HasColumnName("notes");

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
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.PayoutNumber)
            .IsUnique();
    }
}
