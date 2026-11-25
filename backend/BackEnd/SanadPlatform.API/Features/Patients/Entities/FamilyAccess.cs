using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Represents access granted by a patient to another user account.
/// </summary>
public class FamilyAccess : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    public Guid GrantedToUserId { get; set; }

    // ==================== Permissions ====================

    public bool CanBook { get; set; } = true;

    public bool CanViewHistory { get; set; } = true;

    public bool CanViewMedical { get; set; } = false;

    public bool CanManagePayments { get; set; } = false;

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
    public virtual User GrantedToUser { get; set; } = null!;
}
