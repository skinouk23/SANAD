using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="UpdateBookingCommand"/>.
/// Only validates the shape of the update payload — business rules
/// (ownership, status guard) are enforced in the handler.
/// </summary>
public class UpdateBookingCommandValidator : AbstractValidator<UpdateBookingCommand>
{
    public UpdateBookingCommandValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("BookingId is required.");

        RuleFor(x => x.PatientNotes)
            .ValidLargeText()
            .When(x => x.PatientNotes != null);

        // When address block is present, line1 is required
        When(x => x.AddressLine1 != null, () =>
        {
            RuleFor(x => x.AddressLine1)
                .NotEmpty().WithMessage("address.line1 must not be empty when an address is provided.")
                .MaximumLength(255).WithMessage("address.line1 must not exceed 255 characters.");
        });
    }
}
