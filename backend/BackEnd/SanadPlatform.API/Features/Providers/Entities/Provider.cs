using System;
using System.Collections.Generic;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Represents a healthcare provider in the marketplace.
/// Includes merged verification, subscription, and payment fields (formerly separate entities).
/// </summary>
public class Provider : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    // ==================== Provider Type ====================

    public string ServiceCategory { get; set; } = string.Empty;

    public NutritionProviderSubtype? NutritionProviderSubtype { get; set; }

    public bool IsIndividual { get; set; } = true;

    // ==================== Business Info ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? BusinessName { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? LegalName { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? TaxId { get; set; }

    // ==================== Personal Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? FirstName { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? LastName { get; set; }

    // ==================== Professional Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? LicenseNumber { get; set; }

    public string? LicenseIssuingAuthority { get; set; }

    public DateOnly? LicenseExpiryDate { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public List<string> Specializations { get; set; } = new();

    public int YearsOfExperience { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Education { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public List<string> Certifications { get; set; } = new();

    public List<string> LanguagesSpoken { get; set; } = new() { "fr" };

    // ==================== Bio & Description ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Bio { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? ShortDescription { get; set; }

    // ==================== Address ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? AddressLine1 { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? AddressLine2 { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? City { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? StateProvince { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? PostalCode { get; set; }

    public string CountryCode { get; set; } = "TN";

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal? Latitude { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal? Longitude { get; set; }

    // ==================== Service Area ====================

    public int ServiceRadiusKm { get; set; } = 20;

    public bool ServesAtHome { get; set; } = true;

    public bool ServesAtClinic { get; set; } = false;

    public string? ClinicAddress { get; set; }

    // ==================== Media ====================

    public Guid? AvatarFileId { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? CoverImageUrl { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public List<string> GalleryUrls { get; set; } = new();

    public string? VideoIntroUrl { get; set; }

    // ==================== Ratings (Denormalized) ====================

    public decimal RatingAverage { get; set; } = 0.00m;

    public int RatingCount { get; set; } = 0;

    public decimal RatingProfessionalism { get; set; } = 0.00m;

    public decimal RatingPunctuality { get; set; } = 0.00m;

    public decimal RatingQuality { get; set; } = 0.00m;

    // ==================== Stats (Denormalized) ====================

    public int TotalBookings { get; set; } = 0;

    public int CompletedBookings { get; set; } = 0;

    public int CancelledBookings { get; set; } = 0;

    public int NoShowCount { get; set; } = 0;

    public decimal TotalRevenue { get; set; } = 0.00m;

    /// <summary>
    /// Denormalized available balance (released transactions minus completed payouts).
    /// Updated by the payment pipeline after each payout or transaction release.
    /// </summary>
    public decimal AvailableBalance { get; set; } = 0.00m;

    public decimal ResponseRate { get; set; } = 100.00m;

    public int ResponseTimeMinutes { get; set; } = 60;

    // ==================== Verification & Approval (merged from ProviderVerification) ====================

    public bool IsVerified { get; set; } = false;

    public bool VerificationConsentGiven { get; set; } = false;

    public string VerificationStatus { get; set; } = ProviderConstants.VerificationStatuses.NotRequested;

    public DateTime? VerificationRequestedAt { get; set; }

    public DateTime? VerificationReviewedAt { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public Guid? VerifiedBy { get; set; }

    public bool IsApproved { get; set; } = false;

    public DateTime? ApprovedAt { get; set; }

    public Guid? ApprovedBy { get; set; }

    public string? RejectionReason { get; set; }

    // ==================== Subscription (merged from ProviderSubscription) ====================

    public string SubscriptionTier { get; set; } = "free";

    public DateTime? SubscriptionExpiresAt { get; set; }

    public decimal CommissionRate { get; set; } = 15.00m;

    // ==================== Payment Info (merged from ProviderPayment) ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? StripeAccountId { get; set; }

    public string? StripeAccountStatus { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? BankName { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? BankAccountNumber { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? BankRoutingNumber { get; set; }

    // ==================== Settings ====================

    /// <summary>
    /// IANA timezone identifier for the provider (e.g. "Africa/Tunis", "Europe/Paris").
    /// Used to interpret weekly schedule times and compute local availability.
    /// </summary>
    public string Timezone { get; set; } = "Africa/Tunis";

    public bool InstantBookingEnabled { get; set; } = false;

    public bool AutoAcceptBookings { get; set; } = false;

    public int MinBookingNoticeHours { get; set; } = 2;

    public int MaxBookingAdvanceDays { get; set; } = 365;

    public string? CancellationPolicy { get; set; }

    // ==================== Availability ====================

    public bool IsAvailable { get; set; } = true;

    public string AvailabilityStatus { get; set; } = "available";

    public DateOnly? VacationStartDate { get; set; }

    public DateOnly? VacationEndDate { get; set; }

    // ==================== Metadata ====================

    public bool ProfileCompleted { get; set; } = false;

    public int OnboardingStep { get; set; } = 1;

    public bool Featured { get; set; } = false;

    public DateTime? FeaturedUntil { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
    public virtual StoredFile? AvatarFile { get; set; }
    public virtual ProviderPreferences? Preferences { get; set; }
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
    public virtual ICollection<ProviderDocument> Documents { get; set; } = new List<ProviderDocument>();
    public virtual ICollection<ProviderCertification> ProviderCertifications { get; set; } = new List<ProviderCertification>();
    public virtual ICollection<ProviderSchedule> Schedules { get; set; } = new List<ProviderSchedule>();
    public virtual ICollection<ProviderUnavailability> Unavailabilities { get; set; } = new List<ProviderUnavailability>();
}
