using FluentValidation;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="ValidateBookingCommand"/>.
/// Validates the shape of the request — business rules (ownership, status, expiry)
/// are enforced in the handler.
/// </summary>
public class ValidateBookingCommandValidator : AbstractValidator<ValidateBookingCommand>
{
    public ValidateBookingCommandValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("BookingId is required.");

        RuleFor(x => x.ValidationCode)
            .NotEmpty().WithMessage("ValidationCode is required.")
            .Matches(@"^\d{6}$").WithMessage("ValidationCode must be a 6-digit code.");
    }
}
