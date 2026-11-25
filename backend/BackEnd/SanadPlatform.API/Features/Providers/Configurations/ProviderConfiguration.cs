using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderConfiguration : IEntityTypeConfiguration<Provider>
{
    public void Configure(EntityTypeBuilder<Provider> builder)
    {
        builder.ToTable(
            "providers",
            table =>
            {
                table.HasCheckConstraint(
                    "ck_providers_verification_status",
                    "verification_status IN ('not_requested', 'requested', 'ai_prechecked', 'approved', 'rejected')");
                table.HasCheckConstraint(
                    "ck_providers_verified_requires_approved_status",
                    "is_verified = FALSE OR verification_status = 'approved'");
            });

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(e => e.ServiceCategory)
            .HasColumnName("service_category")
            .IsRequired();

        builder.Property(e => e.NutritionProviderSubtype)
            .HasColumnName("nutrition_provider_subtype")
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.IsIndividual)
            .HasColumnName("is_individual")
            .HasDefaultValue(true);

        builder.Property(e => e.BusinessName)
            .HasColumnName("business_name")
            .HasMaxLength(200);

        builder.Property(e => e.LegalName)
            .HasColumnName("legal_name")
            .HasMaxLength(200);

        builder.Property(e => e.TaxId)
            .HasColumnName("tax_id")
            .HasMaxLength(50);

        builder.Property(e => e.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100);

        builder.Property(e => e.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100);

        builder.Property(e => e.LicenseNumber)
            .HasColumnName("license_number")
            .HasMaxLength(100);

        builder.Property(e => e.LicenseIssuingAuthority)
            .HasColumnName("license_issuing_authority")
            .HasMaxLength(200);

        builder.Property(e => e.LicenseExpiryDate)
            .HasColumnName("license_expiry_date");

        builder.Property(e => e.Specializations)
            .HasColumnName("specializations")
            .HasColumnType("text[]");

        builder.Property(e => e.YearsOfExperience)
            .HasColumnName("years_of_experience");

        builder.Property(e => e.Education)
            .HasColumnName("education");

        builder.Property(e => e.Certifications)
            .HasColumnName("certifications")
            .HasColumnType("text[]");

        builder.Property(e => e.LanguagesSpoken)
            .HasColumnName("languages_spoken")
            .HasColumnType("text[]")
            .HasDefaultValueSql("ARRAY['fr']");

        builder.Property(e => e.Bio)
            .HasColumnName("bio");

        builder.Property(e => e.ShortDescription)
            .HasColumnName("short_description")
            .HasMaxLength(500);

        builder.Property(e => e.AddressLine1)
            .HasColumnName("address_line1");

        builder.Property(e => e.AddressLine2)
            .HasColumnName("address_line2");

        builder.Property(e => e.City)
            .HasColumnName("city")
            .HasMaxLength(100);

        builder.Property(e => e.StateProvince)
            .HasColumnName("state_province")
            .HasMaxLength(100);

        builder.Property(e => e.PostalCode)
            .HasColumnName("postal_code")
            .HasMaxLength(20);

        builder.Property(e => e.CountryCode)
            .HasColumnName("country_code")
            .HasMaxLength(2)
            .IsFixedLength()
            .HasDefaultValue("TN");

        builder.Property(e => e.Latitude)
            .HasColumnName("latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.Longitude)
            .HasColumnName("longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.ServiceRadiusKm)
            .HasColumnName("service_radius_km")
            .HasDefaultValue(20);

        builder.Property(e => e.ServesAtHome)
            .HasColumnName("serves_at_home")
            .HasDefaultValue(true);

        builder.Property(e => e.ServesAtClinic)
            .HasColumnName("serves_at_clinic")
            .HasDefaultValue(false);

        builder.Property(e => e.ClinicAddress)
            .HasColumnName("clinic_address");

        builder.Property(e => e.AvatarFileId)
            .HasColumnName("avatar_file_id");

        builder.Property(e => e.CoverImageUrl)
            .HasColumnName("cover_image_url");

        builder.Property(e => e.GalleryUrls)
            .HasColumnName("gallery_urls")
            .HasColumnType("text[]");

        builder.Property(e => e.VideoIntroUrl)
            .HasColumnName("video_intro_url");

        builder.Property(e => e.RatingAverage)
            .HasColumnName("rating_average")
            .HasPrecision(3, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.RatingCount)
            .HasColumnName("rating_count")
            .HasDefaultValue(0);

        builder.Property(e => e.RatingProfessionalism)
            .HasColumnName("rating_professionalism")
            .HasPrecision(3, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.RatingPunctuality)
            .HasColumnName("rating_punctuality")
            .HasPrecision(3, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.RatingQuality)
            .HasColumnName("rating_quality")
            .HasPrecision(3, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.TotalBookings)
            .HasColumnName("total_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.CompletedBookings)
            .HasColumnName("completed_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.CancelledBookings)
            .HasColumnName("cancelled_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.NoShowCount)
            .HasColumnName("no_show_count")
            .HasDefaultValue(0);

        builder.Property(e => e.TotalRevenue)
            .HasColumnName("total_revenue")
            .HasPrecision(12, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.AvailableBalance)
            .HasColumnName("available_balance")
            .HasPrecision(12, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.ResponseRate)
            .HasColumnName("response_rate")
            .HasPrecision(5, 2)
            .HasDefaultValue(100.00m);

        builder.Property(e => e.ResponseTimeMinutes)
            .HasColumnName("response_time_minutes")
            .HasDefaultValue(60);

        builder.Property(e => e.IsVerified)
            .HasColumnName("is_verified")
            .HasDefaultValue(false);

        builder.Property(e => e.VerificationConsentGiven)
            .HasColumnName("verification_consent_given")
            .HasDefaultValue(false);

        builder.Property(e => e.VerificationStatus)
            .HasColumnName("verification_status")
            .HasMaxLength(30)
            .HasDefaultValue(ProviderConstants.VerificationStatuses.NotRequested)
            .IsRequired();

        builder.Property(e => e.VerificationRequestedAt)
            .HasColumnName("verification_requested_at");

        builder.Property(e => e.VerificationReviewedAt)
            .HasColumnName("verification_reviewed_at");

        builder.Property(e => e.VerifiedAt)
            .HasColumnName("verified_at");

        builder.Property(e => e.VerifiedBy)
            .HasColumnName("verified_by");

        builder.Property(e => e.IsApproved)
            .HasColumnName("is_approved")
            .HasDefaultValue(false);

        builder.Property(e => e.ApprovedAt)
            .HasColumnName("approved_at");

        builder.Property(e => e.ApprovedBy)
            .HasColumnName("approved_by");

        builder.Property(e => e.RejectionReason)
            .HasColumnName("rejection_reason");

        builder.Property(e => e.SubscriptionTier)
            .HasColumnName("subscription_tier")
            .HasDefaultValue("free");

        builder.Property(e => e.SubscriptionExpiresAt)
            .HasColumnName("subscription_expires_at");

        builder.Property(e => e.CommissionRate)
            .HasColumnName("commission_rate")
            .HasPrecision(5, 2)
            .HasDefaultValue(15.00m);

        builder.Property(e => e.StripeAccountId)
            .HasColumnName("stripe_account_id")
            .HasMaxLength(100);

        builder.Property(e => e.StripeAccountStatus)
            .HasColumnName("stripe_account_status")
            .HasMaxLength(50);

        builder.Property(e => e.BankName)
            .HasColumnName("bank_name")
            .HasMaxLength(200);

        builder.Property(e => e.BankAccountNumber)
            .HasColumnName("bank_account_number")
            .HasMaxLength(100);

        builder.Property(e => e.BankRoutingNumber)
            .HasColumnName("bank_routing_number")
            .HasMaxLength(50);

        builder.Property(e => e.Timezone)
            .HasColumnName("timezone")
            .HasMaxLength(50)
            .HasDefaultValue("Africa/Tunis")
            .IsRequired();

        builder.Property(e => e.InstantBookingEnabled)
            .HasColumnName("instant_booking_enabled")
            .HasDefaultValue(false);

        builder.Property(e => e.AutoAcceptBookings)
            .HasColumnName("auto_accept_bookings")
            .HasDefaultValue(false);

        builder.Property(e => e.MinBookingNoticeHours)
            .HasColumnName("min_booking_notice_hours")
            .HasDefaultValue(2);

        builder.Property(e => e.MaxBookingAdvanceDays)
            .HasColumnName("max_booking_advance_days")
            .HasDefaultValue(365);

        builder.Property(e => e.CancellationPolicy)
            .HasColumnName("cancellation_policy");

        builder.Property(e => e.IsAvailable)
            .HasColumnName("is_available")
            .HasDefaultValue(true);

        builder.Property(e => e.AvailabilityStatus)
            .HasColumnName("availability_status")
            .HasMaxLength(50)
            .HasDefaultValue("available");

        builder.Property(e => e.VacationStartDate)
            .HasColumnName("vacation_start_date");

        builder.Property(e => e.VacationEndDate)
            .HasColumnName("vacation_end_date");

        builder.Property(e => e.ProfileCompleted)
            .HasColumnName("profile_completed")
            .HasDefaultValue(false);

        builder.Property(e => e.OnboardingStep)
            .HasColumnName("onboarding_step")
            .HasDefaultValue(1);

        builder.Property(e => e.Featured)
            .HasColumnName("featured")
            .HasDefaultValue(false);

        builder.Property(e => e.FeaturedUntil)
            .HasColumnName("featured_until");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // Relationships
        builder.HasOne(e => e.User)
            .WithOne(e => e.Provider)
            .HasForeignKey<Provider>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.AvatarFile)
            .WithMany()
            .HasForeignKey(e => e.AvatarFileId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("idx_providers_user_id");

        builder.HasIndex(e => e.ServiceCategory)
            .HasDatabaseName("idx_providers_category");

        builder.HasIndex(e => e.City)
            .HasDatabaseName("idx_providers_city");

        builder.HasIndex(e => e.IsApproved)
            .HasDatabaseName("idx_providers_approved")
            .HasFilter("is_approved = TRUE");

        builder.HasIndex(e => e.VerificationStatus)
            .HasDatabaseName("idx_providers_verification_status");

        builder.HasIndex(e => e.RatingAverage)
            .HasDatabaseName("idx_providers_rating")
            .IsDescending();

        builder.HasIndex(e => e.AvailableBalance)
            .HasDatabaseName("idx_providers_available_balance");

        builder.HasIndex(e => e.AvatarFileId)
            .HasDatabaseName("idx_providers_avatar_file_id");
    }
}
