using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Conversations.Entities;

namespace SanadPlatform.API.Features.Conversations.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Conversation"/> entity.
/// </summary>
public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    /// <summary>
    /// Configures the conversations table, relationships, and indexes.
    /// </summary>
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("conversations");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.LastMessageAt)
            .HasColumnName("last_message_at");

        builder.Property(e => e.LastMessagePreview)
            .HasColumnName("last_message_preview")
            .HasMaxLength(200);

        builder.Property(e => e.LastMessageBy)
            .HasColumnName("last_message_by");

        builder.Property(e => e.PatientUnreadCount)
            .HasColumnName("patient_unread_count")
            .HasDefaultValue(0);

        builder.Property(e => e.ProviderUnreadCount)
            .HasColumnName("provider_unread_count")
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        // One conversation per patient-provider pair (enforces the "single thread" rule)
        builder.HasIndex(e => new { e.PatientId, e.ProviderId })
            .IsUnique()
            .HasDatabaseName("ix_conversations_patient_provider");

        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_conversations_provider");
    }
}
