using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Provider weekly schedule (recurring).
/// </summary>
public class ProviderSchedule : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProviderId { get; set; }
    
        // ==================== Schedule ====================
    
        public DayOfWeek DayOfWeek { get; set; }
    
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

    // ==================== Availability ====================

    public bool IsAvailable { get; set; } = true;

    // ==================== Service Filter ====================

    public Guid? ServiceId { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
    public virtual Service? Service { get; set; }
}
