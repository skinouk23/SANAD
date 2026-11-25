using FluentValidation;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="CompleteBookingCommand"/>.
/// Validates the shape of the request — business rules (ownership, status)
/// are enforced in the handler.
/// </summary>
public class CompleteBookingCommandValidator : AbstractValidator<CompleteBookingCommand>
{
    public CompleteBookingCommandValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("BookingId is required.");

        RuleFor(x => x.CallerUserId)
            .NotEmpty().WithMessage("CallerUserId is required.");
    }
}
