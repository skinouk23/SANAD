using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for updating the patient profile.
/// All fields are optional to support partial updates.
/// </summary>
public record UpdatePatientProfileRequest(
    string? FirstName = null,
    string? LastName = null,
    DateOnly? DateOfBirth = null,
    string? Gender = null,
    string? Address = null,
    string? City = null,
    string? PostalCode = null,
    decimal? Latitude = null,
    decimal? Longitude = null,
    string? EmergencyContactName = null,
    string? EmergencyContactPhone = null,
    string? EmergencyContactRelationship = null,
    string? MedicalHistory = null,
    string? Allergies = null,
    string? CurrentMedications = null,
    string? InsuranceProvider = null,
    string? InsuranceNumber = null);
