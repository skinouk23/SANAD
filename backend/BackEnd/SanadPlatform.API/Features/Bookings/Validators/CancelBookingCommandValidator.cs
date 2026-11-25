using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="CancelBookingCommand"/>.
/// Validates the shape of the request — business rules (ownership, status)
/// are enforced in the handler.
/// </summary>
public class CancelBookingCommandValidator : AbstractValidator<CancelBookingCommand>
{
    public CancelBookingCommandValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("BookingId is required.");

        RuleFor(x => x.CancellationReason)
            .ValidMediumText()
            .When(x => x.CancellationReason != null);
    }
}
