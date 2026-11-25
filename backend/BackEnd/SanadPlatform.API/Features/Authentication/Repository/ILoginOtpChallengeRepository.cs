using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Repository;

/// <summary>
/// Repository contract for login OTP challenges.
/// </summary>
public interface ILoginOtpChallengeRepository
{
    /// <summary>Stages a new OTP challenge for insertion.</summary>
    Task<LoginOtpChallenge> CreateAsync(
        LoginOtpChallenge challenge,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked challenge with the owning user and role profile loaded.
    /// </summary>
    Task<LoginOtpChallenge?> GetByIdWithUserForUpdateAsync(
        Guid challengeId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Consumes active unexpired challenges for the user and channel.
    /// Used before issuing a replacement code.
    /// </summary>
    Task ConsumeActiveChallengesForUserAsync(
        Guid userId,
        string channel,
        CancellationToken cancellationToken = default);
}
