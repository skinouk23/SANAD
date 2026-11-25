using FluentValidation;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// Validator for <see cref="CompleteBookingSessionCommand"/>.
/// </summary>
public class CompleteBookingSessionCommandValidator : AbstractValidator<CompleteBookingSessionCommand>
{
    public CompleteBookingSessionCommandValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty()
            .WithMessage("Session ID is required.");

        RuleFor(x => x.CallerUserId)
            .NotEmpty()
            .WithMessage("Caller user ID is required.");

        RuleFor(x => x.ValidationCode)
            .NotEmpty()
            .Matches("^[0-9]{6}$")
            .WithMessage("Validation code must be exactly 6 digits.");
    }
}

/// <summary>
/// Validator for <see cref="DisputeBookingSessionCommand"/>.
/// </summary>
public class DisputeBookingSessionCommandValidator : AbstractValidator<DisputeBookingSessionCommand>
{
    public DisputeBookingSessionCommandValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty()
            .WithMessage("Session ID is required.");

        RuleFor(x => x.CallerUserId)
            .NotEmpty()
            .WithMessage("Caller user ID is required.");

        RuleFor(x => x.Reason)
            .NotEmpty()
            .MaximumLength(1000)
            .WithMessage("Dispute reason is required and cannot exceed 1000 characters.");
    }
}

/// <summary>
/// Validator for <see cref="CancelBookingSessionCommand"/>.
/// </summary>
public class CancelBookingSessionCommandValidator : AbstractValidator<CancelBookingSessionCommand>
{
    public CancelBookingSessionCommandValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty()
            .WithMessage("Session ID is required.");

        RuleFor(x => x.CallerUserId)
            .NotEmpty()
            .WithMessage("Caller user ID is required.");

        RuleFor(x => x.CancellationReason)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.CancellationReason))
            .WithMessage("Cancellation reason cannot exceed 1000 characters.");
    }
}

/// <summary>
/// Validator for <see cref="MarkNoShowBookingSessionCommand"/>.
/// </summary>
public class MarkNoShowBookingSessionCommandValidator : AbstractValidator<MarkNoShowBookingSessionCommand>
{
    public MarkNoShowBookingSessionCommandValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty()
            .WithMessage("Session ID is required.");

        RuleFor(x => x.CallerUserId)
            .NotEmpty()
            .WithMessage("Caller user ID is required.");

        RuleFor(x => x.NoShowReason)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.NoShowReason))
            .WithMessage("No-show reason cannot exceed 1000 characters.");
    }
}
