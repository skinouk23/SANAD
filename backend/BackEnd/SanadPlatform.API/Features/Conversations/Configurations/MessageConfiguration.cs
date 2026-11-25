using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Conversations.Entities;

namespace SanadPlatform.API.Features.Conversations.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ConversationId)
            .HasColumnName("conversation_id")
            .IsRequired();

        builder.Property(e => e.SenderId)
            .HasColumnName("sender_id")
            .IsRequired();

        builder.Property(e => e.MessageType)
            .HasColumnName("message_type")
            .HasMaxLength(20)
            .HasDefaultValue("text");

        builder.Property(e => e.Content)
            .HasColumnName("content")
            .IsRequired();

        builder.Property(e => e.AttachmentUrl)
            .HasColumnName("attachment_url");

        builder.Property(e => e.AttachmentName)
            .HasColumnName("attachment_name")
            .HasMaxLength(200);

        builder.Property(e => e.AttachmentSizeBytes)
            .HasColumnName("attachment_size_bytes");

        builder.Property(e => e.AttachmentMimeType)
            .HasColumnName("attachment_mime_type")
            .HasMaxLength(100);

        builder.Property(e => e.Latitude)
            .HasColumnName("latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.Longitude)
            .HasColumnName("longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.IsRead)
            .HasColumnName("is_read")
            .HasDefaultValue(false);

        builder.Property(e => e.ReadAt)
            .HasColumnName("read_at");

        builder.Property(e => e.Metadata)
            .HasColumnName("metadata")
            .HasColumnType("jsonb");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Conversation)
            .WithMany(e => e.Messages)
            .HasForeignKey(e => e.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Sender)
            .WithMany()
            .HasForeignKey(e => e.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.ConversationId)
            .HasDatabaseName("idx_messages_conversation");

        builder.HasIndex(e => e.SenderId)
            .HasDatabaseName("idx_messages_sender");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_messages_created")
            .IsDescending();

        builder.HasIndex(e => new { e.ConversationId, e.IsRead, e.SenderId })
            .HasDatabaseName("idx_messages_conv_read_sender");

        builder.HasIndex(e => new { e.ConversationId, e.CreatedAt })
            .HasDatabaseName("idx_messages_conv_created")
            .IsDescending(false, true);
    }
}
