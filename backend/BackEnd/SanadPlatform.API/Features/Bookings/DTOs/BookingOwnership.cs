namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Lightweight projection used for booking ownership checks.
/// Contains only the two User IDs linked via Patient.UserId and Provider.UserId,
/// avoiding a full entity-graph load just to authorize a caller.
/// </summary>
public record BookingOwnership(Guid? PatientUserId, Guid? ProviderUserId);
