using System;
using System.Collections.Generic;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Rewards.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Represents a patient profile in the healthcare marketplace.
/// </summary>
public class Patient : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    // ==================== Personal Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string FirstName { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Critical)]
    public string LastName { get; set; } = string.Empty;

    public DateOnly? DateOfBirth { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public Gender? Gender { get; set; }

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

    // ==================== Geolocation ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal? Latitude { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal? Longitude { get; set; }

    // ==================== Emergency Contact ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? EmergencyContactName { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? EmergencyContactPhone { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? EmergencyContactRelationship { get; set; }

    // ==================== Medical Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? BloodType { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? MedicalConditions { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? Allergies { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? CurrentMedications { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? MedicalNotes { get; set; }

    // ==================== Insurance ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? InsuranceProvider { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? InsurancePolicyNumber { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public DateOnly? InsuranceExpiryDate { get; set; }

    // ==================== Profile ====================

    public Guid? AvatarFileId { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Bio { get; set; }

    // ==================== Preferences ====================

    public CommunicationChannel? PreferredCommunication { get; set; } = CommunicationChannel.App;

    public bool MarketingConsent { get; set; } = false;

    public bool DataSharingConsent { get; set; } = false;

    // ==================== Stats (denormalized) ====================

    public int TotalBookings { get; set; } = 0;

    public int CompletedBookings { get; set; } = 0;

    public int CancelledBookings { get; set; } = 0;

    public decimal TotalSpent { get; set; } = 0.00m;

    // ==================== Metadata ====================

    public bool ProfileCompleted { get; set; } = false;

    public DateTime? OnboardingCompletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
    public virtual StoredFile? AvatarFile { get; set; }
    public virtual PatientPreferences? Preferences { get; set; }
    public virtual PatientRewards? Rewards { get; set; }
    public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
    public virtual ICollection<FamilyAccess> FamilyAccess { get; set; } = new List<FamilyAccess>();
    public virtual ICollection<ActivityTracking> ActivityTrackings { get; set; } = new List<ActivityTracking>();
    public virtual ICollection<HydrationTracking> HydrationTrackings { get; set; } = new List<HydrationTracking>();
    public virtual ICollection<NutritionTracking> NutritionTrackings { get; set; } = new List<NutritionTracking>();
    public virtual NutritionProfile? NutritionProfile { get; set; }
    public virtual ICollection<VitalSign> VitalSigns { get; set; } = new List<VitalSign>();
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<PatientBadge> Badges { get; set; } = new List<PatientBadge>();
    public virtual ICollection<PatientFavorite> Favorites { get; set; } = new List<PatientFavorite>();
    public virtual ICollection<RewardTransaction> RewardTransactions { get; set; } = new List<RewardTransaction>();
    public virtual ICollection<Referral> Referrals { get; set; } = new List<Referral>();
}
