using FluentValidation;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="DeleteServiceCommand"/>.
/// Ensures required identifiers are present.
/// </summary>
public class DeleteServiceCommandValidator : AbstractValidator<DeleteServiceCommand>
{
    /// <summary>
    /// Initializes validation rules for service deletion.
    /// </summary>
    public DeleteServiceCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Service ID is required.");
    }
}
