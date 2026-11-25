using System.Security.Cryptography;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Generates, encrypts, reads, and verifies booking session validation codes.
/// </summary>
public interface IBookingSessionVerificationCodeService
{
    int MaxAttempts { get; }

    void GenerateForArrival(BookingSession session, DateTime nowUtc);

    VerificationCodeCheckResult Verify(BookingSession session, string validationCode, DateTime nowUtc);

    string? GetVisibleCode(BookingSession session, Guid patientId, DateTime nowUtc);

    bool CanPatientSeeCode(BookingSession session, Guid patientId, DateTime nowUtc);
}

/// <summary>
/// Result of a provider-entered session code check.
/// </summary>
public sealed record VerificationCodeCheckResult(
    bool IsValid,
    bool IsExpired,
    bool IsLocked,
    int AttemptsRemaining,
    string? FailureReason);

/// <summary>
/// Default implementation for session verification codes.
/// </summary>
public class BookingSessionVerificationCodeService : IBookingSessionVerificationCodeService
{
    private const int DefaultMaxAttempts = 5;
    private static readonly TimeSpan DefaultCodeLifetime = TimeSpan.FromHours(12);

    private readonly IEncryptionService _encryptionService;

    public BookingSessionVerificationCodeService(IEncryptionService encryptionService)
    {
        _encryptionService = encryptionService ?? throw new ArgumentNullException(nameof(encryptionService));
    }

    public int MaxAttempts => DefaultMaxAttempts;

    public void GenerateForArrival(BookingSession session, DateTime nowUtc)
    {
        ArgumentNullException.ThrowIfNull(session);

        var code = RandomNumberGenerator.GetInt32(100_000, 1_000_000).ToString();
        session.VerificationCode = _encryptionService.Encrypt(code);
        session.VerificationCodeGeneratedAt = nowUtc;
        session.VerificationCodeExpiresAt = nowUtc.Add(DefaultCodeLifetime);
        session.VerificationAttempts = 0;
    }

    public VerificationCodeCheckResult Verify(BookingSession session, string validationCode, DateTime nowUtc)
    {
        ArgumentNullException.ThrowIfNull(session);

        if (session.VerificationAttempts >= MaxAttempts)
        {
            return new VerificationCodeCheckResult(false, false, true, 0, "Verification code entry is locked.");
        }

        if (string.IsNullOrWhiteSpace(session.VerificationCode))
        {
            return new VerificationCodeCheckResult(false, false, false, MaxAttempts - session.VerificationAttempts, "No active verification code exists for this session.");
        }

        if (session.VerificationCodeExpiresAt.HasValue && session.VerificationCodeExpiresAt.Value < nowUtc)
        {
            return new VerificationCodeCheckResult(false, true, false, MaxAttempts - session.VerificationAttempts, "The verification code has expired.");
        }

        var storedCode = _encryptionService.Decrypt(session.VerificationCode);
        var isValid = string.Equals(storedCode, validationCode, StringComparison.Ordinal);
        if (isValid)
        {
            return new VerificationCodeCheckResult(true, false, false, MaxAttempts - session.VerificationAttempts, null);
        }

        var attemptsAfterFailure = session.VerificationAttempts + 1;
        var attemptsRemaining = Math.Max(0, MaxAttempts - attemptsAfterFailure);
        return new VerificationCodeCheckResult(false, false, attemptsRemaining == 0, attemptsRemaining, "The verification code is invalid.");
    }

    public string? GetVisibleCode(BookingSession session, Guid patientId, DateTime nowUtc)
    {
        return CanPatientSeeCode(session, patientId, nowUtc) && !string.IsNullOrWhiteSpace(session.VerificationCode)
            ? _encryptionService.Decrypt(session.VerificationCode)
            : null;
    }

    public bool CanPatientSeeCode(BookingSession session, Guid patientId, DateTime nowUtc)
    {
        ArgumentNullException.ThrowIfNull(session);

        return session.PatientId == patientId
            && session.Status is BookingSessionStatus.Arrived or BookingSessionStatus.InProgress
            && !string.IsNullOrWhiteSpace(session.VerificationCode)
            && (!session.VerificationCodeExpiresAt.HasValue || session.VerificationCodeExpiresAt.Value >= nowUtc);
    }
}
