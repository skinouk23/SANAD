using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Support.Entities;

namespace SanadPlatform.API.Features.Support.Configurations;

public class SupportTicketConfiguration : IEntityTypeConfiguration<SupportTicket>
{
    public void Configure(EntityTypeBuilder<SupportTicket> builder)
    {
        builder.ToTable("support_tickets");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.TicketNumber)
            .HasColumnName("ticket_number")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(e => e.Category)
            .HasColumnName("category")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Subject)
            .HasColumnName("subject")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .IsRequired();

        builder.Property(e => e.Priority)
            .HasColumnName("priority")
            .HasMaxLength(20)
            .HasDefaultValue("normal");

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("open");

        builder.Property(e => e.AssignedTo)
            .HasColumnName("assigned_to");

        builder.Property(e => e.AssignedAt)
            .HasColumnName("assigned_at");

        builder.Property(e => e.Resolution)
            .HasColumnName("resolution");

        builder.Property(e => e.ResolvedAt)
            .HasColumnName("resolved_at");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.SatisfactionRating)
            .HasColumnName("satisfaction_rating");

        builder.Property(e => e.SatisfactionFeedback)
            .HasColumnName("satisfaction_feedback");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.TicketNumber)
            .IsUnique();
    }
}
