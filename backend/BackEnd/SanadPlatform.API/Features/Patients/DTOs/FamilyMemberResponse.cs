using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for family circle members.
/// </summary>
public record FamilyMemberResponse
{
    public Guid Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Relationship { get; init; } = string.Empty;
    public DateOnly? DateOfBirth { get; init; }
    public string? Gender { get; init; }
    public string? Email { get; init; }
    public string? MedicalHistory { get; init; }
    public string? Allergies { get; init; }
    public string? CurrentMedications { get; init; }
    public DateTime AddedAt { get; init; }
}
