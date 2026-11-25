using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="RateBookingSessionCommand"/>.
/// Validates the shape of the request — business rules (ownership, status, duplicate)
/// are enforced in the handler.
/// </summary>
public class RateBookingSessionCommandValidator : AbstractValidator<RateBookingSessionCommand>
{
    public RateBookingSessionCommandValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty().WithMessage("SessionId is required.");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");

        RuleFor(x => x.Comment)
            .ValidLargeText()
            .When(x => x.Comment != null);
    }
}
