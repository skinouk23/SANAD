namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request body for PATCH /api/v1/bookings/{id}.
/// Only address and patient notes may be updated on a pending/confirmed booking.
/// </summary>
public class UpdateBookingRequest
{
    public UpdateBookingAddressRequest? Address { get; init; }
    public string? PatientNotes { get; init; }
}

/// <summary>Address sub-object for the update request.</summary>
public class UpdateBookingAddressRequest
{
    public string Line1 { get; init; } = string.Empty;
    public string? City { get; init; }
    public string? PostalCode { get; init; }
}

/// <summary>
/// Response body for PATCH /api/v1/bookings/{id} (200 OK).
/// </summary>
public class UpdateBookingResponse
{
    public Guid Id { get; init; }
    public UpdateBookingAddressResponse? Address { get; init; }
    public DateTime UpdatedAt { get; init; }
}

/// <summary>Address echo in the update response.</summary>
public class UpdateBookingAddressResponse
{
    public string? Line1 { get; init; }
    public string? City { get; init; }
    public string? PostalCode { get; init; }
}
