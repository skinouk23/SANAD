namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Snapshot of a selected service returned in booking responses.
/// </summary>
public class BookingLineItemResponse
{
    public Guid Id { get; init; }

    public Guid ServiceId { get; init; }

    public string ServiceName { get; init; } = string.Empty;

    public string ServiceCategory { get; init; } = string.Empty;

    public string Currency { get; init; } = "TND";

    public int Quantity { get; init; }

    public decimal UnitPrice { get; init; }

    public decimal Subtotal { get; init; }
}
