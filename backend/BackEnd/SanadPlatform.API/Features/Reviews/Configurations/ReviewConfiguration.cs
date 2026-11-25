using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Reviews.Entities;

namespace SanadPlatform.API.Features.Reviews.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("reviews");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.BookingSessionId)
            .HasColumnName("booking_session_id")
            .IsRequired();

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.ServiceId)
            .HasColumnName("service_id")
            .IsRequired();

        builder.Property(e => e.Rating)
            .HasColumnName("rating")
            .IsRequired();

        builder.Property(e => e.RatingProfessionalism)
            .HasColumnName("rating_professionalism");

        builder.Property(e => e.RatingPunctuality)
            .HasColumnName("rating_punctuality");

        builder.Property(e => e.RatingQuality)
            .HasColumnName("rating_quality");

        builder.Property(e => e.RatingCommunication)
            .HasColumnName("rating_communication");

        builder.Property(e => e.Title)
            .HasColumnName("title")
            .HasMaxLength(200);

        builder.Property(e => e.Comment)
            .HasColumnName("comment");

        builder.Property(e => e.PhotoUrls)
            .HasColumnName("photo_urls")
            .HasColumnType("text[]");

        builder.Property(e => e.IsVerified)
            .HasColumnName("is_verified")
            .HasDefaultValue(true);

        builder.Property(e => e.IsVisible)
            .HasColumnName("is_visible")
            .HasDefaultValue(true);

        builder.Property(e => e.IsFlagged)
            .HasColumnName("is_flagged")
            .HasDefaultValue(false);

        builder.Property(e => e.FlaggedReason)
            .HasColumnName("flagged_reason");

        builder.Property(e => e.ModeratedAt)
            .HasColumnName("moderated_at");

        builder.Property(e => e.ModeratedBy)
            .HasColumnName("moderated_by");

        builder.Property(e => e.ProviderResponse)
            .HasColumnName("provider_response");

        builder.Property(e => e.ProviderRespondedAt)
            .HasColumnName("provider_responded_at");

        builder.Property(e => e.FraudScore)
            .HasColumnName("fraud_score")
            .HasPrecision(5, 2);

        builder.Property(e => e.IsSuspicious)
            .HasColumnName("is_suspicious")
            .HasDefaultValue(false);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.BookingSession)
            .WithOne(e => e.Review)
            .HasForeignKey<Review>(e => e.BookingSessionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.BookingId)
            .HasDatabaseName("idx_reviews_booking");

        builder.HasIndex(e => e.BookingSessionId)
            .IsUnique()
            .HasDatabaseName("ux_reviews_booking_session_id");

        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_reviews_provider");

        builder.HasIndex(e => e.PatientId)
            .HasDatabaseName("idx_reviews_patient");

        builder.HasIndex(e => e.Rating)
            .HasDatabaseName("idx_reviews_rating");

        builder.HasIndex(e => e.IsVisible)
            .HasDatabaseName("idx_reviews_visible")
            .HasFilter("is_visible = TRUE");
    }
}
