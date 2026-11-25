using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Reviews.Entities;

/// <summary>
/// Represents a review/rating for a service provided by a provider.
/// </summary>
public class Review : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // ==================== Foreign Keys ====================

    public Guid BookingId { get; set; }

    public Guid BookingSessionId { get; set; }

    public Guid PatientId { get; set; }

    public Guid ProviderId { get; set; }

    public Guid ServiceId { get; set; }

    // ==================== Ratings ====================

    public int Rating { get; set; }

    public int? RatingProfessionalism { get; set; }

    public int? RatingPunctuality { get; set; }

    public int? RatingQuality { get; set; }

    public int? RatingCommunication { get; set; }

    // ==================== Content ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Title { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Comment { get; set; }

    // ==================== Media ====================

    public List<string> PhotoUrls { get; set; } = new();

    // ==================== Verification ====================

    public bool IsVerified { get; set; } = true;

    // ==================== Moderation ====================

    public bool IsVisible { get; set; } = true;

    public bool IsFlagged { get; set; } = false;

    public string? FlaggedReason { get; set; }

    public DateTime? ModeratedAt { get; set; }

    public Guid? ModeratedBy { get; set; }

    // ==================== Provider Response ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? ProviderResponse { get; set; }

    public DateTime? ProviderRespondedAt { get; set; }

    // ==================== Fraud Detection ====================

    public decimal? FraudScore { get; set; }

    public bool IsSuspicious { get; set; } = false;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
    public virtual BookingSession BookingSession { get; set; } = null!;
    public virtual Patient Patient { get; set; } = null!;
    public virtual Provider Provider { get; set; } = null!;
    public virtual ICollection<ReviewReport> Reports { get; set; } = new List<ReviewReport>();
}
