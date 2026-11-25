namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Signed provider signup upload token payload.
/// </summary>
public sealed record ProviderSignupUploadTokenValidation(Guid ApplicationId, DateTime ExpiresAt);

/// <summary>
/// Issues and validates short-lived application-bound upload tokens for anonymous provider signup uploads.
/// </summary>
public interface IProviderSignupUploadTokenService
{
    (string Token, Guid ApplicationId, DateTime ExpiresAt) Issue();
    ProviderSignupUploadTokenValidation Validate(string token, Guid applicationId);
}
