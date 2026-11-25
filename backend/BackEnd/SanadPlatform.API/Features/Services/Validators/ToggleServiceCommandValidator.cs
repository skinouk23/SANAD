using FluentValidation;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="ToggleServiceCommand"/>.
/// Ensures required identifiers are present.
/// </summary>
public class ToggleServiceCommandValidator : AbstractValidator<ToggleServiceCommand>
{
    /// <summary>
    /// Initializes validation rules for service toggle.
    /// </summary>
    public ToggleServiceCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Service ID is required.");
    }
}
