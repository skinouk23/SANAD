namespace SanadPlatform.API.Common.Storage;

/// <summary>
/// Durable outbox publication and processing status.
/// </summary>
public enum OutboxStatus
{
    Pending,
    Publishing,
    Published,
    Failed,
    DeadLettered
}
