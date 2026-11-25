using FluentValidation;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for admin provider verification status transitions.
/// </summary>
public class UpdateProviderVerificationStatusCommandValidator
    : AbstractValidator<UpdateProviderVerificationStatusCommand>
{
    public UpdateProviderVerificationStatusCommandValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.AdminUserId)
            .NotEmpty()
            .WithMessage("Admin user ID is required.");

        RuleFor(x => x.VerificationStatus)
            .NotEmpty()
            .WithMessage("Verification status is required.")
            .Must(status => ProviderConstants.VerificationStatuses.All.Contains(status))
            .WithMessage("Verification status must be one of: not_requested, requested, ai_prechecked, approved, rejected.");
    }
}
