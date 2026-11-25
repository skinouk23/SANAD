using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for the response after adding a provider to favorites.
/// </summary>
public record PatientFavoriteSlimResponse
{
    public Guid ProviderId { get; init; }
    public DateTime AddedAt { get; init; }
}
