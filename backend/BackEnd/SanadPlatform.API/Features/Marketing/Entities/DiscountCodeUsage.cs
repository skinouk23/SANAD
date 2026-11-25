using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Marketing.Entities;

/// <summary>
/// Represents the usage of a discount code in a booking.
/// Tracks which patient used which discount code in a specific booking.
/// </summary>
public class DiscountCodeUsage : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== Foreign Keys ====================

    public Guid DiscountCodeId { get; set; }

    public Guid BookingId { get; set; }

    public Guid PatientId { get; set; }

    // ==================== Discount Applied ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal DiscountAmount { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual DiscountCode DiscountCode { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;
}
