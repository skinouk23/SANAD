namespace SanadPlatform.API.Common.Enums;

/// <summary>
/// Represents the execution status of an individual booking session.
/// </summary>
public enum BookingSessionStatus
{
    Pending,
    Confirmed,
    ProviderOnWay,
    Arrived,
    InProgress,
    Completed,
    Validated,
    Cancelled,
    NoShow,
    Disputed
}
