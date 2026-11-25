using System.Text.Json.Serialization;

namespace SanadPlatform.API.Features.Authentication.DTOs;

// ── Request DTOs ─────────────────────────────────────────────────────────────

/// <summary>
/// DTO for user registration request.
/// </summary>
public record RegisterUserRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    /// <summary>Optional provider street address. Ignored for patient registration.</summary>
    public string? Address { get; init; }
    /// <summary>Accepted values: "patient" | "provider" (case-insensitive)</summary>
    public string Role { get; init; } = string.Empty;
    /// <summary>Required when Role is "provider".</summary>
    public string? ServiceType { get; init; }
    /// <summary>Required only when Role is "provider" and ServiceType is "nutrition".</summary>
    public string? NutritionProviderSubtype { get; init; }
    /// <summary>Provider-only consent for optional Sanad AI document verification.</summary>
    public bool VerificationConsentGiven { get; init; }
    /// <summary>Provider-only signup upload application identifier returned by the anonymous upload contract.</summary>
    public Guid? ProviderApplicationId { get; init; }
    /// <summary>Provider-only completed approval document references attached to the pending application.</summary>
    public IReadOnlyList<ProviderRegistrationDocumentReference> ProviderDocuments { get; init; } = Array.Empty<ProviderRegistrationDocumentReference>();
    public string CountryCode { get; init; } = "TN";
    public string? DeviceFingerprint { get; init; }
}

/// <summary>
/// Provider registration document reference accepted by the signup contract.
/// The referenced object must already be uploaded and available to the review workflow.
/// </summary>
public record ProviderRegistrationDocumentReference
{
    public Guid? ApplicationId { get; init; }
    public Guid? FileId { get; init; }
    public string DocumentType { get; init; } = string.Empty;
    public string? DocumentName { get; init; }
    public int? FileSizeBytes { get; init; }
    public string? MimeType { get; init; }
}

/// <summary>
/// DTO for user login request.
/// </summary>
public record LoginRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public bool RememberMe { get; init; } = false;
    public string? DeviceFingerprint { get; init; }
}

/// <summary>
/// DTO for requesting a login OTP by email or SMS.
/// </summary>
public record RequestLoginOtpRequest
{
    public string Channel { get; init; } = "email";
    public string Email { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public bool RememberMe { get; init; } = false;
    public string? DeviceFingerprint { get; init; }
}

/// <summary>
/// DTO returned after a login OTP request.
/// </summary>
public record RequestLoginOtpResponse
{
    public Guid ChallengeId { get; init; }
    public string Channel { get; init; } = "email";
    public string MaskedDestination { get; init; } = string.Empty;
    public int ExpiresIn { get; init; }
    public int ResendAvailableIn { get; init; }
}

/// <summary>
/// DTO for verifying a login OTP.
/// </summary>
public record VerifyLoginOtpRequest
{
    public Guid ChallengeId { get; init; }
    public string Code { get; init; } = string.Empty;
    public bool RememberMe { get; init; } = false;
    public string? DeviceFingerprint { get; init; }
}

/// <summary>
/// DTO for changing the current authenticated user's password.
/// </summary>
public record ChangePasswordRequest
{
    public string CurrentPassword { get; init; } = string.Empty;
    public string NewPassword { get; init; } = string.Empty;
}

/// <summary>
/// DTO for deleting the current authenticated user's account.
/// </summary>
public record DeleteAccountRequest
{
    public string CurrentPassword { get; init; } = string.Empty;
}

// ── Registration Response DTOs ────────────────────────────────────────────────

/// <summary>
/// Response returned after a successful registration.
/// The top-level message is carried by ApiResponse.Message — no duplication here.
/// </summary>
public record RegistrationResponse
{
    public RegistrationUserResponse User { get; init; } = null!;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Token { get; init; }
    /// <summary>Raw refresh token. Send to the client; never store client-side in plain text.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RefreshToken { get; init; }
    /// <summary>Seconds until the access token expires.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int ExpiresIn { get; init; }
    /// <summary>True when the account exists but must be approved before authentication is allowed.</summary>
    public bool RequiresApproval { get; init; }
}

/// <summary>
/// Slim user payload included in RegistrationResponse.
/// </summary>
public record RegistrationUserResponse
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string? CountryCode { get; init; }
}

// ── Login Response DTOs ───────────────────────────────────────────────────────

/// <summary>
/// Response returned after a successful login.
/// </summary>
public record LoginResponse
{
    public LoginUserResponse User { get; init; } = null!;
    public string Token { get; init; } = string.Empty;
    public string? RefreshToken { get; init; }
    /// <summary>Seconds until the token expires.</summary>
    public int ExpiresIn { get; init; }
}

/// <summary>
/// User payload included in LoginResponse.
/// </summary>
public record LoginUserResponse
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string? Avatar { get; init; }
    public Guid? AvatarFileId { get; init; }
    public string? CountryCode { get; init; }
    public DateTime CreatedAt { get; init; }
}

// ── Profile Response DTO ──────────────────────────────────────────────────────

/// <summary>
/// DTO for user profile response (GET /auth/profile).
/// </summary>
public record UserResponse
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public string? Avatar { get; init; }
    public Guid? AvatarFileId { get; init; }
    public string Role { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
}

// ── Security Response DTOs ────────────────────────────────────────────────────

/// <summary>
/// Security overview payload for the authenticated user.
/// </summary>
public record SecurityOverviewResponse
{
    public bool TwoFactorEnabled { get; init; }
    public DateTime? PasswordChangedAt { get; init; }
    public IReadOnlyList<SessionSummary> Sessions { get; init; } = [];
}

/// <summary>
/// Session summary returned in the authenticated user's security overview.
/// </summary>
public record SessionSummary
{
    public Guid Id { get; init; }
    public string? IpAddress { get; init; }
    public string? DeviceType { get; init; }
    public string? DisplayName { get; init; }
    public string? BrowserName { get; init; }
    public string? OperatingSystem { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime ExpiresAt { get; init; }
    public bool IsCurrent { get; init; }
}

// ── Refresh Token ─────────────────────────────────────────────────────────────

/// <summary>
/// Request body for POST /auth/refresh-token.
/// </summary>
public record RefreshTokenRequest
{
    /// <summary>The raw refresh token previously issued by login or registration.</summary>
    public string RefreshToken { get; init; } = string.Empty;
    public string? DeviceFingerprint { get; init; }
}

/// <summary>
/// Optional request body for POST /auth/logout.
/// </summary>
public record LogoutRequest
{
    /// <summary>The raw refresh token to revoke when no current authenticated session is available.</summary>
    public string? RefreshToken { get; init; }
}
