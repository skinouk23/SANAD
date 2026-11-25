using System.Text.Json;

namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request body for creating a new booking.
/// </summary>
public class CreateBookingRequest
{
    public Guid ProviderId { get; init; }

    public List<CreateBookingServiceItemRequest> ServiceItems { get; init; } = [];

    public DateOnly StartDate { get; init; }

    public DateOnly EndDate { get; init; }

    public TimeOnly DailyStartTime { get; init; }

    public CreateBookingAddressRequest? Address { get; init; }

    public string? PatientNotes { get; init; }

    /// <summary>
    /// Payment method selected by the patient for the booking.
    /// Canonical values: <c>card</c>, <c>d17</c>, or <c>cash</c>.
    /// </summary>
    public string? PaymentMethod { get; init; }

    /// <summary>
    /// Optional client-side price assertion. If provided, the booking is rejected
    /// when the server-computed total differs from this value — protecting against
    /// stale price quotes shown to the user.
    /// </summary>
    public decimal? ExpectedTotalAmount { get; init; }

    /// <summary>
    /// Optional patient-selected location when the service supports both home and provider-site delivery.
    /// Canonical values: <c>home</c> or <c>provider_site</c>.
    /// </summary>
    public string? PatientLocationChoice { get; init; }

    /// <summary>
    /// Optional confirmed prescription file identifier supplied by the backend-owned files flow.
    /// </summary>
    public Guid? PrescriptionFileId { get; init; }

    /// <summary>
    /// Category-specific configuration as a native JSON object.
    /// For equipment rentals: <c>{"endDate": "2026-04-15", "rentalDurationType": "weekly"}</c>.
    /// </summary>
    public JsonElement? TypeConfig { get; init; }
}

/// <summary>
/// Address block for the booking delivery or visit location.
/// </summary>
public class CreateBookingAddressRequest
{
    public string Line1 { get; init; } = string.Empty;

    public string? Line2 { get; init; }

    public string? City { get; init; }

    public string? PostalCode { get; init; }

    public decimal? Latitude { get; init; }

    public decimal? Longitude { get; init; }

    public string? Instructions { get; init; }
}

/// <summary>
/// A single selected service line in the booking request.
/// </summary>
public class CreateBookingServiceItemRequest
{
    public Guid ServiceId { get; init; }

    public int Quantity { get; init; } = 1;
}
