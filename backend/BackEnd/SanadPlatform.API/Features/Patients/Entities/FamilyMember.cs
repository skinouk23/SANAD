using System;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Represents a family member linked to a patient.
/// </summary>
public class FamilyMember : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    // ==================== Personal Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string FirstName { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Critical)]
    public string LastName { get; set; } = string.Empty;

    public RelationshipType Relationship { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public Gender? Gender { get; set; }

    // ==================== Contact ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? Phone { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? Email { get; set; }

    // ==================== Medical Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? BloodType { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? MedicalConditions { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? Allergies { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? CurrentMedications { get; set; }

    // ==================== Profile ====================

    public string? ProfilePictureUrl { get; set; }

    // ==================== Permissions ====================

    public bool CanBookFor { get; set; } = true;

    public bool CanViewHistory { get; set; } = true;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
