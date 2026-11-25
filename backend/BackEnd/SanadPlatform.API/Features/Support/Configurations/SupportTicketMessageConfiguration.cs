using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Support.Entities;

namespace SanadPlatform.API.Features.Support.Configurations;

public class SupportTicketMessageConfiguration : IEntityTypeConfiguration<SupportTicketMessage>
{
    public void Configure(EntityTypeBuilder<SupportTicketMessage> builder)
    {
        builder.ToTable("support_ticket_messages");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.TicketId)
            .HasColumnName("ticket_id")
            .IsRequired();

        builder.Property(e => e.SenderId)
            .HasColumnName("sender_id")
            .IsRequired();

        builder.Property(e => e.Message)
            .HasColumnName("message")
            .IsRequired();

        builder.Property(e => e.AttachmentUrls)
            .HasColumnName("attachment_urls")
            .HasColumnType("text[]");

        builder.Property(e => e.IsInternal)
            .HasColumnName("is_internal")
            .HasDefaultValue(false);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Ticket)
            .WithMany(e => e.Messages)
            .HasForeignKey(e => e.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Sender)
            .WithMany()
            .HasForeignKey(e => e.SenderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
