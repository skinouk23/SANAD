using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Request DTO for adding a provider to favorites.
/// </summary>
public record AddFavoriteRequest(Guid ProviderId);
