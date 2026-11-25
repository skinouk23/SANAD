using System;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Enables patients to bookmark providers or specific services for quick access.
/// </summary>
public class PatientFavorite : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    public Guid ProviderId { get; set; }
    public virtual Provider Provider { get; set; } = null!;


    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

}
