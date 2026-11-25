using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Request DTO for adding a family member.
/// </summary>
public record AddFamilyMemberRequest(
    string FirstName,
    string LastName,
    string Relationship,
    DateOnly? DateOfBirth = null,
    string? Gender = null,
    string? Email = null,
    string? MedicalHistory = null,
    string? Allergies = null,
    string? CurrentMedications = null);
