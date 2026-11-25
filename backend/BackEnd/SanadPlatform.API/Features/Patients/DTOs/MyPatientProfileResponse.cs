using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for the authenticated patient's full profile.
/// </summary>
public record MyPatientProfileResponse
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public DateOnly? DateOfBirth { get; init; }
    public string? Gender { get; init; }
    public string? Address { get; init; }
    public string? City { get; init; }
    public string? PostalCode { get; init; }
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
    public EmergencyContactDto EmergencyContact { get; init; } = null!;
    public string? MedicalHistory { get; init; }
    public string? Allergies { get; init; }
    public string? CurrentMedications { get; init; }
    public string? InsuranceProvider { get; init; }
    public string? InsuranceNumber { get; init; }
    public Guid? AvatarFileId { get; init; }
    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Nested DTO for emergency contact information.
/// </summary>
public record EmergencyContactDto
{
    public EmergencyContactDto(string? name, string? phone, string? relationship)
    {
        Name = name;
        Phone = phone;
        Relationship = relationship;
    }

    public string? Name { get; init; }
    public string? Phone { get; init; }
    public string? Relationship { get; init; }
}
