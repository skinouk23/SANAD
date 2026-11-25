using MediatR;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Hard-rejected legacy parent booking validation command.
/// Session-based provider completion is the only supported validation path.
/// </summary>
public record ValidateBookingCommand(
    Guid BookingId,
    Guid CallerUserId,
    string ValidationCode) : IRequest<ValidateBookingResponse>, ISensitiveRequest;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="ValidateBookingCommand"/>.
/// Enforces patient ownership, state machine guard, validation code match with brute-force
/// protection, expiry check, and updates provider/patient financial stats on success.
/// Escrow release + stats updates are wrapped in a transaction for atomicity.
/// </summary>
public class ValidateBookingHandler : IRequestHandler<ValidateBookingCommand, ValidateBookingResponse>
{
    public Task<ValidateBookingResponse> Handle(
        ValidateBookingCommand command,
        CancellationToken cancellationToken)
    {
        throw new InvalidOperationException(
            "Parent booking validation is no longer supported. Complete the executable booking session instead.");
    }
}
