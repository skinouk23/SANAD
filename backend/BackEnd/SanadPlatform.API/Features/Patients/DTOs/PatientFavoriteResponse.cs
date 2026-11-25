using System;
using System.Collections.Generic;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for a patient's favorite provider.
/// </summary>
public record PatientFavoriteResponse
{
    public FavoriteProviderDto Provider { get; init; } = null!;
    public DateTime AddedAt { get; init; }
}

/// <summary>
/// Compact provider information for favorites list.
/// </summary>
public record FavoriteProviderDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? ServiceType { get; init; }
    public List<string> Specialties { get; init; } = new();
    public decimal Rating { get; init; }
    public int ReviewCount { get; init; }
    public Guid? AvatarFileId { get; init; }
    public string? City { get; init; }
}
