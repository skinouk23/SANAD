using FluentValidation;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="DeleteMyProviderUnavailabilityCommand"/>.
/// </summary>
public class DeleteMyProviderUnavailabilityCommandValidator : AbstractValidator<DeleteMyProviderUnavailabilityCommand>
{
    public DeleteMyProviderUnavailabilityCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.UnavailabilityId)
            .NotEmpty()
            .WithMessage("Unavailability ID is required.");
    }
}
