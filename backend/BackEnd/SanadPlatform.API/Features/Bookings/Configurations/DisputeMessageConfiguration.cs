using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class DisputeMessageConfiguration : IEntityTypeConfiguration<DisputeMessage>
{
    public void Configure(EntityTypeBuilder<DisputeMessage> builder)
    {
        builder.ToTable("dispute_messages");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.DisputeId)
            .HasColumnName("dispute_id")
            .IsRequired();

        builder.Property(e => e.SenderId)
            .HasColumnName("sender_id")
            .IsRequired();

        builder.Property(e => e.Message)
            .HasColumnName("message")
            .HasMaxLength(5000)
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
        builder.HasOne(e => e.Dispute)
            .WithMany(e => e.Messages)
            .HasForeignKey(e => e.DisputeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.SenderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
