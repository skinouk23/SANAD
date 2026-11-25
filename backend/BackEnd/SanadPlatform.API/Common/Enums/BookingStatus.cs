namespace SanadPlatform.API.Common.Enums;

/// <summary>
/// Represents the status of a booking in the system.
/// </summary>
public enum BookingStatus
{
    Pending,         // Waiting for confirmation
    Confirmed,       // Confirmed by the provider
    ProviderOnWay,   // Provider on the way
    InProgress,      // Service in progress
    Completed,       // Service completed (awaiting validation)
    Validated,       // Validated by the patient
    Cancelled,       // Cancelled
    NoShow,          // Patient absent
    Disputed         // In dispute
}
