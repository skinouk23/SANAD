using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Rewards.Entities;

namespace SanadPlatform.API.Features.Rewards.Configurations;

public class RewardTransactionConfiguration : IEntityTypeConfiguration<RewardTransaction>
{
    public void Configure(EntityTypeBuilder<RewardTransaction> builder)
    {
        builder.ToTable("reward_transactions");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.TransactionType)
            .HasColumnName("transaction_type")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.Points)
            .HasColumnName("points")
            .IsRequired();

        builder.Property(e => e.BalanceAfter)
            .HasColumnName("balance_after")
            .IsRequired();

        builder.Property(e => e.Reason)
            .HasColumnName("reason")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.BadgeId)
            .HasColumnName("badge_id");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(e => e.RewardTransactions)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Booking>()
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Badge>()
            .WithMany()
            .HasForeignKey(e => e.BadgeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
