using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Command to rate a validated booking session by creating a review.
/// Only the session's patient may rate, and only once per session.
/// </summary>
public record RateBookingSessionCommand(
    Guid SessionId,
    Guid CallerUserId,
    int Rating,
    string? Comment) : IRequest<RateBookingResponse>, ISensitiveRequest;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="RateBookingSessionCommand"/>.
/// Enforces patient ownership, session status guard (must be Validated), duplicate
/// review check, and recomputes provider denormalized rating stats from the database
/// to avoid read-modify-write race conditions. Wrapped in a transaction for atomicity.
/// </summary>
public class RateBookingSessionHandler : IRequestHandler<RateBookingSessionCommand, RateBookingResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RateBookingSessionHandler> _logger;

    public RateBookingSessionHandler(
        IBookingSessionRepository sessionRepository,
        IBookingRepository bookingRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<RateBookingSessionHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<RateBookingResponse> Handle(
        RateBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        // ==================== Load Tracked Session ====================
        var session = await _sessionRepository.GetByIdWithBookingForUpdateAsync(command.SessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {command.SessionId} was not found.");

        // ==================== Ownership Check ====================
        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(command.CallerUserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Patient profile not found for user {command.CallerUserId}.");

        if (session.PatientId != patientId)
            throw new UnauthorizedAccessException("You do not have permission to rate this booking session.");

        // ==================== Status Guard ====================
        if (session.Status != BookingSessionStatus.Validated)
            throw new InvalidOperationException(
                $"Only validated booking sessions can be rated. Current status: '{session.Status}'.");

        // ==================== Duplicate Review Check ====================
        // The check below is subject to a TOCTOU race condition (two concurrent requests
        // can both pass this check). The unique index on (booking_session_id) in the reviews table provides
        // DB-level protection: the second INSERT will fail with DbUpdateException, which the
        // GlobalExceptionHandlingMiddleware maps to 409 Conflict. This is acceptable per project rules
        // (no try-catch in handlers).
        var reviewExists = await _bookingRepository.ReviewExistsForBookingSessionAsync(command.SessionId, cancellationToken);
        if (reviewExists)
            throw new InvalidOperationException("A review already exists for this booking session.");

        // ==================== Execute within transaction ====================
        // Review creation + provider rating stats recomputation must be atomic.
        // Rating stats are recomputed from the reviews table (SELECT AVG/COUNT) instead of
        // in-memory arithmetic to avoid read-modify-write race conditions when two concurrent
        // ratings target the same provider.
        return await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
        {
            // ==================== Create Review ====================
            var review = new Review
            {
                BookingSessionId = session.Id,
                BookingId = session.BookingId,
                PatientId = patientId,
                ProviderId = session.ProviderId,
                ServiceId = session.Booking.ServiceId,
                Rating = command.Rating,
                Comment = command.Comment,
                IsVerified = true,
                IsVisible = true
            };

            await _bookingRepository.CreateReviewAsync(review, ct);

            // Flush the new review to the database so the aggregate query below includes it.
            await _unitOfWork.SaveChangesAsync(ct);

            // ==================== Recompute Provider Rating Stats from DB ====================
            // Query the reviews table for AVG/COUNT instead of doing arithmetic in C#.
            // This eliminates the read-modify-write race condition on the denormalized fields.
            var provider = await _providerRepository.GetByIdForUpdateAsync(session.ProviderId, ct);
            if (provider != null)
            {
                var (average, count) = await _providerRepository.ComputeRatingStatsAsync(session.ProviderId, ct);
                provider.RatingAverage = average;
                provider.RatingCount = count;

                await _unitOfWork.SaveChangesAsync(ct);
            }
            else
            {
                // Log warning when provider not found (e.g., soft-deleted)
                _logger.LogWarning(
                    "Provider {ProviderId} not found when updating rating stats for booking session {SessionId} on booking {BookingId}",
                    session.ProviderId, command.SessionId, session.BookingId);
            }

            _logger.LogInformation(
                "Booking session {SessionId} on booking {BookingId} rated {Rating}/5 by patient {UserId}",
                command.SessionId, session.BookingId, command.Rating, command.CallerUserId);

            // ==================== Build Response ====================
            return new RateBookingResponse
            {
                Id = review.Id,
                BookingSessionId = review.BookingSessionId,
                BookingId = review.BookingId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }, cancellationToken);
    }
}
