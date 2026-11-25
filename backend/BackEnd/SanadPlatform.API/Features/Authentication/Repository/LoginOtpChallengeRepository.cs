using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Authentication.Repository;

/// <summary>
/// EF Core repository for login OTP challenges.
/// </summary>
public class LoginOtpChallengeRepository : ILoginOtpChallengeRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<LoginOtpChallengeRepository> _logger;

    public LoginOtpChallengeRepository(
        SanadDbContext context,
        ILogger<LoginOtpChallengeRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task<LoginOtpChallenge> CreateAsync(
        LoginOtpChallenge challenge,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(challenge);

        _context.LoginOtpChallenges.Add(challenge);
        _logger.LogDebug(
            "Login OTP challenge {ChallengeId} staged for user {UserId}",
            challenge.Id,
            challenge.UserId);
        return Task.FromResult(challenge);
    }

    public async Task<LoginOtpChallenge?> GetByIdWithUserForUpdateAsync(
        Guid challengeId,
        CancellationToken cancellationToken = default)
    {
        return await _context.LoginOtpChallenges
            .Include(challenge => challenge.User)
                .ThenInclude(user => user.Patient)
                    .ThenInclude(patient => patient!.AvatarFile)
            .Include(challenge => challenge.User)
                .ThenInclude(user => user.Provider)
                    .ThenInclude(provider => provider!.AvatarFile)
            .FirstOrDefaultAsync(challenge => challenge.Id == challengeId, cancellationToken);
    }

    public async Task ConsumeActiveChallengesForUserAsync(
        Guid userId,
        string channel,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var normalizedChannel = channel.Trim().ToLowerInvariant();

        var query = _context.LoginOtpChallenges
            .Where(challenge => challenge.UserId == userId
                && challenge.Channel == normalizedChannel
                && challenge.ConsumedAt == null
                && challenge.ExpiresAt > now);

        int count;

        if (_context.Database.IsRelational())
        {
            count = await query.ExecuteUpdateAsync(
                setters => setters.SetProperty(challenge => challenge.ConsumedAt, now),
                cancellationToken);
        }
        else
        {
            var challenges = await query.ToListAsync(cancellationToken);
            foreach (var challenge in challenges)
            {
                challenge.ConsumedAt = now;
            }

            count = challenges.Count;
        }

        _logger.LogDebug(
            "Consumed {Count} active login OTP challenge(s) for user {UserId}",
            count,
            userId);
    }
}
