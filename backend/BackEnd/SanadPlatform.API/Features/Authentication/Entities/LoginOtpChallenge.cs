using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Entities;

/// <summary>
/// Login OTP challenge used for passwordless email authentication.
/// </summary>
public class LoginOtpChallenge : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string Channel { get; set; } = "email";

    [Encrypted(Classification = DataClassification.Critical)]
    public string DestinationHash { get; set; } = string.Empty;

    public string CodeHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime? ConsumedAt { get; set; }

    public int FailedAttempts { get; set; }

    public DateTime LastSentAt { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public string? DeviceFingerprint { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
