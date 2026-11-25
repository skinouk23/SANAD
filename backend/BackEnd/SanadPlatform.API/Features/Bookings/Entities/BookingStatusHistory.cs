using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a status transition in the booking lifecycle.
/// Rows are created automatically by the <c>trg_booking_status_change</c> PostgreSQL trigger
/// whenever <see cref="Booking.Status"/> changes. The trigger populates
/// <see cref="BookingId"/>, <see cref="PreviousStatus"/>, <see cref="NewStatus"/>,
/// <see cref="ChangedBy"/>, <see cref="ChangeReason"/>, and <see cref="CreatedAt"/>.
/// </summary>
public class BookingStatusHistory : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }

    public BookingStatus? PreviousStatus { get; set; }

    public BookingStatus NewStatus { get; set; }

    public Guid? ChangedBy { get; set; }

    /// <summary>
    /// Human-readable reason for the status change. Stored as plain text (not encrypted)
    /// because the trigger copies the raw column value from <see cref="Booking.StatusChangeReason"/>,
    /// bypassing EF value converters. If encryption is required in the future, the trigger
    /// must be updated to copy ciphertext and a matching value converter must be configured
    /// on this property.
    /// </summary>
    public string? ChangeReason { get; set; }

    /// <summary>
    /// Reserved for future use (e.g., admin/manual status overrides).
    /// Not populated by the <c>trg_booking_status_change</c> trigger.
    /// </summary>
    public string? Notes { get; set; }

    /// <summary>
    /// Reserved for geo-tagged status changes (e.g., provider check-in location).
    /// Not populated by the <c>trg_booking_status_change</c> trigger.
    /// </summary>
    public decimal? Latitude { get; set; }

    /// <summary>
    /// Reserved for geo-tagged status changes (e.g., provider check-in location).
    /// Not populated by the <c>trg_booking_status_change</c> trigger.
    /// </summary>
    public decimal? Longitude { get; set; }

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
