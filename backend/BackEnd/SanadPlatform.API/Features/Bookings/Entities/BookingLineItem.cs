using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Snapshot of a selected service included in a booking.
/// </summary>
public class BookingLineItem : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }

    public Guid ServiceId { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public string ServiceCategory { get; set; } = string.Empty;

    public string Currency { get; set; } = "TND";

    public int Quantity { get; set; } = 1;

    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
