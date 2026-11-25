using FluentValidation;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="ConfirmBookingCommand"/>.
/// Validates the shape of the request — business rules (ownership, status)
/// are enforced in the handler.
/// </summary>
public class ConfirmBookingCommandValidator : AbstractValidator<ConfirmBookingCommand>
{
    public ConfirmBookingCommandValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("BookingId is required.");

        RuleFor(x => x.CallerUserId)
            .NotEmpty().WithMessage("CallerUserId is required.");
    }
}
